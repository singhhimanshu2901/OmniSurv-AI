import unittest
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.services.trajectory_service import TrajectoryService

class TestTrajectory(unittest.TestCase):
    def test_trajectory_reconstruction_and_gap_detection(self):
        service = TrajectoryService(max_gap_threshold_sec=3.0)
        points = [
            {"timestamp": 10.0, "x": 100, "y": 200, "camera_id": "cam-01", "location": "Gate 1", "frame_number": 100},
            {"timestamp": 12.0, "x": 150, "y": 250, "camera_id": "cam-01", "location": "Gate 1", "frame_number": 120},
            {"timestamp": 20.0, "x": 300, "y": 400, "camera_id": "cam-02", "location": "Parking", "frame_number": 200},  # 8s gap!
        ]
        traj = service.reconstruct_trajectory(track_id=42, object_class="car", points=points)

        self.assertEqual(traj.track_id, 42)
        self.assertEqual(traj.first_seen, 10.0)
        self.assertEqual(traj.last_seen, 20.0)
        self.assertEqual(len(traj.camera_sequence), 2)
        self.assertEqual(len(traj.gaps), 1)
        self.assertEqual(traj.gaps[0]["duration_sec"], 8.0)

if __name__ == "__main__":
    unittest.main()
