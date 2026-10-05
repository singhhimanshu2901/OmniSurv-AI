from typing import Dict, Any, Optional
from app.agents.state import InvestigationState
from app.agents.nodes import (
    query_analyzer_node,
    temporal_spatial_gate_node,
    hybrid_search_node,
    trajectory_stitcher_node,
    evidence_validator_node,
    timeline_generator_node,
    forensic_report_generator_node
)
from app.search.hybrid_search import HybridSearchEngine
from app.embeddings.qdrant_store import QdrantVectorStore
from app.core.logging import logger

class ForensicInvestigationWorkflow:
    """
    Evidence-grounded Forensic Investigation Agent.
    Implements a deterministic state machine / LangGraph topology:
    START
      ↓
    query_analyzer
      ↓
    temporal_spatial_gate
      ↓
    hybrid_search
      ↓
    trajectory_stitcher
      ↓
    evidence_validator (anti-hallucination)
      ↓
    timeline_generator
      ↓
    forensic_report_generator
      ↓
    END
    """
    def __init__(self, search_engine: Optional[HybridSearchEngine] = None):
        self.vector_store = QdrantVectorStore()
        self.search_engine = search_engine or HybridSearchEngine(vector_store=self.vector_store)
        self.graph = None
        self._build_graph()

    def _build_graph(self):
        try:
            from langgraph.graph import StateGraph, START, END
            workflow = StateGraph(InvestigationState)

            # Register graph nodes
            workflow.add_node("query_analyzer", query_analyzer_node)
            workflow.add_node("temporal_spatial_gate", temporal_spatial_gate_node)
            workflow.add_node("hybrid_search", lambda state: hybrid_search_node(state, self.search_engine))
            workflow.add_node("trajectory_stitcher", trajectory_stitcher_node)
            workflow.add_node("evidence_validator", evidence_validator_node)
            workflow.add_node("timeline_generator", timeline_generator_node)
            workflow.add_node("forensic_report_generator", forensic_report_generator_node)

            # Establish sequential edge pipeline
            workflow.add_edge(START, "query_analyzer")
            workflow.add_edge("query_analyzer", "temporal_spatial_gate")
            workflow.add_edge("temporal_spatial_gate", "hybrid_search")
            workflow.add_edge("hybrid_search", "trajectory_stitcher")
            workflow.add_edge("trajectory_stitcher", "evidence_validator")
            workflow.add_edge("evidence_validator", "timeline_generator")
            workflow.add_edge("timeline_generator", "forensic_report_generator")
            workflow.add_edge("forensic_report_generator", END)

            self.graph = workflow.compile()
            logger.info("LangGraph Forensic Investigation StateGraph compiled successfully.")
        except Exception as e:
            logger.warning(f"LangGraph compile fallback ({e}). Running state sequence engine.")
            self.graph = None

    def run_investigation(self, query: str) -> Dict[str, Any]:
        """
        Executes the forensic investigation workflow for a natural-language query.
        """
        initial_state: InvestigationState = {
            "user_query": query,
            "extracted_entities": {},
            "temporal_constraints": {},
            "spatial_constraints": {},
            "search_request": {},
            "search_results": [],
            "trajectories": [],
            "evidence": [],
            "validation_result": {},
            "timeline": [],
            "final_report": {},
            "agent_logs": [f"[WORKFLOW_INIT] Starting forensic investigation for query: '{query}'"]
        }

        if self.graph is not None:
            try:
                final_state = self.graph.invoke(initial_state)
                return final_state
            except Exception as e:
                logger.error(f"LangGraph execution exception: {e}")

        # Reliable sequential fallback runner
        state = dict(initial_state)
        state.update(query_analyzer_node(state))
        state.update(temporal_spatial_gate_node(state))
        state.update(hybrid_search_node(state, self.search_engine))
        state.update(trajectory_stitcher_node(state))
        state.update(evidence_validator_node(state))
        state.update(timeline_generator_node(state))
        state.update(forensic_report_generator_node(state))
        return state

forensic_workflow = ForensicInvestigationWorkflow()
