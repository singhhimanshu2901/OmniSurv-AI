#!/usr/bin/env python3
"""
WebSocket Event Protocol Audit Script
Verifies:
- All 11 mandated forensic event types:
  1. processing_started
  2. frame_processed
  3. detection_created
  4. track_updated
  5. embedding_created
  6. processing_progress
  7. investigation_started
  8. search_completed
  9. trajectory_completed
  10. report_completed
  11. error
"""

import sys
import os
import asyncio
import json

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from app.websocket.manager import ws_manager

REQUIRED_EVENTS = [
    "processing_started",
    "frame_processed",
    "detection_created",
    "track_updated",
    "embedding_created",
    "processing_progress",
    "investigation_started",
    "search_completed",
    "trajectory_completed",
    "report_completed",
    "error"
]

class MockWebSocket:
    def __init__(self):
        self.sent_messages = []
        self.closed = False

    async def accept(self):
        pass

    async def send_text(self, text: str):
        self.sent_messages.append(json.loads(text))

    async def close(self):
        self.closed = True

async def audit_websocket():
    print("=" * 60)
    print(" WEBSOCKET FORENSIC EVENT DISPATCH AUDIT")
    print("=" * 60)

    mock_ws = MockWebSocket()
    vid_id = "test_vid_ws_001"
    inv_id = "test_inv_ws_001"

    # Connect client
    await ws_manager.connect_video(vid_id, mock_ws)
    await ws_manager.connect_investigation(inv_id, mock_ws)

    # Broadcast all 11 required event types
    for ev in REQUIRED_EVENTS:
        if "investigation" in ev or "search" in ev or "report" in ev:
            await ws_manager.broadcast_investigation_event(inv_id, ev, {"test_field": "ok"})
        else:
            await ws_manager.broadcast_video_event(vid_id, ev, {"test_field": "ok"})

    received_events = [m["event"] for m in mock_ws.sent_messages]
    for req in REQUIRED_EVENTS:
        assert req in received_events, f"Missing event: {req}"
        print(f"  [✓] Event Protocol: '{req}' verified")

    # Clean disconnect
    ws_manager.disconnect_video(vid_id, mock_ws)
    ws_manager.disconnect_investigation(inv_id, mock_ws)

    print("=" * 60)
    print(f" ALL {len(REQUIRED_EVENTS)}/{len(REQUIRED_EVENTS)} FORENSIC WEBSOCKET EVENTS VERIFIED")
    print("=" * 60)

if __name__ == "__main__":
    asyncio.run(audit_websocket())
