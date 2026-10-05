export interface Camera {
  id: string;
  name: string;
  location: string;
  stream_url?: string;
  status: 'active' | 'offline' | 'maintenance';
  fps: number;
  resolution: string;
  bitrate?: string;
}

export interface DetectionBox {
  id: string;
  trackId: number;
  objectClass: 'car' | 'person' | 'bag' | 'truck' | 'motorcycle';
  confidence: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color?: string;
  label?: string;
}

export interface TrajectoryPoint {
  timestamp: number;
  x: number;
  y: number;
  cameraId: string;
  location: string;
  frameNumber: number;
}

export interface TrajectoryGap {
  gap_start: number;
  gap_end: number;
  duration_sec: number;
  note: string;
}

export interface TrackTrajectory {
  trackId: number;
  objectClass: string;
  firstSeen: number;
  lastSeen: number;
  duration: number;
  frameCount: number;
  cameraSequence: string[];
  locationSequence: string[];
  path: TrajectoryPoint[];
  gaps: TrajectoryGap[];
  entryEvent?: {
    timestamp: number;
    location: string;
    description: string;
  };
  exitEvent?: {
    timestamp: number;
    location: string;
    description: string;
  };
}

export interface EvidenceItem {
  id: string;
  trackId: number;
  objectClass: string;
  timestamp: number;
  timeStr: string;
  cameraId: string;
  cameraName: string;
  location: string;
  confidence: number;
  similarityScore: number;
  cropUrl: string;
  bbox: [number, number, number, number];
  color: string;
  notes: string;
}

export interface TimelineEvent {
  id: string;
  timestamp: number;
  timeStr: string;
  trackId: number;
  objectClass: string;
  cameraId: string;
  location: string;
  eventType: 'ENTRY' | 'DETECTED' | 'MOVEMENT' | 'LOITERING' | 'EXIT';
  description: string;
  confidence: number;
  evidenceCrop?: string;
}

export interface LangGraphNodeStatus {
  id: string;
  name: string;
  description: string;
  status: 'idle' | 'running' | 'completed' | 'error';
  outputSummary?: string;
  durationMs?: number;
}

export interface ForensicReport {
  caseId: string;
  investigationQuery: string;
  generatedAt: string;
  investigator: string;
  executiveSummary: string;
  status: 'VERIFIED_EVIDENCE' | 'INSUFFICIENT_EVIDENCE' | 'FLAGGED';
  detectedEntities: {
    trackId: number;
    class: string;
    color: string;
    firstSeen: number;
    cameraOrigin: string;
  }[];
  timeline: TimelineEvent[];
  trajectoryAnalysis: {
    primaryTrackId: number;
    trajectories: TrackTrajectory[];
  };
  evidenceSummary: EvidenceItem[];
  confidenceAssessment: {
    overallConfidence: number;
    clipCosineSimilarity: number;
    yoloDetectionConfidence: number;
    confidenceBand: 'HIGH_CONFIDENCE' | 'MEDIUM_CONFIDENCE' | 'LOW_CONFIDENCE';
  };
  cameraInformation: {
    cameraId: string;
    name: string;
    location: string;
  }[];
  uncertaintyStatement: string;
  limitations: string[];
}
