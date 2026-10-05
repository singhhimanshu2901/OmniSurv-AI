# OMNISURV-AI: B.Tech Major Project Viva & Defense Guide

## 1. Project Statement
**"OmniSurv-AI converts raw CCTV footage into structured, searchable visual evidence and uses temporal, spatial and multimodal reasoning to reconstruct incidents from natural-language investigation queries."**

---

## 2. Key Architectural Decisions (Why this tech stack?)

### Q1: Why YOLOv11x for Detection?
- **Extreme Speed-Accuracy Pareto frontier:** Provides high Average Precision (AP) for security surveillance targets (pedestrians, vehicles, luggage) with sub-15ms latency per frame.
- **Architectural Enhancements:** Uses C3k2 blocks and SPPF (Spatial Pyramid Pooling Fast), offering superior feature preservation across extreme scale variations (small objects in high-mounted CCTV cameras).

### Q2: Why ByteTrack over DeepSORT?
- **Problem with DeepSORT:** Discards low-detection-confidence boxes, causing track fragmentation when subjects are occluded (e.g., car partially behind a tree or person in crowd).
- **ByteTrack Innovation:** Associates high-score boxes first, and in a second pass, associates remaining tracks with low-score boxes via Kalman filter velocity forecasting and Hungarian IoU matching. This eliminates identity switches (IDsw).

### Q3: Why CLIP ViT-B/32 Multimodal Embeddings?
- **Zero-Shot Open-Vocabulary Retrieval:** Allows natural-language visual queries without retraining detectors for every color, model, or clothing description.
- **Joint Semantic Space:** Projects image crops ($I \in \mathbb{R}^{3 \times 224 \times 224}$) and text prompts ($T$) into a shared 512-dimensional unit hypersphere:
  $$\text{sim}(I, T) = \frac{\mathbf{e}_I \cdot \mathbf{e}_T}{\|\mathbf{e}_I\|_2 \|\mathbf{e}_T\|_2}$$

### Q4: Why Qdrant as the Vector Database?
- **Payload Filtering Engine:** Qdrant combines HNSW (Hierarchical Navigable Small World) vector search with Boolean payload filters in a single-pass query.
- **Surveillance Performance:** Enables spatial and temporal boundaries (e.g. `camera_id == 'cam-01' AND timestamp >= 900`) to prune graph traversal before computing cosine distance.

### Q5: Why PostgreSQL for Relational Metadata?
- **ACID Source of Truth:** CCTV forensic evidence requires legal chain-of-custody, foreign-key relationships (Camera $\to$ Video $\to$ Frame $\to$ Detection $\to$ Track $\to$ Trajectory), and immutable audit logs.

### Q6: Why LangGraph for the Forensic Workflow?
- **Deterministic State Graphs vs. Black-Box ReAct:** Security investigations cannot tolerate unstructured hallucinations. LangGraph enforces a strict state machine:
  `START` $\to$ `QueryAnalyzer` $\to$ `SpatialTemporalGate` $\to$ `HybridSearch` $\to$ `TrajectoryStitcher` $\to$ `EvidenceValidator` $\to$ `TimelineGenerator` $\to$ `ForensicReport` $\to$ `END`.

### Q7: What is the Anti-Hallucination Rule?
- **Rule:** The LLM is used **strictly for query interpretation and report structuring**, NEVER for generating evidence.
- Every claim must map to an indexed bounding box, frame number, timestamp, and visual similarity score. If evidence is lacking, the system formally outputs: *"Insufficient evidence to establish this finding."*

---

## 3. Mathematical Foundations
1. **Kalman State Vector in ByteTrack:**
   $$\mathbf{x} = [u, v, s, r, \dot{u}, \dot{v}, \dot{s}]^T$$
   Where $(u, v)$ is bbox center, $s$ is scale (area), and $r$ is aspect ratio.
2. **IoU (Intersection-over-Union):**
   $$\text{IoU}(A, B) = \frac{\text{Area}(A \cap B)}{\text{Area}(A \cup B)}$$
3. **Cosine Metric:**
   $$\mathcal{S}_{\cos}(\mathbf{u}, \mathbf{v}) = \cos(\theta) = \frac{\mathbf{u} \cdot \mathbf{v}}{\|\mathbf{u}\|_2 \|\mathbf{v}\|_2}$$
