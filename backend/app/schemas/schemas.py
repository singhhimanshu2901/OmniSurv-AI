from datetime import datetime
from typing import List, Optional, Dict, Any

try:
    from pydantic import BaseModel, Field
except ImportError:
    # Lightweight fallback for testing without external packages
    class BaseModel:
        def __init__(self, **kwargs):
            for k, v in kwargs.items():
                setattr(self, k, v)
        def model_dump(self):
            return {k: v for k, v in self.__dict__.items() if not k.startswith('_')}
        def dict(self):
            return self.model_dump()
    def Field(default=None, **kwargs):
        return default

# --- Camera Schemas ---
class CameraBase(BaseModel):
    name: str = "Camera"
    location: str = "Zone"
    stream_url: Optional[str] = None
    status: str = "active"
    fps: float = 30.0
    resolution: str = "1920x1080"

class CameraCreate(CameraBase):
    pass

class CameraResponse(CameraBase):
    id: str = ""
    created_at: Any = None
    updated_at: Any = None

# --- Video Schemas ---
class VideoBase(BaseModel):
    camera_id: str = ""
    filename: str = ""
    source_type: str = "mp4"

class VideoCreate(VideoBase):
    pass

class VideoResponse(VideoBase):
    id: str = ""
    duration: float = 0.0
    fps: float = 30.0
    width: int = 1920
    height: int = 1080
    total_frames: int = 0
    status: str = "queued"
    created_at: Any = None

class VideoProcessingStatus(BaseModel):
    video_id: str = ""
    status: str = "processing"
    frames_processed: int = 0
    total_frames: int = 0
    percentage: float = 0.0
    fps: float = 0.0
    detections_count: int = 0
    tracks_count: int = 0
    embeddings_count: int = 0
    message: Optional[str] = None

# --- Detection & Tracking Schemas ---
class DetectionResponse(BaseModel):
    id: str = ""
    frame_id: str = ""
    track_id: Optional[int] = None
    object_class: str = ""
    confidence: float = 0.0
    x1: float = 0.0
    y1: float = 0.0
    x2: float = 0.0
    y2: float = 0.0
    center_x: float = 0.0
    center_y: float = 0.0
    crop_path: Optional[str] = None
    created_at: Any = None

class TrajectoryPoint(BaseModel):
    timestamp: float = 0.0
    x: float = 0.0
    y: float = 0.0
    camera_id: str = ""
    frame_number: int = 0

class TrackTrajectoryResponse(BaseModel):
    track_id: int = 0
    object_class: str = ""
    first_seen: float = 0.0
    last_seen: float = 0.0
    duration: float = 0.0
    frame_count: int = 0
    camera_sequence: List[str] = []
    location_sequence: List[str] = []
    path: List[TrajectoryPoint] = []
    gaps: List[Dict[str, Any]] = []
    entry_event: Optional[Dict[str, Any]] = None
    exit_event: Optional[Dict[str, Any]] = None

# --- Hybrid Search Schemas ---
class SearchRequest(BaseModel):
    query: Optional[str] = None
    object_class: Optional[str] = None
    visual_description: Optional[str] = None
    color: Optional[str] = None
    camera_id: Optional[str] = None
    location: Optional[str] = None
    start_time: Optional[float] = None
    end_time: Optional[float] = None
    track_id: Optional[int] = None
    minimum_confidence: float = 0.40
    limit: int = 20

class SearchResultItem(BaseModel):
    track_id: int = 0
    object_class: str = ""
    confidence: float = 0.0
    first_seen: float = 0.0
    last_seen: float = 0.0
    camera_id: str = ""
    location: str = ""
    similarity_score: float = 0.0
    crop_path: Optional[str] = None
    evidence_frames: List[int] = []
    status: str = "active"

# --- Natural Language Investigation Schemas ---
class ExtractedEntities(BaseModel):
    object_class: Optional[str] = None
    attributes: List[str] = []
    color: Optional[str] = None
    location: Optional[str] = None
    camera: Optional[str] = None
    start_time: Optional[float] = None
    end_time: Optional[float] = None
    action: Optional[str] = None
    tracking_requirement: bool = True

class InvestigationCreate(BaseModel):
    query: str = ""

class TimelineEvent(BaseModel):
    timestamp: float = 0.0
    time_str: str = ""
    track_id: int = 0
    object_class: str = ""
    camera_id: str = ""
    location: str = ""
    event_type: str = "DETECTED"
    description: str = ""
    confidence: float = 0.0
    evidence_crop: Optional[str] = None

class ForensicReportSchema(BaseModel):
    case_id: str = ""
    investigation_query: str = ""
    generated_at: str = ""
    executive_summary: str = ""
    detected_entities: List[Dict[str, Any]] = []
    timeline: List[TimelineEvent] = []
    trajectory_analysis: Dict[str, Any] = {}
    evidence_summary: List[Dict[str, Any]] = []
    confidence_assessment: Dict[str, Any] = {}
    camera_information: List[Dict[str, Any]] = []
    uncertainty_statement: str = ""
    limitations: List[str] = []
