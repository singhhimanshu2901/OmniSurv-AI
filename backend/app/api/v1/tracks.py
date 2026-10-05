from typing import List, Dict, Any
from fastapi import APIRouter, HTTPException
from app.schemas.schemas import TrackTrajectoryResponse
from app.services.trajectory_service import trajectory_service

router = APIRouter(prefix="/tracks", tags=["Tracks & Trajectories"])

# Seed demonstrative tracks for Gate 1 blue sedan, perimeter pedestrian, etc.
_TRACKS_STORE = {
    42: {
        "track_id": 42,
        "object_class": "car",
        "first_seen": 441.0,  # 15:07:21
        "last_seen": 842.0,   # 15:14:02
        "points": [
            {"timestamp": 441.0, "x": 120.0, "y": 680.0, "camera_id": "cam-01", "location": "Gate 1", "frame_number": 420},
            {"timestamp": 485.0, "x": 380.0, "y": 590.0, "camera_id": "cam-01", "location": "Gate 1", "frame_number": 510},
            {"timestamp": 583.0, "x": 640.0, "y": 480.0, "camera_id": "cam-02", "location": "Parking Area", "frame_number": 750},
            {"timestamp": 710.0, "x": 780.0, "y": 420.0, "camera_id": "cam-02", "location": "Parking Area", "frame_number": 980},
            {"timestamp": 842.0, "x": 920.0, "y": 320.0, "camera_id": "cam-04", "location": "Exit", "frame_number": 1240}
        ]
    },
    19: {
        "track_id": 19,
        "object_class": "person",
        "first_seen": 310.0,
        "last_seen": 620.0,
        "points": [
            {"timestamp": 310.0, "x": 210.0, "y": 450.0, "camera_id": "cam-03", "location": "Main Road", "frame_number": 310},
            {"timestamp": 450.0, "x": 340.0, "y": 460.0, "camera_id": "cam-03", "location": "Main Road", "frame_number": 450},
            {"timestamp": 620.0, "x": 580.0, "y": 470.0, "camera_id": "cam-03", "location": "Main Road", "frame_number": 620}
        ]
    }
}

@router.get("/{track_id}")
def get_track_details(track_id: int):
    if track_id not in _TRACKS_STORE:
        raise HTTPException(status_code=404, detail=f"Track ID {track_id} not found")
    t = _TRACKS_STORE[track_id]
    return {
        "track_id": t["track_id"],
        "object_class": t["object_class"],
        "first_seen": t["first_seen"],
        "last_seen": t["last_seen"],
        "total_observations": len(t["points"])
    }

@router.get("/{track_id}/trajectory", response_model=TrackTrajectoryResponse)
def get_track_trajectory(track_id: int):
    if track_id not in _TRACKS_STORE:
        raise HTTPException(status_code=404, detail=f"Track ID {track_id} not found")
    t = _TRACKS_STORE[track_id]
    return trajectory_service.reconstruct_trajectory(
        track_id=t["track_id"],
        object_class=t["object_class"],
        points=t["points"]
    )
