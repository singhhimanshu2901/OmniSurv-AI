import unittest
import sys
import os

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.search.filters import TemporalFilter, SpatialFilter, MetadataFilter

class TestSearchFilters(unittest.TestCase):
    def test_temporal_filter(self):
        tf = TemporalFilter(start_time=100.0, end_time=200.0)
        self.assertTrue(tf.apply(150.0))
        self.assertFalse(tf.apply(50.0))
        self.assertFalse(tf.apply(250.0))

    def test_spatial_filter(self):
        sf = SpatialFilter(allowed_cameras=["cam-01"], allowed_locations=["Gate 1"])
        self.assertTrue(sf.apply("cam-01", "Gate 1 North"))
        self.assertFalse(sf.apply("cam-02", "Gate 1"))
        self.assertFalse(sf.apply("cam-01", "Parking Lot"))

    def test_metadata_filter(self):
        mf = MetadataFilter(object_class="car", min_confidence=0.5, track_id=42)
        self.assertTrue(mf.apply("car", 0.85, 42))
        self.assertFalse(mf.apply("person", 0.85, 42))
        self.assertFalse(mf.apply("car", 0.40, 42))
        self.assertFalse(mf.apply("car", 0.85, 99))

if __name__ == "__main__":
    unittest.main()
