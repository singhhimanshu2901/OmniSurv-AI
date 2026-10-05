import os
import time
import uuid
try:
    import numpy as np
except ImportError:
    np = None
from typing import Dict, Any, Optional, Callable
from app.cv.video_source import MP4VideoSource
from app.cv.yolo_detector import YOLODetector
from app.cv.bytetrack_tracker import ByteTrackTracker
from app.services.crop_service import CropService
from app.embeddings.clip_model import CLIPEmbeddingModel
from app.embeddings.qdrant_store import QdrantVectorStore
from app.core.config import settings
from app.core.logging import logger

class VideoProcessorService:
    def __init__(self):
        self.detector = YOLODetector()
        self.tracker = ByteTrackTracker()
        self.crop_service = CropService()
        self.embedding_model = CLIPEmbeddingModel()
        self.vector_store = QdrantVectorStore()
        self.jobs: Dict[str, Dict[str, Any]] = {}

    def get_job_status(self, video_id: str) -> Dict[str, Any]:
        return self.jobs.get(video_id, {
            "video_id": video_id,
            "status": "not_found",
            "percentage": 0.0,
            "frames_processed": 0,
            "total_frames": 0,
            "fps": 0.0,
            "detections_count": 0,
            "tracks_count": 0,
            "embeddings_count": 0
        })

    def process_video(
        self, 
        video_id: str, 
        video_path: str,
        camera_id: str = "cam-01",
        location: str = "Gate 1",
        progress_callback: Optional[Callable[[Dict[str, Any]], None]] = None
    ) -> Dict[str, Any]:
        """
        Executes full pipeline:
        Frame -> YOLO -> ByteTrack -> Crop -> CLIP -> Qdrant Indexing
        """
        logger.info(f"Starting video processing job for video_id={video_id}, path={video_path}")
        source = MP4VideoSource(video_path)
        
        job_state = {
            "video_id": video_id,
            "status": "processing",
            "frames_processed": 0,
            "total_frames": 100,
            "percentage": 0.0,
            "fps": 0.0,
            "detections_count": 0,
            "tracks_count": 0,
            "embeddings_count": 0,
            "start_time": time.time()
        }
        self.jobs[video_id] = job_state

        has_video = source.open()
        meta = source.get_metadata() if has_video else {}
        total_frames = meta.get("total_frames", 120) or 120
        job_state["total_frames"] = total_frames

        frame_idx = 0
        all_detections = 0
        all_tracks = set()
        all_embeddings = 0

        # Create or ensure vector collection
        self.vector_store.create_collection(settings.QDRANT_COLLECTION, 512)

        start_ts = time.time()

        while frame_idx < total_frames:
            success = False
            frame = None
            timestamp = frame_idx / 30.0

            if has_video:
                success, frame, timestamp, _ = source.read_frame()
                if not success or frame is None:
                    break
            else:
                # Synthetic CCTV frame generator if video file is simulated
                if np is not None:
                    frame = np.zeros((720, 1280, 3), dtype=np.uint8)
                    frame[:] = (35, 35, 40)
                    cv_x = int(200 + (frame_idx * 7) % 900)
                    cv_y = int(350 + (frame_idx * 2) % 150)
                    frame[cv_y:cv_y+80, cv_x:cv_x+160] = (180, 80, 20)
                else:
                    frame = {"width": 1280, "height": 720, "frame_number": frame_idx}
                success = True

            # 1. YOLOv11x Object Detection
            detections = self.detector.detect(frame, frame_number=frame_idx, timestamp=timestamp)
            all_detections += len(detections)

            # 2. ByteTrack Object Tracking
            tracks = self.tracker.update(detections, frame_number=frame_idx, timestamp=timestamp)
            for t in tracks:
                all_tracks.add(t.track_id)

                # 3. Object Crop Extraction
                crop, crop_path = self.crop_service.extract_crop(
                    frame=frame,
                    bbox=(t.x1, t.y1, t.x2, t.y2),
                    track_id=t.track_id,
                    frame_number=frame_idx
                )

                # 4. CLIP ViT-B/32 Visual Embedding & Qdrant Upsert
                if crop is not None:
                    emb = self.embedding_model.embed_image(crop)
                    point_id = str(uuid.uuid4())
                    payload = {
                        "camera_id": camera_id,
                        "video_id": video_id,
                        "frame_number": frame_idx,
                        "timestamp": round(timestamp, 2),
                        "track_id": t.track_id,
                        "object_class": t.object_class,
                        "confidence": t.confidence,
                        "location": location,
                        "crop_path": crop_path
                    }
                    self.vector_store.upsert(settings.QDRANT_COLLECTION, point_id, emb, payload)
                    all_embeddings += 1

            frame_idx += 1
            elapsed = max(0.001, time.time() - start_ts)
            current_fps = round(frame_idx / elapsed, 1)

            job_state["frames_processed"] = frame_idx
            job_state["percentage"] = round((frame_idx / total_frames) * 100, 1)
            job_state["fps"] = current_fps
            job_state["detections_count"] = all_detections
            job_state["tracks_count"] = len(all_tracks)
            job_state["embeddings_count"] = all_embeddings

            if progress_callback and frame_idx % 5 == 0:
                progress_callback(job_state)

        source.release()
        job_state["status"] = "completed"
        job_state["percentage"] = 100.0
        logger.info(f"Video processing completed for {video_id}: {job_state['frames_processed']} frames, {len(all_tracks)} tracks, {all_embeddings} embeddings.")
        return job_state

video_processor_service = VideoProcessorService()
