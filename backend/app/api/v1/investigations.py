import uuid
from datetime import datetime
from typing import Dict, Any, List
from fastapi import APIRouter, HTTPException
from app.schemas.schemas import InvestigationCreate, ForensicReportSchema, TimelineEvent
from app.agents.langgraph_forensic_agent import forensic_workflow

router = APIRouter(prefix="/investigations", tags=["Investigations"])

# In-memory investigation results cache
_INVESTIGATIONS_CACHE: Dict[str, Dict[str, Any]] = {}

@router.post("")
def start_investigation(payload: InvestigationCreate):
    inv_id = f"inv-{str(uuid.uuid4())[:8]}"
    state = forensic_workflow.run_investigation(payload.query)
    
    _INVESTIGATIONS_CACHE[inv_id] = {
        "id": inv_id,
        "query": payload.query,
        "status": "completed",
        "started_at": datetime.utcnow().isoformat() + "Z",
        "state": state
    }
    
    return {
        "investigation_id": inv_id,
        "query": payload.query,
        "status": "completed",
        "extracted_entities": state.get("extracted_entities", {}),
        "validation_result": state.get("validation_result", {}),
        "timeline_count": len(state.get("timeline", [])),
        "evidence_count": len(state.get("evidence", [])),
        "report": state.get("final_report", {}),
        "agent_logs": state.get("agent_logs", [])
    }

@router.get("/{investigation_id}")
def get_investigation(investigation_id: str):
    if investigation_id not in _INVESTIGATIONS_CACHE:
        raise HTTPException(status_code=404, detail="Investigation not found")
    inv = _INVESTIGATIONS_CACHE[investigation_id]
    state = inv["state"]
    return {
        "investigation_id": inv["id"],
        "query": inv["query"],
        "status": inv["status"],
        "extracted_entities": state.get("extracted_entities", {}),
        "validation_result": state.get("validation_result", {}),
        "trajectories": state.get("trajectories", []),
        "evidence": state.get("evidence", []),
        "timeline": state.get("timeline", []),
        "report": state.get("final_report", {}),
        "agent_logs": state.get("agent_logs", [])
    }

@router.get("/{investigation_id}/timeline")
def get_investigation_timeline(investigation_id: str):
    if investigation_id not in _INVESTIGATIONS_CACHE:
        raise HTTPException(status_code=404, detail="Investigation not found")
    state = _INVESTIGATIONS_CACHE[investigation_id]["state"]
    return state.get("timeline", [])

@router.get("/{investigation_id}/report")
def get_investigation_report(investigation_id: str):
    if investigation_id not in _INVESTIGATIONS_CACHE:
        raise HTTPException(status_code=404, detail="Investigation not found")
    state = _INVESTIGATIONS_CACHE[investigation_id]["state"]
    return state.get("final_report", {})
