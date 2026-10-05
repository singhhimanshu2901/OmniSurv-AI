# Deterministic Hybrid Forensic Search Engine

## 1. Search Pipeline
The hybrid search engine combines deterministic relational/spatial SQL filters with high-dimensional vector similarity:

```
Structured Search Parameters
        │
        ├── Temporal Filter (Start Time, End Time)
        │
        ├── Spatial Filter (Camera ID, Facility Zone)
        │
        ├── Metadata Filter (Object Class, Minimum YOLO Confidence)
        │
        ▼
Qdrant HNSW Vector Similarity (512D Cosine Distance)
        │
        ▼
Track ID Aggregation & Temporal Grouping
        │
        ▼
Ranked Evidence Results
```

## 2. Track Grouping & Multi-Frame Evidence Aggregation
- Individual frame-level hits are aggregated by persistent `track_id`.
- The aggregate similarity score is assigned as $\max(\text{score}_i)$.
- First-seen and last-seen timestamps are computed to form coherent trajectory segments.
