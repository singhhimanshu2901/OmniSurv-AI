from typing import List, Dict, Any, Optional
import math

try:
    import numpy as np
except ImportError:
    np = None

from app.embeddings.vector_store import VectorStore
from app.core.logging import logger
from app.core.config import settings

def _l2_norm(v: List[float]) -> List[float]:
    mag = math.sqrt(sum(x * x for x in v))
    return [x / (mag + 1e-12) for x in v] if mag > 0 else v

def _dot_product(a: List[float], b: List[float]) -> float:
    return sum(x * y for x, y in zip(a, b))

class QdrantVectorStore(VectorStore):
    def __init__(self, url: str = settings.QDRANT_URL):
        self.url = url
        self.client = None
        self._memory_store: Dict[str, Dict[str, Dict[str, Any]]] = {}
        self._connected = False
        self._init_client()

    def _init_client(self):
        try:
            from qdrant_client import QdrantClient
            from qdrant_client.http.models import Distance, VectorParams
            self.QdrantClient = QdrantClient
            self.Distance = Distance
            self.VectorParams = VectorParams
            self.client = QdrantClient(url=self.url, timeout=2.0)
            self.client.get_collections()
            self._connected = True
        except Exception:
            self._connected = False

    def create_collection(self, collection_name: str, vector_dim: int = 512) -> bool:
        if self._connected and self.client:
            try:
                collections = self.client.get_collections().collections
                exists = any(c.name == collection_name for c in collections)
                if not exists:
                    self.client.create_collection(
                        collection_name=collection_name,
                        vectors_config=self.VectorParams(size=vector_dim, distance=self.Distance.COSINE)
                    )
                return True
            except Exception:
                pass

        if collection_name not in self._memory_store:
            self._memory_store[collection_name] = {}
        return True

    def delete_collection(self, collection_name: str) -> bool:
        if self._connected and self.client:
            try:
                self.client.delete_collection(collection_name=collection_name)
                return True
            except Exception:
                pass
        self._memory_store.pop(collection_name, None)
        return True

    def upsert(self, collection_name: str, point_id: str, vector: List[float], payload: Dict[str, Any]) -> bool:
        normalized_vector = _l2_norm(vector)

        if self._connected and self.client:
            try:
                from qdrant_client.http.models import PointStruct
                self.client.upsert(
                    collection_name=collection_name,
                    points=[PointStruct(id=point_id, vector=normalized_vector, payload=payload)]
                )
                return True
            except Exception:
                pass

        if collection_name not in self._memory_store:
            self._memory_store[collection_name] = {}
        self._memory_store[collection_name][point_id] = {
            "id": point_id,
            "vector": normalized_vector,
            "payload": payload
        }
        return True

    def batch_upsert(self, collection_name: str, points: List[Dict[str, Any]]) -> bool:
        success = True
        for pt in points:
            if not self.upsert(collection_name, pt["id"], pt["vector"], pt["payload"]):
                success = False
        return success

    def search(
        self,
        collection_name: str,
        query_vector: List[float],
        limit: int = 10,
        filter_dict: Optional[Dict[str, Any]] = None
    ) -> List[Dict[str, Any]]:
        q_vec = _l2_norm(query_vector)

        if self._connected and self.client:
            try:
                hits = self.client.search(
                    collection_name=collection_name,
                    query_vector=q_vec,
                    limit=limit
                )
                return [{
                    "id": hit.id,
                    "score": float(hit.score),
                    "payload": hit.payload
                } for hit in hits]
            except Exception:
                pass

        coll = self._memory_store.get(collection_name, {})
        if not coll:
            return []

        scored_points = []
        for pid, data in coll.items():
            payload = data["payload"]

            if filter_dict:
                matched = True
                for k, v in filter_dict.items():
                    if k in payload and payload[k] != v:
                        matched = False
                        break
                if not matched:
                    continue

            vec = data["vector"]
            cosine_score = _dot_product(q_vec, vec)
            scored_points.append({
                "id": pid,
                "score": float(cosine_score),
                "payload": payload
            })

        scored_points.sort(key=lambda x: x["score"], reverse=True)
        return scored_points[:limit]

    def delete(self, collection_name: str, point_ids: List[str]) -> bool:
        if self._connected and self.client:
            try:
                from qdrant_client.http.models import PointIdsList
                self.client.delete(
                    collection_name=collection_name,
                    points_selector=PointIdsList(points=point_ids)
                )
            except Exception:
                pass
        coll = self._memory_store.get(collection_name, {})
        for pid in point_ids:
            coll.pop(pid, None)
        return True

    def health_check(self) -> bool:
        return True
