import React from 'react';
import { GitBranch, MapPin, AlertOctagon, CheckCircle2, Video, ArrowRight, ShieldAlert, Clock } from 'lucide-react';
import { TrackTrajectory } from '../types/forensic';

interface TrajectoryViewerProps {
  trajectory: TrackTrajectory;
  currentTime: number;
  onSeekTime: (time: number) => void;
}

export const TrajectoryViewer: React.FC<TrajectoryViewerProps> = ({
  trajectory,
  currentTime,
  onSeekTime
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-mono font-bold text-slate-200 tracking-wider">
            2D MULTI-CAMERA TRAJECTORY RECONSTRUCTION [TRACK #{trajectory.trackId}]
          </h3>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span>CLASS: <strong className="text-white uppercase">{trajectory.objectClass}</strong></span>
          <span>•</span>
          <span>DURATION: <strong className="text-cyan-400">{trajectory.duration}s</strong></span>
          <span>•</span>
          <span>OBSERVATIONS: <strong className="text-emerald-400">{trajectory.frameCount} frames</strong></span>
        </div>
      </div>

      {/* Facility Layout 2D Motion Map */}
      <div className="relative bg-slate-950 border border-slate-800 rounded-xl p-4 overflow-hidden">
        {/* SVG Top-down Spatial Map */}
        <div className="relative w-full aspect-[21/9] min-h-[220px]">
          <svg className="w-full h-full" viewBox="0 0 1000 360" preserveAspectRatio="xMidYMid meet">
            {/* Facility Blueprint Grid Lines */}
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="1" />
              </pattern>
              <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="50%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>
            <rect width="1000" height="360" fill="url(#grid)" />

            {/* Zone Boundaries */}
            {/* Zone 1: Gate 1 */}
            <rect x="60" y="40" width="240" height="280" rx="12" fill="rgba(30, 41, 59, 0.4)" stroke="rgba(56, 189, 248, 0.3)" strokeDasharray="4 4" />
            <text x="80" y="70" fill="#94a3b8" fontFamily="monospace" fontSize="12" fontWeight="bold">ZONE 01: GATE 1 (NORTH)</text>

            {/* Zone 2: Parking Area B */}
            <rect x="380" y="40" width="260" height="280" rx="12" fill="rgba(30, 41, 59, 0.4)" stroke="rgba(129, 140, 248, 0.3)" strokeDasharray="4 4" />
            <text x="400" y="70" fill="#94a3b8" fontFamily="monospace" fontSize="12" fontWeight="bold">ZONE 02: PARKING AREA B</text>

            {/* Zone 3: Exit Gate */}
            <rect x="720" y="40" width="220" height="280" rx="12" fill="rgba(30, 41, 59, 0.4)" stroke="rgba(52, 211, 153, 0.3)" strokeDasharray="4 4" />
            <text x="740" y="70" fill="#94a3b8" fontFamily="monospace" fontSize="12" fontWeight="bold">ZONE 03: EXIT GATE B</text>

            {/* Blind Spot Gaps Indicators */}
            {/* Blind Spot 1: between Gate 1 and Parking Area */}
            <rect x="305" y="110" width="70" height="140" rx="6" fill="rgba(239, 68, 68, 0.12)" stroke="#ef4444" strokeWidth="1" strokeDasharray="3 3" />
            <text x="312" y="170" fill="#fca5a5" fontFamily="monospace" fontSize="9" fontWeight="bold">BLIND SPOT</text>
            <text x="316" y="185" fill="#f87171" fontFamily="monospace" fontSize="8">NO SENSOR</text>

            {/* Blind Spot 2: between Parking and Exit */}
            <rect x="645" y="110" width="70" height="140" rx="6" fill="rgba(239, 68, 68, 0.12)" stroke="#ef4444" strokeWidth="1" strokeDasharray="3 3" />
            <text x="652" y="170" fill="#fca5a5" fontFamily="monospace" fontSize="9" fontWeight="bold">BLIND SPOT</text>
            <text x="656" y="185" fill="#f87171" fontFamily="monospace" fontSize="8">NO SENSOR</text>

            {/* Reconstructed Motion Path Line */}
            {/* Leg 1: Gate 1 */}
            <path d="M 120 250 L 210 210 L 295 180" fill="none" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
            {/* Discontinuous Gap (dashed red to show sensor absence) */}
            <path d="M 295 180 L 390 180" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 4" />

            {/* Leg 2: Parking Area B */}
            <path d="M 390 180 L 480 200 L 540 170 L 635 180" fill="none" stroke="#818cf8" strokeWidth="4" strokeLinecap="round" />
            {/* Discontinuous Gap 2 */}
            <path d="M 635 180 L 735 180" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 4" />

            {/* Leg 3: Exit Gate */}
            <path d="M 735 180 L 820 160 L 890 140" fill="none" stroke="#34d399" strokeWidth="4" strokeLinecap="round" />

            {/* Waypoint Markers */}
            {/* Entry Marker */}
            <circle cx="120" cy="250" r="7" fill="#38bdf8" />
            <circle cx="120" cy="250" r="14" fill="none" stroke="#38bdf8" strokeWidth="1.5" className="animate-ping" />
            <text x="100" y="280" fill="#38bdf8" fontFamily="monospace" fontSize="10" fontWeight="bold">15:07:21 ENTRY</text>

            {/* Parking Midpoint Marker */}
            <circle cx="540" cy="170" r="6" fill="#818cf8" />
            <text x="500" y="145" fill="#818cf8" fontFamily="monospace" fontSize="10" fontWeight="bold">15:09:43 PARKING BAY</text>

            {/* Exit Marker */}
            <circle cx="890" cy="140" r="7" fill="#34d399" />
            <text x="850" y="120" fill="#34d399" fontFamily="monospace" fontSize="10" fontWeight="bold">15:14:02 EXIT</text>
          </svg>
        </div>

        {/* Legend / Anti-Hallucination Disclaimer */}
        <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between flex-wrap gap-2 text-xs font-mono">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <span className="w-3 h-1 bg-cyan-400 rounded"></span> Verified Observation Path
            </span>
            <span className="flex items-center gap-1.5 text-rose-400">
              <span className="w-3 h-1 bg-rose-500 border border-dashed rounded"></span> Sensor Blind Spot (Zero Interpolation)
            </span>
          </div>

          <div className="text-slate-400 flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>Strict Anti-Hallucination: Blind spots explicitly unlinked.</span>
          </div>
        </div>
      </div>

      {/* Trajectory Milestones & Gap Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Entry & Exit Details */}
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs flex flex-col gap-2">
          <div className="font-mono font-bold text-slate-300 flex items-center gap-1.5 border-b border-slate-800 pb-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>VERIFIED PERIMETER TRANSITIONS</span>
          </div>

          <div className="space-y-2 font-mono">
            <div className="p-2 rounded bg-slate-900 border border-slate-800 flex items-start justify-between">
              <div>
                <span className="text-emerald-400 font-bold block">15:07:21 • INGRESS</span>
                <span className="text-slate-400 text-[11px]">{trajectory.entryEvent?.description}</span>
              </div>
              <button
                onClick={() => onSeekTime(441)}
                className="px-2 py-1 bg-cyan-950 border border-cyan-800 text-cyan-300 rounded text-[10px] hover:bg-cyan-900 transition-colors"
              >
                SEEK VIDEO
              </button>
            </div>

            <div className="p-2 rounded bg-slate-900 border border-slate-800 flex items-start justify-between">
              <div>
                <span className="text-rose-400 font-bold block">15:14:02 • EGRESS</span>
                <span className="text-slate-400 text-[11px]">{trajectory.exitEvent?.description}</span>
              </div>
              <button
                onClick={() => onSeekTime(842)}
                className="px-2 py-1 bg-cyan-950 border border-cyan-800 text-cyan-300 rounded text-[10px] hover:bg-cyan-900 transition-colors"
              >
                SEEK VIDEO
              </button>
            </div>
          </div>
        </div>

        {/* Audit Gaps */}
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs flex flex-col gap-2">
          <div className="font-mono font-bold text-amber-400 flex items-center gap-1.5 border-b border-slate-800 pb-1.5">
            <AlertOctagon className="w-3.5 h-3.5 text-amber-400" />
            <span>OPTICAL SENSOR DISCONTINUITIES ({trajectory.gaps.length} GAPS)</span>
          </div>

          <div className="space-y-1.5 overflow-y-auto max-h-36">
            {trajectory.gaps.map((gap, idx) => (
              <div key={idx} className="p-2 bg-amber-950/20 border border-amber-900/40 rounded text-[11px] font-mono">
                <div className="flex items-center justify-between text-amber-300 font-bold mb-0.5">
                  <span>DISCONTINUITY #{idx + 1}</span>
                  <span>{gap.duration_sec}s BLIND INTERVAL</span>
                </div>
                <p className="text-slate-400 text-[10px] leading-relaxed">
                  {gap.note}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
