# Computer Vision & Deep Learning Pipeline

## 1. Overview
The CV pipeline in OmniSurv-AI executes sequential frame-level processing with minimal latency and high spatial accuracy:
$$\text{Frame} \xrightarrow{\text{YOLOv11x}} \text{Detections} \xrightarrow{\text{ByteTrack}} \text{Track IDs} \xrightarrow{\text{Crop}} \text{Normalized Patches}$$

## 2. Detection (YOLOv11x)
- Model: YOLOv11x (Ultralytics)
- Classes:
  - `person` (Pedestrians, suspects, security personnel)
  - `car` (Sedans, SUVs, trucks, buses, motorcycles)
  - `bag` (Backpacks, suitcases, hand packages)
- Bounding Box Normalization:
  - $[x_1, y_1, x_2, y_2] \in [0, W] \times [0, H]$
  - Center coordinates $(c_x, c_y) = (\frac{x_1 + x_2}{2}, \frac{y_1 + y_2}{2})$
  - Confidence threshold default: $0.35$

## 3. Tracking (ByteTrack)
- Eliminates ID switches by retaining low-score detections ($0.1 \le \text{conf} < 0.35$) in second-tier Hungarian IoU matching.
- Kalman Filter dynamics:
  $$\mathbf{x}_{k} = \mathbf{F} \mathbf{x}_{k-1} + \mathbf{w}_k$$
- Lost tracks buffered for up to 30 frames before retirement.
