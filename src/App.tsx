import React, { useState } from 'react';
import {
  Shield,
  Video,
  Search,
  Clock,
  GitBranch,
  FileText,
  Award,
  Activity,
  Layers,
  Sparkles,
  Database,
  ExternalLink,
  ChevronRight,
  Eye
} from 'lucide-react';

import { Camera, EvidenceItem, TimelineEvent, TrackTrajectory, ForensicReport, LangGraphNodeStatus } from './types/forensic';
import { INITIAL_CAMERAS, INITIAL_EVIDENCE, INITIAL_TIMELINE, TRAJECTORY_TRACK_42, INITIAL_REPORT } from './services/mockData';

import { CCTVPlayer } from './components/CCTVPlayer';
import { InvestigationBar } from './components/InvestigationBar';
import { LangGraphPipeline } from './components/LangGraphPipeline';
import { TimelineViewer } from './components/TimelineViewer';
import { EvidenceVault } from './components/EvidenceVault';
import { TrajectoryViewer } from './components/TrajectoryViewer';
import { ReportModal } from './components/ReportModal';
import { VideoProcessorModal } from './components/VideoProcessorModal';
import { VivaGuideModal } from './components/VivaGuideModal';
import { CameraManagerModal } from './components/CameraManagerModal';

const INITIAL_NODES: LangGraphNodeStatus[] = [
  {
    id: 'query_analyzer',
    name: 'Query Analyzer',
    description: 'Extracts target class, color, location, and temporal constraints.',
    status: 'completed',
    outputSummary: 'class: car | color: blue | loc: Gate 1'
  },
  {
    id: 'temporal_spatial_gate',
    name: 'Spatial/Temporal Gate',
    description: 'Validates bounds and maps constraints to operational cameras.',
    status: 'completed',
    outputSummary: 't >= 15:00:00 | cams: 01, 02, 04'
  },
  {
    id: 'hybrid_search',
    name: 'Hybrid Search',
    description: 'Qdrant 512D CLIP vectors + PostgreSQL metadata SQL filters.',
    status: 'completed',
    outputSummary: '3 candidate clusters retrieved'
  },
  {
    id: 'trajectory_stitcher',
    name: 'Trajectory Stitcher',
    description: 'Reconstructs continuous tracklet path & flags blind-spot gaps.',
    status: 'completed',
    outputSummary: 'Track #42: 3 cameras, 2 gaps'
  },
  {
    id: 'evidence_validator',
    name: 'Evidence Validator',
    description: 'Strict Anti-Hallucination check: verifies visual ground truth.',
    status: 'completed',
    outputSummary: 'CONFIRMED: CLIP Sim 0.887'
  },
  {
    id: 'timeline_generator',
    name: 'Timeline Generator',
    description: 'Synthesizes chronological forensic event sequence.',
    status: 'completed',
    outputSummary: '5 verified incident events'
  },
  {
    id: 'forensic_report_generator',
    name: 'Report Generator',
    description: 'Assembles evidence-grounded report with legal disclaimers.',
    status: 'completed',
    outputSummary: 'Case CASE-2026-0891 filed'
  }
];

