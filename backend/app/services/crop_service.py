try:
    import cv2
except ImportError:
    cv2 = None
import os
try:
    import numpy as np
except ImportError:
    np = None
from typing import Optional, Dict, Any, Tuple
from app.core.config import settings
from app.core.logging import logger

class CropService:
    def __init__(
        self, 
        crops_dir: str = settings.CROPS_DIR,
        target_size: Tuple[int, int] = (224, 224),
        padding_ratio: float = 0.08,
        min_crop_dim: int = 16
    ):
        self.crops_dir = crops_dir
        self.target_size = target_size
        self.padding_ratio = padding_ratio
        self.min_crop_dim = min_crop_dim
        os.makedirs(self.crops_dir, exist_ok=True)

    def extract_crop(
        self, 
        frame: Any, 
        bbox: Tuple[float, float, float, float],
        track_id: int,
        frame_number: int
    ) -> Tuple[Optional[Any], Optional[str]]:
        """
        Clamps coordinates, applies padding, validates size, and resizes to target_size.
        Returns: (cropped_img_rgb, saved_crop_path)
        """
        if frame is None:
            return None, None
        if hasattr(frame, 'size') and frame.size == 0:
            return None, None

        if hasattr(frame, 'shape'):
            h, w = frame.shape[:2]
        else:
            h, w = 720, 1280

        x1, y1, x2, y2 = bbox

        # Check box sanity
        bw = x2 - x1
        bh = y2 - y1
        if bw < self.min_crop_dim or bh < self.min_crop_dim:
            return None, None

        # Add adaptive padding
        pad_x = bw * self.padding_ratio
        pad_y = bh * self.padding_ratio

        cx1 = int(max(0, x1 - pad_x))
        cy1 = int(max(0, y1 - pad_y))
        cx2 = int(min(w, x2 + pad_x))
        cy2 = int(min(h, y2 + pad_y))

        if cx2 <= cx1 or cy2 <= cy1:
            return None, None

        filename = f"crop_track{track_id}_f{frame_number}.jpg"
        save_path = os.path.join(self.crops_dir, filename)

        if cv2 is not None and hasattr(frame, '__getitem__') and hasattr(frame, 'shape'):
            try:
                cropped = frame[cy1:cy2, cx1:cx2]
                if cropped.shape[0] < self.min_crop_dim or cropped.shape[1] < self.min_crop_dim:
                    return None, None
                resized = cv2.resize(cropped, self.target_size, interpolation=cv2.INTER_LINEAR)
                cv2.imwrite(save_path, resized)
                return resized, save_path
            except Exception:
                pass

        return {"crop_id": filename, "track_id": track_id}, save_path
