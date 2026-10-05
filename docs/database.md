# Relational Database Schema (PostgreSQL)

OmniSurv-AI uses PostgreSQL 16 as the ACID source of truth for all structured forensic metadata.

## Entity-Relationship Diagram (Logical)
```
Camera (1) ────< Video (N) ────< Frame (N) ────< Detection (N)
                                     │
                               TrackedObject (1) ────< Trajectory (N)

Investigation (1) ────< Evidence (N)
         │
         └────────────< InvestigationResult (1)
```

## Tables & Primary Fields
- **`cameras`**: `id` (UUID), `name`, `location`, `stream_url`, `status`, `fps`, `resolution`, `created_at`
- **`videos`**: `id`, `camera_id` (FK), `filename`, `source_type`, `duration`, `fps`, `width`, `height`, `total_frames`, `status`
- **`frames`**: `id`, `video_id` (FK), `frame_number`, `timestamp`, `frame_path`
- **`detections`**: `id`, `frame_id` (FK), `track_id`, `object_class`, `confidence`, `x1`, `y1`, `x2`, `y2`, `center_x`, `center_y`, `crop_path`
- **`tracked_objects`**: `id`, `video_id` (FK), `track_id`, `object_class`, `first_seen`, `last_seen`, `status`, `attributes_json`
- **`trajectories`**: `id`, `tracked_object_id` (FK), `track_id`, `timestamp`, `x`, `y`, `camera_id`, `frame_number`
- **`investigations`**: `id`, `query`, `status`, `extracted_entities`, `started_at`, `completed_at`
- **`evidences`**: `id`, `investigation_id` (FK), `video_id`, `frame_id`, `track_id`, `timestamp`, `evidence_type`, `confidence`, `similarity_score`, `crop_path`
- **`investigation_results`**: `id`, `investigation_id` (FK), `summary`, `timeline`, `report_json`, `created_at`
