# REST API & WebSocket Specification

Base URL: `http://localhost:8000/api/v1`

## Endpoints

### 1. Cameras
- `GET /cameras`: List all registered CCTV surveillance cameras.
- `POST /cameras`: Register a new camera channel.
- `GET /cameras/{camera_id}`: Retrieve camera metadata, status, and stream URL.

### 2. Videos
- `GET /videos`: List ingested video recordings.
- `POST /videos/upload`: Upload an MP4 video file.
- `POST /videos/{video_id}/process`: Trigger asynchronous CV processing (YOLO + ByteTrack + CLIP + Qdrant).
- `GET /videos/{video_id}/status`: Poll processing progress (frames, detections, FPS).

### 3. Hybrid Search
- `POST /search`: Execute multi-attribute hybrid forensic search.
  - Body: `{ query, object_class, color, camera_id, start_time, end_time, minimum_confidence }`

### 4. Investigations
- `POST /investigations`: Execute the 7-node LangGraph forensic investigation workflow.
- `GET /investigations/{id}`: Fetch complete state, evidence, timeline, and report.
- `GET /investigations/{id}/timeline`: Retrieve chronological incident milestones.
- `GET /investigations/{id}/report`: Retrieve the official incident report JSON.

### 5. Tracks & Trajectories
- `GET /tracks/{track_id}`: Retrieve track summary and duration.
- `GET /tracks/{track_id}/trajectory`: Retrieve 2D spatial path, camera sequences, and sensor gaps.

### 6. WebSockets
- `WS /ws/videos/{video_id}`: Real-time video processing progress.
- `WS /ws/investigations/{investigation_id}`: Live LangGraph node updates.
