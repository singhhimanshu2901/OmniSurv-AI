# OMNISURV-AI Architecture Specification

## 1. System Topology
OmniSurv-AI is designed with decoupled, asynchronous microservices:

```
                   React 19 Dashboard (Port 3000)
                              │
                    REST API + WebSockets
                              ▼
                     FastAPI Backend (Port 8000)
                              │
          ┌───────────────────┼───────────────────┐
          ▼                   ▼                   ▼
    Video Ingestion     Hybrid Search    LangGraph Agent
          │                   │                   │
    OpenCV + YOLO       Qdrant Vector     State Machine
     + ByteTrack         + PostgreSQL    Reasoning Nodes
          │                   │                   │
          └───────────────────┼───────────────────┘
                              │
                      Redis Task Queue
                              │
                     Asynchronous Workers
```

## 2. Component Breakdown
1. **Video Ingestion Engine (`backend/app/cv/video_source.py`):**
   - Supports local MP4 storage and live RTSP streaming via ONVIF.
   - Non-blocking frame extraction, preserving calibrated timestamp offsets.
2. **YOLOv11x Object Localization (`backend/app/cv/yolo_detector.py`):**
   - High-throughput detection on targets: person, vehicle/car, luggage/bag.
   - Outputs normalized bounding boxes and confidence scores.
3. **ByteTrack Association Engine (`backend/app/cv/bytetrack_tracker.py`):**
   - 2-stage association with Kalman velocity state vector $[u, v, s, r, \dot{u}, \dot{v}, \dot{s}, \dot{r}]^T$.
   - Persistent Track IDs preserved across multi-second occlusions.
4. **Crop Normalization & CLIP Embeddings (`backend/app/embeddings/clip_model.py`):**
   - Clamps bounding box, adds adaptive contextual padding, standardizes to 224x224.
   - Generates 512-dimensional L2-normalized vector representations.
5. **Vector Store (`backend/app/embeddings/qdrant_store.py`):**
   - Qdrant collection with HNSW indexing on cosine distance.
   - Rich payloads: camera_id, timestamp, track_id, object_class, confidence, crop_path.
6. **LangGraph Forensic Agent (`backend/app/agents/langgraph_forensic_agent.py`):**
   - 7-node state graph implementing strict anti-hallucination validation before report generation.
