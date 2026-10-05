# OMNISURV-AI
### Multimodal Intelligent CCTV Forensic & Event Intelligence System

![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)
![Python](https://img.shields.io/badge/Python-3.10-blue)
![React](https://img.shields.io/badge/React-19-cyan)
![FastAPI](https://img.shields.io/badge/FastAPI-0.111-brightgreen)
![Qdrant](https://img.shields.io/badge/Qdrant-v1.11-red)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED)

---

## 1. Project Overview & Vision
In traditional surveillance setups, security investigators must manually scrutinize hours of continuous CCTV footage to trace suspects, stolen vehicles, or lost items. **OmniSurv-AI** transforms this labor-intensive process into an evidence-grounded forensic search and event intelligence pipeline.

An investigator can ask natural-language inquiries such as:
> *"Find the blue sedan near Gate 1 after 15:00 and track its movement until exit."*

OmniSurv-AI executes a structured multi-stage pipeline:
1. **Raw CCTV Ingestion:** OpenCV frame extraction at calibrated frame rates.
2. **Object Detection:** YOLOv11x object detection for pedestrians, vehicles, and bags.
3. **Multi-Object Tracking:** ByteTrack with Kalman filtering to maintain persistent Track IDs across occlusions.
4. **Crop Extraction & Normalization:** Bounding box clamping, padding, and 224x224 standardization.
5. **Multimodal Embeddings:** CLIP ViT-B/32 generates 512-dimensional normalized visual vectors.
6. **Hybrid Indexing:** Qdrant HNSW vector index + PostgreSQL relational metadata source-of-truth.
7. **Agentic Forensic Reasoning:** Evidence-driven LangGraph state workflow.
8. **Trajectory Reconstruction:** Multi-camera path stitching with explicit blind-spot gap representation.
9. **Anti-Hallucination Gate:** Factual validation ensuring zero hallucinated evidence.
10. **Interactive Forensic Console:** Synchronized video player, clickable timeline, trajectory map, and exportable reports.

---

## 2. System Architecture

```
Raw CCTV Stream / MP4
        │
        ▼
   OpenCV Ingestion
        │
        ▼
  YOLOv11x Detection
        │
        ▼
  ByteTrack Tracking  ──> Persistent Track IDs
        │
        ▼
  Crop Extraction
        │
        ▼
 CLIP ViT-B/32 (512D)
        │
  ┌─────┴────────────────┐
  ▼                      ▼
Qdrant Vector DB    PostgreSQL Relational DB
(Visual Embeddings) (Cameras, Tracks, Detections, Trajectories)
  └─────┬────────────────┘
        │
        ▼
Hybrid Temporal / Spatial / Vector Search Engine
        │
        ▼
LangGraph Forensic Agent
 ├── Query Analyzer
 ├── Temporal/Spatial Gate
 ├── Deterministic Hybrid Search
 ├── Trajectory Stitcher
 ├── Evidence Validator (Anti-Hallucination)
 ├── Timeline Generator
 └── Forensic Report Generator
        │
        ▼
Interactive React Forensic Dashboard
 (CCTV Scrubber, Clickable Timeline, Trajectory Map, Evidence Vault)
```

---

## 3. Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons, Motion.
- **Backend API:** Python 3.10, FastAPI, Pydantic v2, SQLAlchemy 2.0.
- **Computer Vision:** OpenCV, YOLOv11x, ByteTrack.
- **Embeddings:** CLIP ViT-B/32, ONNX Runtime.
- **Databases:** PostgreSQL (Relational metadata) & Qdrant (512D Vector database).
- **Agentic AI:** LangChain & LangGraph deterministic state graphs.
- **Async Queue:** Redis 7.
- **DevOps:** Docker, Docker Compose, Healthchecks.

---

## 4. Quick Start & Local Execution

### Option A: Run via Docker Compose (Recommended)
```bash
# Clone the repository
git clone https://github.com/omnisurv-ai/omnisurv-ai.git
cd omnisurv-ai

# Copy environment variables
cp .env.example .env

# Spin up Postgres, Qdrant, Redis, FastAPI backend, Worker, and React dashboard
docker-compose up --build
```
- React Forensic Dashboard: `http://localhost:3000`
- FastAPI Documentation (Swagger): `http://localhost:8000/docs`
- Qdrant Web UI: `http://localhost:6333/dashboard`

### Option B: Local Development
```bash
# 1. Backend
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# 2. Frontend
cd ..
npm install
npm run dev
```

---

## 5. Demonstration Workflow
1. Navigate to `http://localhost:3000`.
2. Inspect the **Live CCTV Multi-Feed Console** (Gate 1, Parking Area, Perimeter, Exit Gate).
3. Try standard queries:
   - *"Find the blue sedan near Gate 1 after 15:00 and track its movement until exit."*
   - *"Track person wearing dark hoodie carrying black backpack."*
4. Watch the 7-node LangGraph reasoning pipeline execute in real time.
5. Click any evidence card in the **Evidence Vault** to automatically seek the CCTV player to the exact second, spotlight the bounding box, and highlight the track.
6. Explore the **2D Trajectory Map** showing transitions between surveillance zones and camera blind spots.
7. Export the official **Forensic Incident Report**.
