import os
from typing import List

try:
    from pydantic_settings import BaseSettings
except ImportError:
    class BaseSettings:
        def __init__(self, **kwargs):
            for k, v in self.__class__.__dict__.items():
                if not k.startswith('_') and not callable(v):
                    setattr(self, k, getattr(self, k, v))

class Settings(BaseSettings):
    # Application Metadata & Networking
    APP_NAME: str = "OmniSurv-AI"
    APP_ENV: str = "development"
    API_V1_STR: str = "/api/v1"
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000
    LOG_LEVEL: str = "INFO"
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:8000",
        "http://127.0.0.1:3000",
        "*"
    ]
    
    # Relational DB (PostgreSQL)
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "postgresql://omnisurv:omnisurv_secure_pass@localhost:5432/omnisurv_db"
    )
    DATABASE_POOL_SIZE: int = 20
    DATABASE_MAX_OVERFLOW: int = 10
    
    # Redis & Async Processing
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    CELERY_TASK_ALWAYS_EAGER: bool = False
    
    # Qdrant Vector Store
    QDRANT_URL: str = os.getenv("QDRANT_URL", "http://localhost:6333")
    QDRANT_COLLECTION: str = "cctv_crops_clip_vit_b32"
    QDRANT_VECTOR_DIM: int = 512
    QDRANT_DISTANCE_METRIC: str = "Cosine"
    
    # Computer Vision & Models
    MODEL_PATH: str = "./ml/weights"
    YOLO_MODEL: str = "yolov11x.pt"
    YOLO_CONFIDENCE_THRESHOLD: float = 0.35
    YOLO_IOU_THRESHOLD: float = 0.45
    
    # Tracking
    BYTE_TRACK_MAX_LOST: int = 30
    BYTE_TRACK_MIN_CONF: float = 0.30
    
    # Multimodal Embeddings
    CLIP_MODEL_NAME: str = "ViT-B/32"
    CLIP_ONNX_PATH: str = "./ml/weights/clip_vit_b32.onnx"
    EMBEDDING_DEVICE: str = "cpu"
    EMBEDDING_BATCH_SIZE: int = 32
    
    # File Storage Paths
    DATA_DIR: str = "./data"
    VIDEOS_DIR: str = "./data/videos"
    FRAMES_DIR: str = "./data/frames"
    CROPS_DIR: str = "./data/crops"
    EXPORTS_DIR: str = "./data/exports"
    
    # AI & Forensic Rules
    ANTI_HALLUCINATION_STRICT_MODE: bool = True
    LLM_PROVIDER: str = "gemini"
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    LLM_MODEL: str = "gemini-2.5-flash"

    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()
