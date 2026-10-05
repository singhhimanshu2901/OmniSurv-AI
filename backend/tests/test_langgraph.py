import unittest
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.agents.nodes import query_analyzer_node, temporal_spatial_gate_node, evidence_validator_node

class TestForensicAgentNodes(unittest.TestCase):
    def test_query_analyzer(self):
        state = {
            "user_query": "Find the blue sedan near Gate 1 after 15:00 and track its movement until exit.",
            "agent_logs": []
        }
        res = query_analyzer_node(state)
        entities = res["extracted_entities"]

        self.assertEqual(entities["object_class"], "car")
        self.assertEqual(entities["color"], "blue")
        self.assertEqual(entities["location"], "Gate 1")
        self.assertEqual(entities["start_time"], 15 * 3600)  # 54000.0s

    def test_anti_hallucination_validator(self):
        # Empty evidence should flag insufficient evidence
        state_empty = {"evidence": [], "agent_logs": []}
        res = evidence_validator_node(state_empty)
        self.assertFalse(res["validation_result"]["valid"])
        self.assertEqual(res["validation_result"]["status"], "INSUFFICIENT_EVIDENCE")

        # Verified evidence with high confidence and similarity
        state_verified = {
            "evidence": [{
                "similarity_score": 0.88,
                "confidence": 0.94,
                "track_id": 42
            }],
            "agent_logs": []
        }
        res_v = evidence_validator_node(state_verified)
        self.assertTrue(res_v["validation_result"]["valid"])
        self.assertEqual(res_v["validation_result"]["status"], "CONFIRMED")

if __name__ == "__main__":
    unittest.main()