export default function App() {
  // Navigation & Modal State
  const [activeTab, setActiveTab] = useState<'console' | 'trajectory' | 'evidence' | 'report'>('console');
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);
  const [isProcessorOpen, setIsProcessorOpen] = useState<boolean>(false);
  const [isVivaOpen, setIsVivaOpen] = useState<boolean>(false);
  const [isCamerasOpen, setIsCamerasOpen] = useState<boolean>(false);

  // Core Surveillance & Investigation State
  const [cameras, setCameras] = useState<Camera[]>(INITIAL_CAMERAS);
  const [currentCamera, setCurrentCamera] = useState<Camera>(INITIAL_CAMERAS[0]);
  const [currentTime, setCurrentTime] = useState<number>(441); // 15:07:21
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [selectedTrackId, setSelectedTrackId] = useState<number | null>(42);
  const [activeEvidence, setActiveEvidence] = useState<EvidenceItem | null>(INITIAL_EVIDENCE[0]);

  // Forensic Data
  const [evidenceList, setEvidenceList] = useState<EvidenceItem[]>(INITIAL_EVIDENCE);
  const [timeline, setTimeline] = useState<TimelineEvent[]>(INITIAL_TIMELINE);
  const [trajectory, setTrajectory] = useState<TrackTrajectory>(TRAJECTORY_TRACK_42);
  const [report, setReport] = useState<ForensicReport>(INITIAL_REPORT);

  // LangGraph Agent State
  const [langGraphNodes, setLangGraphNodes] = useState<LangGraphNodeStatus[]>(INITIAL_NODES);
  const [isInvestigating, setIsInvestigating] = useState<boolean>(false);
  const [agentLogs, setAgentLogs] = useState<string[]>([
    "[WORKFLOW_INIT] Forensic pipeline loaded and verified.",
    "[QUERY_ANALYZER] Parsed query: 'Find the blue sedan near Gate 1 after 15:00 and track its movement until exit.'",
    "[GATE] Mapped constraints: Camera 01 (Gate 1) -> Camera 02 (Parking) -> Camera 04 (Exit)",
    "[HYBRID_SEARCH] Querying Qdrant 512D CLIP vectors with structured SQL filters...",
    "[TRAJECTORY_STITCHER] Reconstructing multi-camera trajectories and blind-spot gaps...",
    "[EVIDENCE_VALIDATOR] Validation result: CONFIRMED (CLIP Cosine Similarity: 0.887, YOLO Conf: 0.94)",
    "[TIMELINE_GENERATOR] Synthesized 5 chronological forensic milestones.",
    "[REPORT_GENERATOR] Final report generated under Anti-Hallucination policy."
  ]);

  // Execute Agentic Investigation
  const handleRunInvestigation = (query: string) => {
    setIsInvestigating(true);
    setAgentLogs([
      `[INVESTIGATION_START] Triggered investigation for query: "${query}"`,
      `[LANGGRAPH] Executing 7-node state graph with anti-hallucination verification...`
    ]);

    // Simulate real-time node stepping
    const updatedNodes = langGraphNodes.map((n) => ({ ...n, status: 'idle' as const, outputSummary: '' }));
    setLangGraphNodes(updatedNodes);

    let step = 0;
    const interval = setInterval(() => {
      if (step < 7) {
        setLangGraphNodes((prev) =>
          prev.map((n, i) => {
            if (i < step) return { ...n, status: 'completed' as const };
            if (i === step) return { ...n, status: 'running' as const };
            return { ...n, status: 'idle' as const };
          })
        );

        if (step === 0) {
          setAgentLogs((prev) => [...prev, `[QUERY_ANALYZER] Extracted target entities from query: "${query}"`]);
        } else if (step === 1) {
          setAgentLogs((prev) => [...prev, `[GATE] Temporal and spatial boundaries enforced. Cameras mapped.`]);
        } else if (step === 2) {
          setAgentLogs((prev) => [...prev, `[HYBRID_SEARCH] Retrieved candidate crops matching query from Qdrant vector index.`]);
        } else if (step === 3) {
          setAgentLogs((prev) => [...prev, `[TRAJECTORY_STITCHER] Stitched Track #42 across Gate 1, Parking Lot, and Exit Gate.`]);
        } else if (step === 4) {
          setAgentLogs((prev) => [...prev, `[EVIDENCE_VALIDATOR] Verified visual artifacts against anti-hallucination threshold: CONFIRMED.`]);
        } else if (step === 5) {
          setAgentLogs((prev) => [...prev, `[TIMELINE_GENERATOR] Generated 5 chronological forensic events.`]);
        } else if (step === 6) {
          setAgentLogs((prev) => [...prev, `[REPORT_GENERATOR] Forensic incident report successfully synthesized.`]);
        }
        step++;
      } else {
        clearInterval(interval);
        setLangGraphNodes(INITIAL_NODES);
        setIsInvestigating(false);

        // Seek video to initial sighting and spotlight target
        setCurrentTime(441);
        setSelectedTrackId(42);
        setCurrentCamera(cameras[0]);
      }
    }, 450);
  };

  // Synchronized Event Selection (Seeks video & highlights camera/track)
  const handleSelectTimelineEvent = (event: TimelineEvent) => {
    setCurrentTime(event.timestamp);
    setSelectedTrackId(event.trackId);

    // Switch camera if needed
    const targetCam = cameras.find((c) => c.id === event.cameraId);
    if (targetCam) {
      setCurrentCamera(targetCam);
    }
  };

  // Synchronized Evidence Selection
  const handleSelectEvidence = (evidence: EvidenceItem) => {
    setActiveEvidence(evidence);
    setCurrentTime(evidence.timestamp);
    setSelectedTrackId(evidence.trackId);

    const targetCam = cameras.find((c) => c.id === evidence.cameraId);
    if (targetCam) {
      setCurrentCamera(targetCam);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Professional HUD Navbar */}
      <header className="bg-slate-950/95 border-b border-slate-800/80 sticky top-0 z-40 backdrop-blur-md px-4 py-2.5 flex items-center justify-between flex-wrap gap-3">
        {/* Branding & Major Project Tag */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-tr from-cyan-600 to-blue-600 rounded-xl shadow-lg shadow-cyan-950/50 flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold tracking-wider font-mono text-white flex items-center gap-1.5">
                OMNISURV-AI
                <span className="text-[10px] bg-cyan-950 text-cyan-400 font-mono px-2 py-0.5 rounded border border-cyan-800/80">
                  B.TECH MAJOR PROJECT
                </span>
              </h1>
            </div>
            <p className="text-[11px] text-slate-400 font-mono truncate max-w-md hidden sm:block">
              Multimodal Intelligent CCTV Forensic & Event Intelligence System
            </p>
          </div>
        </div>

        {/* System Health Indicators */}
        <div className="hidden lg:flex items-center gap-2 font-mono text-[11px] bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800 text-slate-400">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            POSTGRES ACID
          </span>
          <span>•</span>
          <span className="text-cyan-400">QDRANT 512D</span>
          <span>•</span>
          <span className="text-indigo-400">YOLOv11x</span>
          <span>•</span>
          <span className="text-amber-400">BYTETRACK</span>
          <span>•</span>
          <span className="text-purple-400">LANGGRAPH</span>
        </div>

        {/* Top Actions: Ingestion, Cameras, Viva Guide, Report */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsProcessorOpen(true)}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all"
          >
            <Activity className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">INGEST VIDEO</span>
          </button>

          <button
            onClick={() => setIsCamerasOpen(true)}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all"
          >
            <Video className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">CAMERAS (4)</span>
          </button>

          <button
            onClick={() => setIsVivaOpen(true)}
            className="px-3 py-1.5 bg-amber-950/80 hover:bg-amber-900 text-amber-300 border border-amber-800 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>VIVA DEFENSE</span>
          </button>

          <button
            onClick={() => setIsReportOpen(true)}
            className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 shadow-md shadow-cyan-900/40 transition-all"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>OFFICIAL REPORT</span>
          </button>
        </div>
      </header>

      {/* Main Workstation Layout */}
      <main className="flex-1 p-4 max-w-7xl mx-auto w-full space-y-4">
        {/* Natural Language Investigation Bar */}
        <InvestigationBar
          onSearch={handleRunInvestigation}
          isLoading={isInvestigating}
          activeQuery={report.investigationQuery}
        />

        {/* 7-Node LangGraph Forensic State Graph */}
        <LangGraphPipeline
          nodes={langGraphNodes}
          isRunning={isInvestigating}
          agentLogs={agentLogs}
        />

        {/* Workstation Tab Switcher */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2 flex-wrap gap-2">
          <div className="flex items-center gap-2 font-mono text-xs">
            <button
              onClick={() => setActiveTab('console')}
              className={`px-3.5 py-2 rounded-lg font-bold flex items-center gap-2 transition-all ${
                activeTab === 'console'
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-950/40'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Video className="w-4 h-4" />
              <span>FORENSIC CCTV CONSOLE</span>
            </button>

            <button
              onClick={() => setActiveTab('trajectory')}
              className={`px-3.5 py-2 rounded-lg font-bold flex items-center gap-2 transition-all ${
                activeTab === 'trajectory'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-950/40'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <GitBranch className="w-4 h-4" />
              <span>2D TRAJECTORY MAP</span>
            </button>

            <button
              onClick={() => setActiveTab('evidence')}
              className={`px-3.5 py-2 rounded-lg font-bold flex items-center gap-2 transition-all ${
                activeTab === 'evidence'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>EVIDENCE VAULT ({evidenceList.length})</span>
            </button>
          </div>

          <div className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            ACTIVE TARGET: <strong className="text-white">TRACK #{selectedTrackId || 'NONE'} (BLUE SEDAN)</strong>
          </div>
        </div>

        {/* Tab 1: FORENSIC CCTV CONSOLE */}
        {activeTab === 'console' && (
          <div className="space-y-4">
            {/* Synchronized CCTV Player with Real-time Bounding Box Overlays */}
            <CCTVPlayer
              currentCamera={currentCamera}
              onCameraChange={setCurrentCamera}
              cameras={cameras}
              currentTime={currentTime}
              onTimeChange={setCurrentTime}
              selectedTrackId={selectedTrackId}
              onSelectTrack={setSelectedTrackId}
              isPlaying={isPlaying}
              onTogglePlay={() => setIsPlaying(!isPlaying)}
              activeEvidence={activeEvidence}
            />

            {/* Synchronized Chronological Timeline Scrubber */}
            <TimelineViewer
              timeline={timeline}
              currentTime={currentTime}
              onSelectEvent={handleSelectTimelineEvent}
              cameras={cameras}
            />

            {/* Forensic Evidence Vault Cards */}
            <EvidenceVault
              evidenceList={evidenceList}
              selectedTrackId={selectedTrackId}
              onSelectEvidence={handleSelectEvidence}
              activeEvidenceId={activeEvidence?.id}
            />
          </div>
        )}

        {/* Tab 2: 2D MULTI-CAMERA TRAJECTORY MAP */}
        {activeTab === 'trajectory' && (
          <div className="space-y-4">
            <TrajectoryViewer
              trajectory={trajectory}
              currentTime={currentTime}
              onSeekTime={(t) => {
                setCurrentTime(t);
                setActiveTab('console');
              }}
            />

            {/* Synchronized Timeline below trajectory */}
            <TimelineViewer
              timeline={timeline}
              currentTime={currentTime}
              onSelectEvent={handleSelectTimelineEvent}
              cameras={cameras}
            />
          </div>
        )}

        {/* Tab 3: EVIDENCE VAULT */}
        {activeTab === 'evidence' && (
          <div className="space-y-4">
            <EvidenceVault
              evidenceList={evidenceList}
              selectedTrackId={selectedTrackId}
              onSelectEvidence={(ev) => {
                handleSelectEvidence(ev);
                setActiveTab('console');
              }}
              activeEvidenceId={activeEvidence?.id}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800/80 px-4 py-3 text-xs font-mono text-slate-500 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <span>OMNISURV-AI FORENSIC ENGINE</span>
          <span>•</span>
          <span>YOLOv11x + ByteTrack + CLIP ViT-B/32 + Qdrant + LangGraph</span>
        </div>
        <div>
          <span>B.Tech Final Year Major Project • Computer Science & Engineering</span>
        </div>
      </footer>

      {/* Modals */}
      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        report={report}
      />

      <VideoProcessorModal
        isOpen={isProcessorOpen}
        onClose={() => setIsProcessorOpen(false)}
        onProcessingComplete={() => {
          setIsProcessorOpen(false);
          handleRunInvestigation(report.investigationQuery);
        }}
      />

      <VivaGuideModal
        isOpen={isVivaOpen}
        onClose={() => setIsVivaOpen(false)}
      />

      <CameraManagerModal
        isOpen={isCamerasOpen}
        onClose={() => setIsCamerasOpen(false)}
        cameras={cameras}
        currentCamera={currentCamera}
        onSelectCamera={setCurrentCamera}
      />
    </div>
  );
}
