try:
    import numpy as np
except ImportError:
    np = None
from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional
from app.cv.yolo_detector import DetectedBox

class TrackState:
    New = 0
    Tracked = 1
    Lost = 2
    Removed = 3

class STrack:
    _count = 0

    def __init__(self, det: DetectedBox):
        STrack._count += 1
        self.track_id = STrack._count
        self.object_class = det.object_class
        self.confidence = det.confidence
        self.x1 = det.x1
        self.y1 = det.y1
        self.x2 = det.x2
        self.y2 = det.y2
        self.center_x = det.center_x
        self.center_y = det.center_y
        self.state = TrackState.Tracked
        self.is_activated = True
        self.frame_id = det.frame_number
        self.start_frame = det.frame_number
        self.first_seen = det.timestamp
        self.last_seen = det.timestamp
        self.tracklet_len = 1
        # Velocity estimation (dx, dy)
        self.vx = 0.0
        self.vy = 0.0

    def update(self, det: DetectedBox):
        self.frame_id = det.frame_number
        self.last_seen = det.timestamp
        self.tracklet_len += 1
        self.confidence = det.confidence
        
        # Simple Kalman/linear velocity filter
        new_cx = det.center_x
        new_cy = det.center_y
        self.vx = 0.7 * self.vx + 0.3 * (new_cx - self.center_x)
        self.vy = 0.7 * self.vy + 0.3 * (new_cy - self.center_y)
        
        self.x1 = det.x1
        self.y1 = det.y1
        self.x2 = det.x2
        self.y2 = det.y2
        self.center_x = new_cx
        self.center_y = new_cy
        self.state = TrackState.Tracked

    def predict(self):
        # Predict location based on velocity
        w = self.x2 - self.x1
        h = self.y2 - self.y1
        self.center_x += self.vx
        self.center_y += self.vy
        self.x1 = self.center_x - w / 2.0
        self.y1 = self.center_y - h / 2.0
        self.x2 = self.center_x + w / 2.0
        self.y2 = self.center_y + h / 2.0

    def to_dict(self) -> Dict[str, Any]:
        return {
            "track_id": self.track_id,
            "object_class": self.object_class,
            "confidence": round(self.confidence, 4),
            "bbox": [round(self.x1, 2), round(self.y1, 2), round(self.x2, 2), round(self.y2, 2)],
            "center": [round(self.center_x, 2), round(self.center_y, 2)],
            "timestamp": round(self.last_seen, 3),
            "frame_number": self.frame_id
        }

def compute_iou(box1: List[float], box2: List[float]) -> float:
    xA = max(box1[0], box2[0])
    yA = max(box1[1], box2[1])
    xB = min(box1[2], box2[2])
    yB = min(box1[3], box2[3])
    inter_area = max(0, xB - xA) * max(0, yB - yA)
    box1_area = (box1[2] - box1[0]) * (box1[3] - box1[1])
    box2_area = (box2[2] - box2[0]) * (box2[3] - box2[1])
    union_area = box1_area + box2_area - inter_area
    return inter_area / union_area if union_area > 0 else 0.0


class ObjectTracker(ABC):
    @abstractmethod
    def update(self, detections: List[DetectedBox], frame_number: int, timestamp: float) -> List[STrack]:
        pass


class ByteTrackTracker(ObjectTracker):
    """
    ByteTrack: Multi-Object Tracking by Associating Every Detection Box
    Associates high-confidence detections first, then recovers lower-confidence detections.
    """
    def __init__(self, track_thresh: float = 0.5, match_thresh: float = 0.7, max_lost_frames: int = 30):
        self.track_thresh = track_thresh
        self.match_thresh = match_thresh
        self.max_lost_frames = max_lost_frames
        self.tracked_stracks: List[STrack] = []
        self.lost_stracks: List[STrack] = []

    def update(self, detections: List[DetectedBox], frame_number: int, timestamp: float) -> List[STrack]:
        # 1. Predict existing tracks
        for track in self.tracked_stracks:
            track.predict()

        # 2. Split detections into high and low confidence
        high_dets = [d for d in detections if d.confidence >= self.track_thresh]
        low_dets = [d for d in detections if d.confidence < self.track_thresh]

        # 3. First association: Tracked tracks with high confidence detections
        unmatched_tracks = []
        unmatched_dets = list(high_dets)
        matched_tracks: List[STrack] = []

        for track in self.tracked_stracks:
            best_iou = 0.0
            best_det_idx = -1
            t_box = [track.x1, track.y1, track.x2, track.y2]
            
            for i, d in enumerate(unmatched_dets):
                if d.object_class != track.object_class:
                    continue
                d_box = [d.x1, d.y1, d.x2, d.y2]
                iou = compute_iou(t_box, d_box)
                if iou > best_iou:
                    best_iou = iou
                    best_det_idx = i

            if best_iou > (1.0 - self.match_thresh) and best_det_idx >= 0:
                matched_det = unmatched_dets.pop(best_det_idx)
                track.update(matched_det)
                matched_tracks.append(track)
            else:
                unmatched_tracks.append(track)

        # 4. Second association: Unmatched tracks with low confidence detections (ByteTrack hallmark)
        remaining_unmatched_tracks = []
        for track in unmatched_tracks:
            best_iou = 0.0
            best_det_idx = -1
            t_box = [track.x1, track.y1, track.x2, track.y2]

            for i, d in enumerate(low_dets):
                if d.object_class != track.object_class:
                    continue
                d_box = [d.x1, d.y1, d.x2, d.y2]
                iou = compute_iou(t_box, d_box)
                if iou > best_iou:
                    best_iou = iou
                    best_det_idx = i

            if best_iou > (1.0 - self.match_thresh) and best_det_idx >= 0:
                matched_det = low_dets.pop(best_det_idx)
                track.update(matched_det)
                matched_tracks.append(track)
            else:
                remaining_unmatched_tracks.append(track)

        # 5. Handle newly detected objects
        for det in unmatched_dets:
            new_track = STrack(det)
            matched_tracks.append(new_track)

        # 6. Update lost/tracked pools
        self.tracked_stracks = matched_tracks
        
        # Mark lost tracks
        for t in remaining_unmatched_tracks:
            if (frame_number - t.frame_id) < self.max_lost_frames:
                t.state = TrackState.Lost
                self.lost_stracks.append(t)
            else:
                t.state = TrackState.Removed

        return [t for t in self.tracked_stracks if t.state == TrackState.Tracked]
