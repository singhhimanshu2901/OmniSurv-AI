# Deployment & DevOps Guide

## 1. Production Docker Architecture
Run all microservices using Docker Compose:
```bash
docker-compose up --build -d
```

### Services Included:
1. `postgres`: PostgreSQL 16 on port 5432 with persistent volume.
2. `redis`: Redis 7 on port 6379 for async task queuing.
3. `qdrant`: Qdrant v1.11 on port 6333 for vector indexing.
4. `backend`: FastAPI server on port 8000.
5. `worker`: Asynchronous Python worker executing YOLOv11x, ByteTrack, and CLIP.
6. `frontend`: React 19 Nginx web server on port 3000.

## 2. Health & Readiness Probes
- `GET http://localhost:8000/health`: Verifies backend service status.
- `GET http://localhost:8000/ready`: Verifies database, vector store, and model weights readiness.
