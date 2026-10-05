# Multimodal Embedding Pipeline & Vector Indexing

## 1. Visual Representation with CLIP ViT-B/32
- Model: OpenAI CLIP ViT-B/32 via ONNX Runtime
- Metric space: 512-dimensional unit hypersphere $\mathbb{S}^{511} \subset \mathbb{R}^{512}$
- L2-normalization:
  $$\hat{\mathbf{v}} = \frac{\mathbf{v}}{\|\mathbf{v}\|_2 + 10^{-12}}$$
- Cross-modal matching: Natural language prompts (e.g. `"blue sedan"`, `"person in dark jacket"`) and cropped visual images are directly comparable via cosine similarity:
  $$\mathcal{S}(I, T) = \hat{\mathbf{e}}_I \cdot \hat{\mathbf{e}}_T$$

## 2. Qdrant HNSW Vector Collection
- Collection name: `cctv_crops_clip_vit_b32`
- Distance metric: `Cosine`
- Payload structure:
  - `camera_id` (string)
  - `video_id` (string)
  - `frame_number` (int)
  - `timestamp` (float seconds)
  - `track_id` (int)
  - `object_class` (string)
  - `confidence` (float)
  - `location` (string)
  - `crop_path` (string)
