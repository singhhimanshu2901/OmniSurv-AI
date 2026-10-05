# LangGraph Forensic Agent Architecture

## 1. Graph Topology
OmniSurv-AI uses a 7-node deterministic StateGraph to eliminate LLM hallucinations:

```
[START]
   ↓
[query_analyzer] ────────── Extracts structured entities (class, color, time, zone)
   ↓
[temporal_spatial_gate] ── Maps boundaries to physical CCTV channels
   ↓
[hybrid_search] ────────── Calls Qdrant vector index + SQL filters
   ↓
[trajectory_stitcher] ──── Assembles multi-camera path & flags blind-spot gaps
   ↓
[evidence_validator] ───── Enforces Anti-Hallucination thresholds (sim >= 0.35, conf >= 0.40)
   ↓
[timeline_generator] ───── Creates chronological forensic milestones
   ↓
[forensic_report_generator] Synthesizes evidence-grounded report with legal disclaimers
   ↓
[END]
```

## 2. Anti-Hallucination Policy
- The LLM **never** fabricates evidence.
- Every claim in the final report must trace to an indexed bounding box, frame number, timestamp, and visual similarity score.
- When evidence is insufficient, the system outputs: *"Insufficient evidence to establish this finding."*
