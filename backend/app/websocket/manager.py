import json
from typing import Dict, List, Any

try:
    from fastapi import WebSocket
except ImportError:
    class WebSocket: pass

from app.core.logging import logger

class ConnectionManager:
    def __init__(self):
        self.active_video_connections: Dict[str, List[Any]] = {}
        self.active_investigation_connections: Dict[str, List[Any]] = {}

    async def connect_video(self, video_id: str, websocket: Any):
        if hasattr(websocket, "accept"):
            await websocket.accept()
        if video_id not in self.active_video_connections:
            self.active_video_connections[video_id] = []
        self.active_video_connections[video_id].append(websocket)
        logger.info(f"WebSocket client connected to video {video_id}")

    def disconnect_video(self, video_id: str, websocket: Any):
        if video_id in self.active_video_connections:
            if websocket in self.active_video_connections[video_id]:
                self.active_video_connections[video_id].remove(websocket)

    async def broadcast_video_event(self, video_id: str, event_type: str, data: Dict[str, Any]):
        if video_id not in self.active_video_connections:
            return
        payload = json.dumps({"event": event_type, "data": data})
        to_remove = []
        for ws in self.active_video_connections[video_id]:
            try:
                await ws.send_text(payload)
            except Exception:
                to_remove.append(ws)
        for ws in to_remove:
            self.disconnect_video(video_id, ws)

    async def connect_investigation(self, investigation_id: str, websocket: Any):
        if hasattr(websocket, "accept"):
            await websocket.accept()
        if investigation_id not in self.active_investigation_connections:
            self.active_investigation_connections[investigation_id] = []
        self.active_investigation_connections[investigation_id].append(websocket)
        logger.info(f"WebSocket client connected to investigation {investigation_id}")

    def disconnect_investigation(self, investigation_id: str, websocket: Any):
        if investigation_id in self.active_investigation_connections:
            if websocket in self.active_investigation_connections[investigation_id]:
                self.active_investigation_connections[investigation_id].remove(websocket)

    async def broadcast_investigation_event(self, investigation_id: str, event_type: str, data: Dict[str, Any]):
        if investigation_id not in self.active_investigation_connections:
            return
        payload = json.dumps({"event": event_type, "data": data})
        to_remove = []
        for ws in self.active_investigation_connections[investigation_id]:
            try:
                await ws.send_text(payload)
            except Exception:
                to_remove.append(ws)
        for ws in to_remove:
            self.disconnect_investigation(investigation_id, ws)

ws_manager = ConnectionManager()
