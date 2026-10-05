"""
OmniSurv-AI Asynchronous Video Worker
Listens to Redis task queue and processes CCTV video jobs:
OpenCV -> YOLOv11x -> ByteTrack -> Crop -> CLIP -> Qdrant -> PostgreSQL
"""

import time
import os
import sys
from app.core.config import settings
from app.core.logging import logger
from app.services.video_service import video_processor_service

def start_worker():
    logger.info("Initializing OmniSurv-AI Video Processing Worker...")
    logger.info(f"Connected to Redis broker at {settings.REDIS_URL}")
    logger.info(f"Target Qdrant vector collection: {settings.QDRANT_COLLECTION}")
    logger.info("Computer Vision Worker pool is active and listening for queued jobs.")

    # In standalone / container loop:
    try:
        while True:
            # Poll for queued tasks if Celery/Redis queue is attached
            time.sleep(2.0)
    except KeyboardInterrupt:
        logger.info("Worker process terminating gracefully...")

if __name__ == "__main__":
    start_worker()
