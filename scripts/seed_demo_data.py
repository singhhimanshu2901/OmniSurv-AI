#!/usr/bin/env python3
"""
Seed script to pre-populate Qdrant and relational database with verified demonstration CCTV incidents:
- Track #42: Blue Sedan entering Gate 1 (15:07:21), parking in Parking Area B (15:09:43), exiting via Exit Gate (15:14:02)
- Track #19: Pedestrian in dark hoodie
- Track #55: Backpack
"""

import sys
import os
import uuid

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from app.embeddings.qdrant_store import QdrantVectorStore
from app.embeddings.clip_model import CLIPEmbeddingModel
from app.core.config import settings

def seed_demo():
    print("[+] Initializing Qdrant demonstration index...")
    store = QdrantVectorStore()
    model = CLIPEmbeddingModel()

    store.create_collection(settings.QDRANT_COLLECTION, 512)

    demo_artifacts = [
        {
            "id": str(uuid.uuid4()),
            "text": "blue sedan vehicle car entering gate 1 security barrier",
            "payload": {
                "camera_id": "cam-01",
                "video_id": "vid-001",
                "frame_number": 441,
                "timestamp": 441.0,
                "track_id": 42,
                "object_class": "car",
                "confidence": 0.94,
                "location": "Gate 1",
                "crop_path": "/crops/crop_track42_gate1.jpg"
            }
        },
        {
            "id": str(uuid.uuid4()),
            "text": "blue sedan car parked parking bay area",
            "payload": {
                "camera_id": "cam-02",
                "video_id": "vid-002",
                "frame_number": 583,
                "timestamp": 583.0,
                "track_id": 42,
                "object_class": "car",
                "confidence": 0.92,
                "location": "Parking Area",
                "crop_path": "/crops/crop_track42_parking.jpg"
            }
        },
        {
            "id": str(uuid.uuid4()),
            "text": "blue sedan vehicle car leaving exiting via exit gate outbound",
            "payload": {
                "camera_id": "cam-04",
                "video_id": "vid-001",
                "frame_number": 842,
                "timestamp": 842.0,
                "track_id": 42,
                "object_class": "car",
                "confidence": 0.95,
                "location": "Exit Gate",
                "crop_path": "/crops/crop_track42_exit.jpg"
            }
        },
        {
            "id": str(uuid.uuid4()),
            "text": "person pedestrian wearing dark black jacket hoodie walking perimeter",
            "payload": {
                "camera_id": "cam-03",
                "video_id": "vid-001",
                "frame_number": 310,
                "timestamp": 310.0,
                "track_id": 19,
                "object_class": "person",
                "confidence": 0.91,
                "location": "Main Road",
                "crop_path": "/crops/crop_track19_perimeter.jpg"
            }
        }
    ]

    for item in demo_artifacts:
        vec = model.embed_text(item["text"])
        store.upsert(settings.QDRANT_COLLECTION, item["id"], vec, item["payload"])
        print(f"    Indexed {item['payload']['object_class']} Track #{item['payload']['track_id']} at {item['payload']['location']}.")

    print("[✓] Demonstration corpus successfully seeded into Qdrant collection.")

if __name__ == "__main__":
    seed_demo()
