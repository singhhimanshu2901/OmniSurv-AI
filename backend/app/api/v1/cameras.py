from typing import List
import uuid
from datetime import datetime

try:
    from fastapi import APIRouter, HTTPException, Depends
except ImportError:
    class APIRouter:
        def __init__(self, *args, **kwargs): pass
        def get(self, *args, **kwargs): return lambda f: f
        def post(self, *args, **kwargs): return lambda f: f
    class HTTPException(Exception):
        def __init__(self, status_code: int, detail: str):
            super().__init__(detail)
            self.status_code = status_code
            self.detail = detail
    def Depends(f=None): return f

from app.schemas.schemas import CameraCreate, CameraResponse

router = APIRouter(prefix="/cameras", tags=["Cameras"])

_CAMERAS_DB = [
    {
        "id": "cam-01",
        "name": "Camera 01 - Gate 1 North Entry",
        "location": "Gate 1",
        "stream_url": "rtsp://cctv.local:554/cam01",
        "status": "active",
        "fps": 30.0,
        "resolution": "1920x1080",
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    },
    {
        "id": "cam-02",
        "name": "Camera 02 - Parking Area B",
        "location": "Parking Area",
        "stream_url": "rtsp://cctv.local:554/cam02",
        "status": "active",
        "fps": 30.0,
        "resolution": "1920x1080",
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    },
    {
        "id": "cam-03",
        "name": "Camera 03 - Main Perimeter Corridor",
        "location": "Main Road",
        "stream_url": "rtsp://cctv.local:554/cam03",
        "status": "active",
        "fps": 30.0,
        "resolution": "1920x1080",
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    },
    {
        "id": "cam-04",
        "name": "Camera 04 - Exit Gate & Loading Dock",
        "location": "Exit",
        "stream_url": "rtsp://cctv.local:554/cam04",
        "status": "active",
        "fps": 30.0,
        "resolution": "1920x1080",
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
]

@router.get("", response_model=List[CameraResponse])
def list_cameras():
    return _CAMERAS_DB

@router.post("", response_model=CameraResponse)
def create_camera(payload: CameraCreate):
    new_cam = {
        "id": f"cam-{str(uuid.uuid4())[:8]}",
        "name": payload.name,
        "location": payload.location,
        "stream_url": payload.stream_url,
        "status": payload.status,
        "fps": payload.fps,
        "resolution": payload.resolution,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    _CAMERAS_DB.append(new_cam)
    return new_cam

@router.get("/{camera_id}", response_model=CameraResponse)
def get_camera(camera_id: str):
    for c in _CAMERAS_DB:
        if c["id"] == camera_id:
            return c
    raise HTTPException(status_code=404, detail=f"Camera {camera_id} not found")
