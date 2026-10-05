import os
import uuid
from datetime import datetime
from typing import List
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, BackgroundTasks
from app.schemas.schemas import VideoResponse, VideoProcessingStatus
from app.services.video_service import video_processor_service
from app.core.config import settings

router = APIRouter(prefix="/videos", tags=["Videos"])

_VIDEOS_DB = [
    {
        "id": "vid-001",
        "camera_id": "cam-01",
        "filename": "gate1_incident_20261005_1500.mp4",
        "source_type": "mp4",
        "duration": 180.0,
        "fps": 30.0,
        "width": 1920,
        "height": 1080,
        "total_frames": 5400,
        "status": "completed",
        "created_at": datetime.utcnow()
    },
    {
        "id": "vid-002",
        "camera_id": "cam-02",
        "filename": "parking_area_b_feed.mp4",
        "source_type": "mp4",
        "duration": 240.0,
        "fps": 30.0,
        "width": 1920,
        "height": 1080,
        "total_frames": 7200,
        "status": "completed",
        "created_at": datetime.utcnow()
    }
]

@router.get("", response_model=List[VideoResponse])
def list_videos():
    return _VIDEOS_DB

@router.post("/upload", response_model=VideoResponse)
async def upload_video(
    file: UploadFile = File(...),
    camera_id: str = Form("cam-01"),
    source_type: str = Form("mp4")
):
    os.makedirs(settings.VIDEOS_DIR, exist_ok=True)
    video_id = f"vid-{str(uuid.uuid4())[:8]}"
    clean_filename = f"{video_id}_{file.filename}"
    file_path = os.path.join(settings.VIDEOS_DIR, clean_filename)
    
    contents = await file.read()
    with open(file_path, "wb") as f:
        f.write(contents)

    video_entry = {
        "id": video_id,
        "camera_id": camera_id,
        "filename": clean_filename,
        "source_type": source_type,
        "duration": 60.0,
        "fps": 30.0,
        "width": 1920,
        "height": 1080,
        "total_frames": 1800,
        "status": "queued",
        "created_at": datetime.utcnow()
    }
    _VIDEOS_DB.append(video_entry)
    return video_entry

@router.get("/{video_id}", response_model=VideoResponse)
def get_video(video_id: str):
    for v in _VIDEOS_DB:
        if v["id"] == video_id:
            return v
    raise HTTPException(status_code=404, detail="Video not found")

@router.post("/{video_id}/process", response_model=VideoProcessingStatus)
def trigger_video_processing(video_id: str, background_tasks: BackgroundTasks):
    video = None
    for v in _VIDEOS_DB:
        if v["id"] == video_id:
            video = v
            break
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")

    video["status"] = "processing"
    video_path = os.path.join(settings.VIDEOS_DIR, video["filename"])

    # Enqueue async task
    background_tasks.add_task(
        video_processor_service.process_video,
        video_id=video_id,
        video_path=video_path,
        camera_id=video["camera_id"]
    )

    return VideoProcessingStatus(
        video_id=video_id,
        status="processing",
        frames_processed=0,
        total_frames=video["total_frames"],
        percentage=0.0,
        fps=30.0,
        detections_count=0,
        tracks_count=0,
        embeddings_count=0,
        message="Processing enqueued in background worker pool."
    )

@router.get("/{video_id}/status", response_model=VideoProcessingStatus)
def get_video_status(video_id: str):
    status_data = video_processor_service.get_job_status(video_id)
    return VideoProcessingStatus(
        video_id=video_id,
        status=status_data.get("status", "completed"),
        frames_processed=status_data.get("frames_processed", 5400),
        total_frames=status_data.get("total_frames", 5400),
        percentage=status_data.get("percentage", 100.0),
        fps=status_data.get("fps", 28.5),
        detections_count=status_data.get("detections_count", 142),
        tracks_count=status_data.get("tracks_count", 8),
        embeddings_count=status_data.get("embeddings_count", 96),
        message="OK"
    )
