from datetime import datetime
import uuid
from sqlalchemy import (
    Column, String, Float, Integer, DateTime, ForeignKey, Text, JSON, Boolean
)
from sqlalchemy.orm import relationship
from app.db.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class Camera(Base):
    __tablename__ = "cameras"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    name = Column(String(128), nullable=False)
    location = Column(String(256), nullable=False)
    stream_url = Column(String(512), nullable=True)
    status = Column(String(32), default="active")  # active, offline, maintenance
    fps = Column(Float, default=30.0)
    resolution = Column(String(64), default="1920x1080")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    videos = relationship("Video", back_populates="camera", cascade="all, delete-orphan")


class Video(Base):
    __tablename__ = "videos"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    camera_id = Column(String(64), ForeignKey("cameras.id"), nullable=False)
    filename = Column(String(256), nullable=False)
    source_type = Column(String(32), default="mp4")  # mp4, rtsp_dump
    duration = Column(Float, default=0.0)
    fps = Column(Float, default=30.0)
    width = Column(Integer, default=1920)
    height = Column(Integer, default=1080)
    total_frames = Column(Integer, default=0)
    status = Column(String(32), default="queued")  # queued, processing, completed, failed
    created_at = Column(DateTime, default=datetime.utcnow)

    camera = relationship("Camera", back_populates="videos")
    frames = relationship("Frame", back_populates="video", cascade="all, delete-orphan")
    tracked_objects = relationship("TrackedObject", back_populates="video", cascade="all, delete-orphan")


class Frame(Base):
    __tablename__ = "frames"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    video_id = Column(String(64), ForeignKey("videos.id"), nullable=False)
    frame_number = Column(Integer, nullable=False, index=True)
    timestamp = Column(Float, nullable=False, index=True)  # seconds relative to video start
    frame_path = Column(String(512), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    video = relationship("Video", back_populates="frames")
    detections = relationship("Detection", back_populates="frame", cascade="all, delete-orphan")


class Detection(Base):
    __tablename__ = "detections"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    frame_id = Column(String(64), ForeignKey("frames.id"), nullable=False)
    track_id = Column(Integer, nullable=True, index=True)
    object_class = Column(String(64), nullable=False, index=True)  # person, car, bag
    confidence = Column(Float, nullable=False)
    x1 = Column(Float, nullable=False)
    y1 = Column(Float, nullable=False)
    x2 = Column(Float, nullable=False)
    y2 = Column(Float, nullable=False)
    center_x = Column(Float, nullable=False)
    center_y = Column(Float, nullable=False)
    crop_path = Column(String(512), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    frame = relationship("Frame", back_populates="detections")


class TrackedObject(Base):
    __tablename__ = "tracked_objects"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    video_id = Column(String(64), ForeignKey("videos.id"), nullable=False)
    track_id = Column(Integer, nullable=False, index=True)
    object_class = Column(String(64), nullable=False)
    first_seen = Column(Float, nullable=False)  # seconds
    last_seen = Column(Float, nullable=False)   # seconds
    status = Column(String(32), default="active")  # active, lost, exited
    attributes_json = Column(JSON, default=dict)

    video = relationship("Video", back_populates="tracked_objects")
    trajectories = relationship("Trajectory", back_populates="tracked_object", cascade="all, delete-orphan")


class Trajectory(Base):
    __tablename__ = "trajectories"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    tracked_object_id = Column(String(64), ForeignKey("tracked_objects.id"), nullable=True)
    track_id = Column(Integer, nullable=False, index=True)
    timestamp = Column(Float, nullable=False)
    x = Column(Float, nullable=False)
    y = Column(Float, nullable=False)
    camera_id = Column(String(64), nullable=False)
    frame_number = Column(Integer, nullable=False)

    tracked_object = relationship("TrackedObject", back_populates="trajectories")


class Investigation(Base):
    __tablename__ = "investigations"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    query = Column(Text, nullable=False)
    status = Column(String(32), default="started")  # started, processing, completed, failed
    extracted_entities = Column(JSON, default=dict)
    started_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

    evidences = relationship("Evidence", back_populates="investigation", cascade="all, delete-orphan")
    results = relationship("InvestigationResult", back_populates="investigation", cascade="all, delete-orphan")


class Evidence(Base):
    __tablename__ = "evidences"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    investigation_id = Column(String(64), ForeignKey("investigations.id"), nullable=False)
    video_id = Column(String(64), ForeignKey("videos.id"), nullable=True)
    frame_id = Column(String(64), ForeignKey("frames.id"), nullable=True)
    track_id = Column(Integer, nullable=True)
    timestamp = Column(Float, nullable=False)
    evidence_type = Column(String(64), default="detection_crop")  # detection_crop, trajectory_point, appearance
    confidence = Column(Float, default=1.0)
    similarity_score = Column(Float, default=0.0)
    source_reference = Column(String(512), nullable=True)
    crop_path = Column(String(512), nullable=True)
    metadata_json = Column(JSON, default=dict)

    investigation = relationship("Investigation", back_populates="evidences")


class InvestigationResult(Base):
    __tablename__ = "investigation_results"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    investigation_id = Column(String(64), ForeignKey("investigations.id"), nullable=False)
    summary = Column(Text, nullable=False)
    timeline = Column(JSON, default=list)
    report_json = Column(JSON, default=dict)
    created_at = Column(DateTime, default=datetime.utcnow)

    investigation = relationship("Investigation", back_populates="results")
