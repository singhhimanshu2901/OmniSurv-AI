from typing import List, Dict, Any, Optional
try:
    from typing import TypedDict
except ImportError:
    from typing_extensions import TypedDict

class InvestigationState(TypedDict, total=False):
    user_query: str
    extracted_entities: Dict[str, Any]
    temporal_constraints: Dict[str, Any]
    spatial_constraints: Dict[str, Any]
    search_request: Dict[str, Any]
    search_results: List[Dict[str, Any]]
    trajectories: List[Dict[str, Any]]
    evidence: List[Dict[str, Any]]
    validation_result: Dict[str, Any]
    timeline: List[Dict[str, Any]]
    final_report: Dict[str, Any]
    agent_logs: List[str]
