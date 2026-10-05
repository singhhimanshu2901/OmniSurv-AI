# ENVIRONMENT AUDIT REPORT
### Project: OMNISURV-AI (Multimodal CCTV Forensic & Event Intelligence System)

## 1. Audit Overview
This audit verifies synchronization between `.env.example`, `backend/app/core/config.py`, and actual runtime usages across the backend and frontend modules.

## 2. Variable Comparison Matrix

| Variable Name | Present in `.env.example` | Present in `config.py` | Default Value | Actual Usage in Code | Status |
| :--- | :---: | :---: | :--- | :--- | :---: |
| `APP_NAME` | Yes | Yes | `OmniSurv-AI` | FastAPI metadata, UI branding | PASS |
| `APP_ENV` | Yes | Yes | `development` | Logging, health endpoints | PASS |
| `API_HOST` | Yes | Yes | `0.0.0.0` | Uvicorn server startup | PASS |
| `API_PORT` | Yes | Yes | `8000` | Port binding | PASS |
| `LOG_LEVEL` | Yes | Yes | `INFO` | `setup_logging` in core | PASS |
| `CORS_ORIGINS` | Yes | Yes | `["http://localhost:3000", ...]` | FastAPI CORSMiddleware | PASS |
| `DATABASE_URL` | Yes | Yes | `postgresql://omnisurv:...` | SQLAlchemy Engine | PASS |
| `DATABASE_POOL_SIZE` | Yes | Yes | `20` | Database connection pool | PASS |
| `DATABASE_MAX_OVERFLOW` | Yes | Yes | `10` | Database burst capacity | PASS |
| `REDIS_URL` | Yes | Yes | `redis://localhost:6379/0` | Async task queues / Celery | PASS |
| `CELERY_TASK_ALWAYS_EAGER` | Yes | Yes | `False` | Local synchronous switch | PASS |
| `QDRANT_URL` | Yes | Yes | `http://localhost:6333` | Vector Store connection | PASS |
| `QDRANT_COLLECTION` | Yes | Yes | `cctv_crops_clip_vit_b32` | Qdrant collection target | PASS |
| `QDRANT_VECTOR_DIM` | Yes | Yes | `512` | Embedding dimensionality | PASS |
| `QDRANT_DISTANCE_METRIC`| Yes | Yes | `Cosine` | Vector distance metric | PASS |
| `MODEL_PATH` | Yes | Yes | `./ml/weights` | Weights directory | PASS |
| `YOLO_MODEL` | Yes | Yes | `yolov11x.pt` | Object detector weight | PASS |
| `YOLO_CONFIDENCE_THRESHOLD` | Yes | Yes | `0.35` | BBox filtering cutoff | PASS |
| `YOLO_IOU_THRESHOLD` | Yes | Yes | `0.45` | NMS / Hungarian matching | PASS |
| `BYTE_TRACK_MAX_LOST` | Yes | Yes | `30` | Lost track buffering | PASS |
| `BYTE_TRACK_MIN_CONF` | Yes | Yes | `0.30` | 2nd-stage association | PASS |
| `CLIP_MODEL_NAME` | Yes | Yes | `ViT-B/32` | Architecture descriptor | PASS |
| `CLIP_ONNX_PATH` | Yes | Yes | `./ml/weights/clip_vit_b32.onnx` | ONNX runtime model path | PASS |
| `EMBEDDING_DEVICE` | Yes | Yes | `cpu` | Inference target (CPU/CUDA) | PASS |
| `EMBEDDING_BATCH_SIZE`| Yes | Yes | `32` | Worker batch size | PASS |
| `DATA_DIR` | Yes | Yes | `./data` | File storage root | PASS |
| `VIDEOS_DIR` | Yes | Yes | `./data/videos` | Uploaded raw CCTV videos | PASS |
| `FRAMES_DIR` | Yes | Yes | `./data/frames` | Extracted JPEG frames | PASS |
| `CROPS_DIR` | Yes | Yes | `./data/crops` | 224x224 normalized crops | PASS |
| `EXPORTS_DIR` | Yes | Yes | `./data/exports` | Exported forensic reports | PASS |
| `ANTI_HALLUCINATION_STRICT_MODE` | Yes | Yes | `True` | Forensic validation gate | PASS |
| `LLM_PROVIDER` | Yes | Yes | `gemini` | Agentic AI query analyzer | PASS |
| `GEMINI_API_KEY` | Yes | Yes | `""` (Secret) | Multi-modal reasoning API | PASS |
| `LLM_MODEL` | Yes | Yes | `gemini-2.5-flash` | LLM model alias | PASS |

## 3. Client-Side (Vite / React) Environment Variables
- `VITE_API_URL`: Configured to `http://localhost:8000` (defaults gracefully if unset).
- `VITE_WS_URL`: Configured to `ws://localhost:8000` (defaults gracefully if unset).

## 4. Secret & Credential Leakage Audit
- Scanned all source files: **Zero hard-coded production credentials or API keys found**.
- `GEMINI_API_KEY` defaults to empty string or user-injected runtime secret.
- `.gitignore` correctly ignores `.env`, `*.pt`, `*.onnx`, `node_modules`, `dist`, `__pycache__`, and `data/`.

## 5. Audit Conclusion
- Missing variables: None
- Unused variables: None
- Mismatched types: None
- Status: **PASS**
