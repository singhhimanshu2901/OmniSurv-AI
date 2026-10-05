try:
    import cv2
except ImportError:
    cv2 = None
import os
from abc import ABC, abstractmethod
from typing import Generator, Tuple, Optional, Dict, Any
from app.core.logging import logger

class VideoSource(ABC):
    @abstractmethod
    def open(self) -> bool:
        pass

    @abstractmethod
    def read_frame(self) -> Tuple[bool, Optional[Any], float, int]:
        """Returns (success, frame_mat, timestamp_sec, frame_idx)"""
        pass

    @abstractmethod
    def get_metadata(self) -> Dict[str, Any]:
        pass

    @abstractmethod
    def release(self):
        pass


class MP4VideoSource(VideoSource):
    def __init__(self, file_path: str):
        self.file_path = file_path
        self.cap = None
        self.fps = 30.0
        self.total_frames = 0
        self.width = 1920
        self.height = 1080
        self.current_frame = 0

    def open(self) -> bool:
        if not os.path.exists(self.file_path):
            logger.error(f"Video file not found: {self.file_path}")
            return False
        
        self.cap = cv2.VideoCapture(self.file_path)
        if not self.cap.isOpened():
            logger.error(f"Failed to open video capture for {self.file_path}")
            return False

        self.fps = self.cap.get(cv2.CAP_PROP_FPS) or 30.0
        self.total_frames = int(self.cap.get(cv2.CAP_PROP_FRAME_COUNT) or 0)
        self.width = int(self.cap.get(cv2.CAP_PROP_FRAME_WIDTH) or 1920)
        self.height = int(self.cap.get(cv2.CAP_PROP_FRAME_HEIGHT) or 1080)
        self.current_frame = 0
        return True

    def read_frame(self) -> Tuple[bool, Optional[Any], float, int]:
        if not self.cap or not self.cap.isOpened():
            return False, None, 0.0, 0
        
        ret, frame = self.cap.read()
        if not ret or frame is None:
            return False, None, 0.0, self.current_frame

        timestamp = self.current_frame / self.fps
        idx = self.current_frame
        self.current_frame += 1
        return True, frame, timestamp, idx

    def get_metadata(self) -> Dict[str, Any]:
        return {
            "fps": self.fps,
            "total_frames": self.total_frames,
            "width": self.width,
            "height": self.height,
            "duration": (self.total_frames / self.fps) if self.fps > 0 else 0.0,
            "source_type": "mp4",
            "file_path": self.file_path
        }

    def release(self):
        if self.cap:
            self.cap.release()
            self.cap = None


class RTSPVideoSource(VideoSource):
    def __init__(self, stream_url: str):
        self.stream_url = stream_url
        self.cap = None
        self.fps = 25.0
        self.current_frame = 0

    def open(self) -> bool:
        self.cap = cv2.VideoCapture(self.stream_url)
        return self.cap.isOpened()

    def read_frame(self) -> Tuple[bool, Optional[Any], float, int]:
        if not self.cap or not self.cap.isOpened():
            return False, None, 0.0, 0
        ret, frame = self.cap.read()
        if not ret:
            return False, None, 0.0, self.current_frame
        timestamp = self.current_frame / self.fps
        idx = self.current_frame
        self.current_frame += 1
        return True, frame, timestamp, idx

    def get_metadata(self) -> Dict[str, Any]:
        return {
            "fps": self.fps,
            "stream_url": self.stream_url,
            "source_type": "rtsp",
            "status": "connected" if (self.cap and self.cap.isOpened()) else "disconnected"
        }

    def release(self):
        if self.cap:
            self.cap.release()
            self.cap = None
