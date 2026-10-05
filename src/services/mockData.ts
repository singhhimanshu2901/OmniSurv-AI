import { Camera, EvidenceItem, TimelineEvent, TrackTrajectory, ForensicReport } from '../types/forensic';

export const INITIAL_CAMERAS: Camera[] = [
  {
    id: 'cam-01',
    name: 'Camera 01 - Gate 1 North',
    location: 'Gate 1',
    stream_url: 'rtsp://10.240.12.101:554/live/ch01',
    status: 'active',
    fps: 30.0,
    resolution: '1920x1080',
    bitrate: '4.2 Mbps'
  },
  {
    id: 'cam-02',
    name: 'Camera 02 - Parking Area B',
    location: 'Parking Area',
    stream_url: 'rtsp://10.240.12.102:554/live/ch02',
    status: 'active',
    fps: 30.0,
    resolution: '1920x1080',
    bitrate: '3.8 Mbps'
  },
  {
    id: 'cam-03',
    name: 'Camera 03 - Main Perimeter Corridor',
    location: 'Main Road',
    stream_url: 'rtsp://10.240.12.103:554/live/ch03',
    status: 'active',
    fps: 30.0,
    resolution: '1920x1080',
    bitrate: '4.0 Mbps'
  },
  {
    id: 'cam-04',
    name: 'Camera 04 - Exit Gate & Loading Dock',
    location: 'Exit Gate',
    stream_url: 'rtsp://10.240.12.104:554/live/ch04',
    status: 'active',
    fps: 30.0,
    resolution: '1920x1080',
    bitrate: '4.5 Mbps'
  }
];

export const INITIAL_EVIDENCE: EvidenceItem[] = [
  {
    id: 'ev-001',
    trackId: 42,
    objectClass: 'car',
    timestamp: 441, // 15:07:21
    timeStr: '15:07:21',
    cameraId: 'cam-01',
    cameraName: 'Camera 01 - Gate 1 North',
    location: 'Gate 1',
    confidence: 0.94,
    similarityScore: 0.887,
    cropUrl: '',
    bbox: [220, 360, 480, 520],
    color: 'blue',
    notes: 'Primary match: Blue 4-door sedan entering north security barrier.'
  },
  {
    id: 'ev-002',
    trackId: 42,
    objectClass: 'car',
    timestamp: 583, // 15:09:43
    timeStr: '15:09:43',
    cameraId: 'cam-02',
    cameraName: 'Camera 02 - Parking Area B',
    location: 'Parking Area',
    confidence: 0.92,
    similarityScore: 0.864,
    cropUrl: '',
    bbox: [310, 280, 590, 440],
    color: 'blue',
    notes: 'Secondary match: Vehicle maneuvering in Parking Bay 4.'
  },
  {
    id: 'ev-003',
    trackId: 42,
    objectClass: 'car',
    timestamp: 842, // 15:14:02
    timeStr: '15:14:02',
    cameraId: 'cam-04',
    cameraName: 'Camera 04 - Exit Gate & Loading Dock',
    location: 'Exit Gate',
    confidence: 0.95,
    similarityScore: 0.892,
    cropUrl: '',
    bbox: [410, 310, 680, 490],
    color: 'blue',
    notes: 'Departure match: Blue sedan departing facility via outbound boom barrier.'
  },
  {
    id: 'ev-004',
    trackId: 19,
    objectClass: 'person',
    timestamp: 310, // 15:05:10
    timeStr: '15:05:10',
    cameraId: 'cam-03',
    cameraName: 'Camera 03 - Main Perimeter Corridor',
    location: 'Main Road',
    confidence: 0.91,
    similarityScore: 0.762,
    cropUrl: '',
    bbox: [180, 190, 290, 480],
    color: 'dark',
    notes: 'Pedestrian in dark jacket loitering along eastern fence line.'
  },
  {
    id: 'ev-005',
    trackId: 55,
    objectClass: 'bag',
    timestamp: 315, // 15:05:15
    timeStr: '15:05:15',
    cameraId: 'cam-03',
    cameraName: 'Camera 03 - Main Perimeter Corridor',
    location: 'Main Road',
    confidence: 0.88,
    similarityScore: 0.748,
    cropUrl: '',
    bbox: [240, 310, 310, 420],
    color: 'black',
    notes: 'Associated bag carried by Track #19.'
  }
];

export const INITIAL_TIMELINE: TimelineEvent[] = [
  {
    id: 'tl-1',
    timestamp: 441,
    timeStr: '15:07:21',
    trackId: 42,
    objectClass: 'car',
    cameraId: 'cam-01',
    location: 'Gate 1 Entry',
    eventType: 'ENTRY',
    description: 'Track #42 (blue sedan) passes under Gate 1 ANPR barrier.',
    confidence: 0.94
  },
  {
    id: 'tl-2',
    timestamp: 512,
    timeStr: '15:08:32',
    trackId: 42,
    objectClass: 'car',
    cameraId: 'cam-01',
    location: 'Gate 1 Access Road',
    eventType: 'MOVEMENT',
    description: 'Vehicle proceeds south towards Parking Area at 18 km/h.',
    confidence: 0.91
  },
  {
    id: 'tl-3',
    timestamp: 583,
    timeStr: '15:09:43',
    trackId: 42,
    objectClass: 'car',
    cameraId: 'cam-02',
    location: 'Parking Area B',
    eventType: 'DETECTED',
    description: 'Handover to Camera 02. Vehicle halts temporarily in Lane 3.',
    confidence: 0.92
  },
  {
    id: 'tl-4',
    timestamp: 710,
    timeStr: '15:11:50',
    trackId: 42,
    objectClass: 'car',
    cameraId: 'cam-02',
    location: 'Parking Area B',
    eventType: 'MOVEMENT',
    description: 'Vehicle initiates turn towards perimeter outbound connector.',
    confidence: 0.93
  },
  {
    id: 'tl-5',
    timestamp: 842,
    timeStr: '15:14:02',
    trackId: 42,
    objectClass: 'car',
    cameraId: 'cam-04',
    location: 'Exit Gate B',
    eventType: 'EXIT',
    description: 'Track #42 verified passing exit sensor. Incident concluded.',
    confidence: 0.95
  }
];

