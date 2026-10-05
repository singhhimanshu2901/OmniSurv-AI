from typing import Dict, Any, Optional, List

class TemporalFilter:
    def __init__(self, start_time: Optional[float] = None, end_time: Optional[float] = None):
        self.start_time = start_time
        self.end_time = end_time

    def apply(self, timestamp: float) -> bool:
        if self.start_time is not None and timestamp < self.start_time:
            return False
        if self.end_time is not None and timestamp > self.end_time:
            return False
        return True


class SpatialFilter:
    def __init__(self, allowed_cameras: Optional[List[str]] = None, allowed_locations: Optional[List[str]] = None):
        self.allowed_cameras = [c.lower() for c in (allowed_cameras or [])]
        self.allowed_locations = [l.lower() for l in (allowed_locations or [])]

    def apply(self, camera_id: str, location: str) -> bool:
        if self.allowed_cameras and camera_id.lower() not in self.allowed_cameras:
            return False
        if self.allowed_locations:
            loc_matched = any(al in location.lower() for al in self.allowed_locations)
            if not loc_matched:
                return False
        return True


class MetadataFilter:
    def __init__(
        self, 
        object_class: Optional[str] = None, 
        min_confidence: float = 0.35,
        track_id: Optional[int] = None
    ):
        self.object_class = object_class.lower() if object_class else None
        self.min_confidence = min_confidence
        self.track_id = track_id

    def apply(self, obj_class: str, confidence: float, track_id: Optional[int] = None) -> bool:
        if self.object_class and obj_class.lower() != self.object_class:
            return False
        if confidence < self.min_confidence:
            return False
        if self.track_id is not None and track_id != self.track_id:
            return False
        return True
