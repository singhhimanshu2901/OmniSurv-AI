#!/usr/bin/env python3
"""
OmniSurv-AI: Standalone CLI Pipeline Runner
Demonstrates: Frame Extraction -> YOLOv11x -> ByteTrack -> Crop -> CLIP -> Qdrant -> LangGraph
"""

import sys
import os

# Add backend to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from app.services.video_service import video_processor_service
from app.agents.langgraph_forensic_agent import forensic_workflow
from app.core.logging import logger

def main():
    print("=" * 60)
    print("OMNISURV-AI: Multimodal CCTV Forensic Intelligence System")
    print("=" * 60)

    video_path = sys.argv[1] if len(sys.argv) > 1 else "./data/videos/demo_gate1.mp4"
    query = sys.argv[2] if len(sys.argv) > 2 else "Find the blue sedan near Gate 1 after 15:00 and track its movement until exit."

    print(f"\n[1] Ingesting and Processing Video: {video_path}")
    status = video_processor_service.process_video(
        video_id="cli_demo_001",
        video_path=video_path,
        camera_id="cam-01",
        location="Gate 1"
    )
    print(f"    Processed {status['frames_processed']} frames, {status['tracks_count']} tracks, {status['embeddings_count']} embeddings.")

    print(f"\n[2] Executing LangGraph Forensic Agent for Query: '{query}'")
    result = forensic_workflow.run_investigation(query)

    print("\n[3] Investigation Results:")
    report = result.get("final_report", {})
    print(f"    Case ID: {report.get('case_id')}")
    print(f"    Status:  {report.get('status')}")
    print(f"    Summary: {report.get('executive_summary')}")
    print(f"    Milestones: {len(report.get('timeline', []))} events verified.")

    print("\n[4] Forensic Pipeline Execution Complete.")
    print("=" * 60)

if __name__ == "__main__":
    main()