export const TRAJECTORY_TRACK_42: TrackTrajectory = {
  trackId: 42,
  objectClass: 'car',
  firstSeen: 441,
  lastSeen: 842,
  duration: 401,
  frameCount: 1240,
  cameraSequence: ['cam-01', 'cam-02', 'cam-04'],
  locationSequence: ['Gate 1', 'Parking Area', 'Exit Gate'],
  path: [
    { timestamp: 441, x: 120, y: 720, cameraId: 'cam-01', location: 'Gate 1', frameNumber: 420 },
    { timestamp: 475, x: 260, y: 640, cameraId: 'cam-01', location: 'Gate 1 Access', frameNumber: 480 },
    { timestamp: 512, x: 410, y: 560, cameraId: 'cam-01', location: 'Access Road South', frameNumber: 540 },
    { timestamp: 583, x: 530, y: 490, cameraId: 'cam-02', location: 'Parking Area B', frameNumber: 720 },
    { timestamp: 650, x: 640, y: 440, cameraId: 'cam-02', location: 'Parking Lane 3', frameNumber: 860 },
    { timestamp: 710, x: 740, y: 390, cameraId: 'cam-02', location: 'Parking Connector', frameNumber: 990 },
    { timestamp: 790, x: 860, y: 340, cameraId: 'cam-04', location: 'Exit Approach', frameNumber: 1120 },
    { timestamp: 842, x: 960, y: 290, cameraId: 'cam-04', location: 'Exit Gate B', frameNumber: 1240 }
  ],
  gaps: [
    {
      gap_start: 514,
      gap_end: 581,
      duration_sec: 67,
      note: 'Blind spot transition between Camera 01 (Gate 1) and Camera 02 (Parking Lot). No synthetic coordinates generated (Anti-Hallucination policy).'
    },
    {
      gap_start: 715,
      gap_end: 788,
      duration_sec: 73,
      note: 'Blind spot connector road between Camera 02 and Camera 04.'
    }
  ],
  entryEvent: {
    timestamp: 441,
    location: 'Gate 1 North Entry',
    description: 'Track #42 first sighted crossing north barrier line at 15:07:21.'
  },
  exitEvent: {
    timestamp: 842,
    location: 'Exit Gate B',
    description: 'Track #42 cleared facility perimeter at 15:14:02.'
  }
};

export const INITIAL_REPORT: ForensicReport = {
  caseId: 'FORENSIC-CCTV-2026-0891',
  investigationQuery: 'Find the blue sedan near Gate 1 after 15:00 and track its movement until exit.',
  generatedAt: new Date().toISOString(),
  investigator: 'Lead Forensic Investigator (AI Assisted)',
  executiveSummary: 'Multimodal forensic analysis identified Track ID 42 as the primary target corresponding to "blue sedan". Target first entered Camera 01 (Gate 1) at 15:07:21, proceeded through Camera 02 (Parking Area B) at 15:09:43, and exited via Camera 04 (Exit Gate B) at 15:14:02. Cross-camera visual correlation achieved 0.887 CLIP cosine similarity with 0.94 YOLOv11x confidence.',
  status: 'VERIFIED_EVIDENCE',
  detectedEntities: [
    {
      trackId: 42,
      class: 'car',
      color: 'blue',
      firstSeen: 441,
      cameraOrigin: 'cam-01'
    }
  ],
  timeline: INITIAL_TIMELINE,
  trajectoryAnalysis: {
    primaryTrackId: 42,
    trajectories: [TRAJECTORY_TRACK_42]
  },
  evidenceSummary: INITIAL_EVIDENCE.filter(e => e.trackId === 42),
  confidenceAssessment: {
    overallConfidence: 0.914,
    clipCosineSimilarity: 0.887,
    yoloDetectionConfidence: 0.940,
    confidenceBand: 'HIGH_CONFIDENCE'
  },
  cameraInformation: INITIAL_CAMERAS.map(c => ({
    cameraId: c.id,
    name: c.name,
    location: c.location
  })),
  uncertaintyStatement: 'All spatial and temporal observations are strictly anchored in authenticated CCTV frames. Two blind spot intervals (514s-581s and 715s-788s) exist where direct optical line-of-sight was unavailable; no speculative positions were interpolated.',
  limitations: [
    'Analysis is contingent upon optical resolution and illumination conditions in sector 3.',
    'License plate alphanumeric OCR is pending high-resolution evidentiary subpoena.',
    'Vehicle driver identity cannot be asserted due to windshield glare.'
  ]
};
