from typing import List, Dict, Any, Optional
from app.schemas.schemas import TrajectoryPoint, TrackTrajectoryResponse
from app.core.logging import logger

class TrajectoryService:
    def __init__(self, max_gap_threshold_sec: float = 3.0):
        self.max_gap_threshold_sec = max_gap_threshold_sec

    def reconstruct_trajectory(
        self,
        track_id: int,
        object_class: str,
        points: List[Dict[str, Any]]
    ) -> TrackTrajectoryResponse:
        """
        Takes raw chronological observations for a track and reconstructs:
        - Path coordinates
        - Explicit blind spots / sensor gaps (does NOT invent data)
        - Camera transition sequence
        - Entry and exit events
        """
        if not points:
            return TrackTrajectoryResponse(
                track_id=track_id,
                object_class=object_class,
                first_seen=0.0,
                last_seen=0.0,
                duration=0.0,
                frame_count=0,
                camera_sequence=[],
                location_sequence=[],
                path=[],
                gaps=[],
                entry_event=None,
                exit_event=None
            )

        # Sort points by timestamp
        sorted_pts = sorted(points, key=lambda p: p["timestamp"])

        path: List[TrajectoryPoint] = []
        camera_sequence: List[str] = []
        location_sequence: List[str] = []
        gaps: List[Dict[str, Any]] = []

        prev_time = None
        prev_camera = None

        for pt in sorted_pts:
            t = pt["timestamp"]
            cam = pt.get("camera_id", "cam-01")
            loc = pt.get("location", "Gate 1")

            # Detect observation gaps
            if prev_time is not None:
                dt = t - prev_time
                if dt > self.max_gap_threshold_sec:
                    gaps.append({
                        "gap_start": round(prev_time, 2),
                        "gap_end": round(t, 2),
                        "duration_sec": round(dt, 2),
                        "note": f"Visual tracking discontinuity between {prev_camera} and {cam}. No synthetic positions interpolated."
                    })

            if not camera_sequence or camera_sequence[-1] != cam:
                camera_sequence.append(cam)
            if not location_sequence or location_sequence[-1] != loc:
                location_sequence.append(loc)

            path.append(TrajectoryPoint(
                timestamp=round(t, 2),
                x=round(float(pt.get("x", 0.0)), 2),
                y=round(float(pt.get("y", 0.0)), 2),
                camera_id=cam,
                frame_number=int(pt.get("frame_number", 0))
            ))

            prev_time = t
            prev_camera = cam

        first_seen = sorted_pts[0]["timestamp"]
        last_seen = sorted_pts[-1]["timestamp"]
        duration = max(0.0, last_seen - first_seen)

        entry_event = {
            "timestamp": round(first_seen, 2),
            "camera_id": sorted_pts[0].get("camera_id", "cam-01"),
            "location": sorted_pts[0].get("location", "Initial Entry Zone"),
            "description": f"Target track {track_id} ({object_class}) first recorded at {sorted_pts[0].get('location')}."
        }

        exit_event = {
            "timestamp": round(last_seen, 2),
            "camera_id": sorted_pts[-1].get("camera_id", "cam-01"),
            "location": sorted_pts[-1].get("location", "Exit Zone"),
            "description": f"Target track {track_id} last sighted at {sorted_pts[-1].get('location')}."
        }

        return TrackTrajectoryResponse(
            track_id=track_id,
            object_class=object_class,
            first_seen=round(first_seen, 2),
            last_seen=round(last_seen, 2),
            duration=round(duration, 2),
            frame_count=len(sorted_pts),
            camera_sequence=camera_sequence,
            location_sequence=location_sequence,
            path=path,
            gaps=gaps,
            entry_event=entry_event,
            exit_event=exit_event
        )

trajectory_service = TrajectoryService()
