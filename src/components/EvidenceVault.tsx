import React from 'react';
import { ShieldCheck, Video, Clock, Crosshair, ArrowUpRight, CheckCircle, Tag, Eye } from 'lucide-react';
import { EvidenceItem } from '../types/forensic';

interface EvidenceVaultProps {
  evidenceList: EvidenceItem[];
  selectedTrackId: number | null;
  onSelectEvidence: (item: EvidenceItem) => void;
  activeEvidenceId?: string;
}

export const EvidenceVault: React.FC<EvidenceVaultProps> = ({
  evidenceList,
  selectedTrackId,
  onSelectEvidence,
  activeEvidenceId
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-mono font-bold text-slate-200 tracking-wider">
            FORENSIC EVIDENCE VAULT [CLIP 512D + YOLO CROPS]
          </h3>
        </div>
        <span className="text-[11px] font-mono text-slate-400">
          INDEXED ARTIFACTS: <strong className="text-emerald-400">{evidenceList.length}</strong> | EVIDENCE GROUNDED
        </span>
      </div>

      {/* Grid of Evidence Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {evidenceList.map((item) => {
          const isSelected = selectedTrackId === item.trackId;
          const isActive = activeEvidenceId === item.id;

          return (
            <div
              key={item.id}
              className={`p-3 rounded-lg border flex flex-col justify-between transition-all bg-slate-950 ${
                isActive || isSelected
                  ? 'border-cyan-400 ring-1 ring-cyan-500/50 shadow-lg shadow-cyan-950/40'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                {/* Header: Track ID & Similarity Score */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 bg-cyan-950 border border-cyan-800 text-cyan-300 font-mono text-xs font-bold rounded">
                      TRACK #{item.trackId}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 uppercase">
                      {item.objectClass}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded text-[11px] font-mono font-bold text-emerald-300">
                    <span>CLIP SIM:</span>
                    <span>{(item.similarityScore * 100).toFixed(1)}%</span>
                  </div>
                </div>

                {/* Evidence Crop Visual Simulation */}
                <div className="relative aspect-video bg-slate-900 rounded-md overflow-hidden border border-slate-800 flex items-center justify-center group mb-2.5">
                  {/* Visual mockup of the crop */}
                  <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center bg-gradient-to-b from-slate-900 to-slate-950">
                    {item.objectClass === 'car' ? (
                      <div className="w-28 h-14 bg-blue-900/80 rounded-md border border-blue-500/60 flex items-center justify-center shadow-inner relative">
                        <span className="text-[9px] font-mono font-bold text-blue-200">
                          BLUE SEDAN CROP
                        </span>
                        <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyan-400 animate-ping"></div>
                      </div>
                    ) : item.objectClass === 'person' ? (
                      <div className="w-14 h-24 bg-slate-800 rounded-md border border-slate-600 flex items-center justify-center shadow-inner">
                        <span className="text-[9px] font-mono font-bold text-slate-300">
                          HOODIE CROP
                        </span>
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-amber-950/80 rounded-md border border-amber-600 flex items-center justify-center shadow-inner">
                        <span className="text-[9px] font-mono font-bold text-amber-200">
                          BACKPACK
                        </span>
                      </div>
                    )}

                    <div className="absolute bottom-1 right-2 text-[9px] font-mono text-slate-500">
                      224x224 L2-NORM
                    </div>
                  </div>

                  {/* Overlay button on hover */}
                  <div className="absolute inset-0 bg-cyan-950/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-xs">
                    <button
                      onClick={() => onSelectEvidence(item)}
                      className="px-3 py-1.5 bg-cyan-500 text-slate-950 font-bold text-xs rounded-md shadow-md flex items-center gap-1.5"
                    >
                      <Crosshair className="w-3.5 h-3.5" />
                      <span>SEEK & SPOTLIGHT</span>
                    </button>
                  </div>
                </div>

                {/* Evidence Metadata */}
                <div className="space-y-1 text-xs text-slate-300">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-cyan-400" />
                      {item.timeStr}
                    </span>
                    <span className="flex items-center gap-1">
                      <Video className="w-3 h-3 text-indigo-400" />
                      {item.cameraName}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-snug line-clamp-2 mt-1">
                    {item.notes}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-500">
                  YOLO CONF: {(item.confidence * 100).toFixed(0)}%
                </span>

                <button
                  onClick={() => onSelectEvidence(item)}
                  className="text-xs font-mono font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
                >
                  <span>LOCATE IN CCTV</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
