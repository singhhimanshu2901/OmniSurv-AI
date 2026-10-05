from typing import List, Dict, Any, Optional
from app.embeddings.vector_store import VectorStore
from app.embeddings.clip_model import CLIPEmbeddingModel
from app.search.filters import TemporalFilter, SpatialFilter, MetadataFilter
from app.core.config import settings
from app.core.logging import logger

class HybridSearchEngine:
    def __init__(self, vector_store: VectorStore, embedding_model: Optional[CLIPEmbeddingModel] = None):
        self.vector_store = vector_store
        self.embedding_model = embedding_model or CLIPEmbeddingModel()
        self.collection_name = settings.QDRANT_COLLECTION

    def search(
        self,
        query_text: Optional[str] = None,
        object_class: Optional[str] = None,
        color: Optional[str] = None,
        camera_id: Optional[str] = None,
        location: Optional[str] = None,
        start_time: Optional[float] = None,
        end_time: Optional[float] = None,
        track_id: Optional[int] = None,
        minimum_confidence: float = 0.35,
        limit: int = 20
    ) -> List[Dict[str, Any]]:
        """
        Executes multi-stage hybrid search:
        1. Temporal Filter
        2. Spatial Filter
        3. Metadata Filter
        4. Visual Embedding Vector Similarity
        5. Track Grouping & Aggregation
        """
        temporal_filter = TemporalFilter(start_time, end_time)
        spatial_filter = SpatialFilter(
            allowed_cameras=[camera_id] if camera_id else None,
            allowed_locations=[location] if location else None
        )
        metadata_filter = MetadataFilter(object_class, minimum_confidence, track_id)

        # Build composite query text for multimodal embedding
        search_prompt_tokens = []
        if color:
            search_prompt_tokens.append(color)
        if object_class:
            search_prompt_tokens.append(object_class)
        if query_text:
            search_prompt_tokens.append(query_text)
        
        full_query = " ".join(search_prompt_tokens).strip() or "cctv object detection"
        query_vec = self.embedding_model.embed_text(full_query)

        # Retrieve candidates from vector store
        raw_hits = self.vector_store.search(
            collection_name=self.collection_name,
            query_vector=query_vec,
            limit=limit * 5
        )

        filtered_results: List[Dict[str, Any]] = []

        for hit in raw_hits:
            payload = hit.get("payload", {})
            t = float(payload.get("timestamp", 0.0))
            cam = str(payload.get("camera_id", ""))
            loc = str(payload.get("location", ""))
            cls = str(payload.get("object_class", ""))
            conf = float(payload.get("confidence", 0.0))
            tid = int(payload.get("track_id", 0))

            # Apply deterministic filters
            if not temporal_filter.apply(t):
                continue
            if not spatial_filter.apply(cam, loc):
                continue
            if not metadata_filter.apply(cls, conf, tid):
                continue

            filtered_results.append({
                "id": hit.get("id"),
                "similarity_score": round(float(hit.get("score", 0.0)), 4),
                "track_id": tid,
                "object_class": cls,
                "confidence": round(conf, 3),
                "timestamp": round(t, 2),
                "camera_id": cam,
                "location": loc,
                "crop_path": payload.get("crop_path"),
                "frame_number": payload.get("frame_number", 0)
            })

        # Group by Track ID to assemble coherent track evidence
        grouped_tracks: Dict[int, Dict[str, Any]] = {}
        for r in filtered_results:
            tid = r["track_id"]
            if tid not in grouped_tracks:
                grouped_tracks[tid] = {
                    "track_id": tid,
                    "object_class": r["object_class"],
                    "confidence": r["confidence"],
                    "first_seen": r["timestamp"],
                    "last_seen": r["timestamp"],
                    "camera_id": r["camera_id"],
                    "location": r["location"],
                    "crop_path": r["crop_path"],
                    "similarity_score": r["similarity_score"],
                    "evidence_frames": [r["frame_number"]],
                    "status": "active"
                }
            else:
                gt = grouped_tracks[tid]
                gt["first_seen"] = min(gt["first_seen"], r["timestamp"])
                gt["last_seen"] = max(gt["last_seen"], r["timestamp"])
                gt["similarity_score"] = max(gt["similarity_score"], r["similarity_score"])
                if r["frame_number"] not in gt["evidence_frames"]:
                    gt["evidence_frames"].append(r["frame_number"])

        sorted_tracks = sorted(grouped_tracks.values(), key=lambda x: x["similarity_score"], reverse=True)
        return sorted_tracks[:limit]
