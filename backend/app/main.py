import os
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.core.logging import logger
from app.api.v1.cameras import router as cameras_router
from app.api.v1.videos import router as videos_router
from app.api.v1.search import router as search_router
from app.api.v1.investigations import router as investigations_router
from app.api.v1.tracks import router as tracks_router
from app.websocket.manager import ws_manager

app = FastAPI(
    title=settings.APP_NAME,
    description="Multimodal Intelligent CCTV Forensic & Event Intelligence System API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API v1 routers
app.include_router(cameras_router, prefix=settings.API_V1_STR)
app.include_router(videos_router, prefix=settings.API_V1_STR)
app.include_router(search_router, prefix=settings.API_V1_STR)
app.include_router(investigations_router, prefix=settings.API_V1_STR)
app.include_router(tracks_router, prefix=settings.API_V1_STR)

# Ensure data folders
os.makedirs(settings.CROPS_DIR, exist_ok=True)
os.makedirs(settings.VIDEOS_DIR, exist_ok=True)

# Mount static files for crops if directory exists
try:
    app.mount("/crops", StaticFiles(directory=settings.CROPS_DIR), name="crops")
except Exception:
    pass

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": settings.APP_NAME,
        "environment": settings.APP_ENV,
        "anti_hallucination_mode": settings.ANTI_HALLUCINATION_STRICT_MODE
    }

@app.get("/ready")
def readiness_check():
    return {
        "status": "ready",
        "database": "connected",
        "vector_store": "ready",
        "models": {
            "yolo": settings.YOLO_MODEL,
            "clip": settings.CLIP_MODEL_NAME
        }
    }

# WebSockets
@app.websocket("/ws/videos/{video_id}")
async def websocket_video_endpoint(websocket: WebSocket, video_id: str):
    await ws_manager.connect_video(video_id, websocket)
    try:
        while True:
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        ws_manager.disconnect_video(video_id, websocket)

@app.websocket("/ws/investigations/{investigation_id}")
async def websocket_investigation_endpoint(websocket: WebSocket, investigation_id: str):
    await ws_manager.connect_investigation(investigation_id, websocket)
    try:
        while True:
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        ws_manager.disconnect_investigation(investigation_id, websocket)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.API_HOST, port=settings.API_PORT, reload=True)
