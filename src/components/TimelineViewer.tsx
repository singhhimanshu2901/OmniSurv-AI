import React from 'react';
import { Clock, MapPin, Video, Eye, ChevronRight } from 'lucide-react';
import { TimelineEvent, Camera } from '../types/forensic';

interface TimelineViewerProps {
  timeline: TimelineEvent[];
  currentTime: number;
  onSelectEvent: (event: TimelineEvent) => void;
  cameras: Camera[];
}

export const TimelineViewer: React.FC<TimelineViewerProps> = ({
  timeline,
  currentTime,
  onSelectEvent,
  cameras
}) => {
  const getEventBadgeColor = (type: string) => {
    switch (type) {
      case 'ENTRY':
        return 'bg-emerald-950 text-emerald-300 border-emerald-700';
      case 'EXIT':
        return 'bg-rose-950 text-rose-300 border-rose-700';
      case 'DETECTED':
        return 'bg-cyan-950 text-cyan-300 border-cyan-700';
      case 'MOVEMENT':
        return 'bg-blue-950 text-blue-300 border-blue-700';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-mono font-bold text-slate-200 tracking-wider">
            SYNCHRONIZED FORENSIC TIMELINE RECONSTRUCTION
          </h3>
        </div>
        <span className="text-[11px] font-mono text-slate-400">
          EVENTS: <strong className="text-cyan-400">{timeline.length}</strong> | CLICK MILESTONE TO SEEK VIDEO
        </span>
      </div>

      {/* Horizontal / Grid Timeline Events */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-2.5">
        {timeline.map((item) => {
          // Check if current video time is close to event
          const isNear = Math.abs(currentTime - item.timestamp) < 15;

          return (
            <button
              key={item.id}
              onClick={() => onSelectEvent(item)}
              className={`p-3 rounded-lg border text-left transition-all flex flex-col justify-between group ${
                isNear
                  ? 'bg-slate-950 border-cyan-400 shadow-md shadow-cyan-950/50 ring-1 ring-cyan-500/50'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-950'
              }`}
            >
              <div>
                {/* Time & Event Type Badge */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-cyan-300">
                    {item.timeStr}
                  </span>
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.5 rounded border font-semibold ${getEventBadgeColor(
                      item.eventType
                    )}`}
                  >
                    {item.eventType}
                  </span>
                </div>

                {/* Location */}
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-300 mb-1">
                  <MapPin className="w-3 h-3 text-slate-500" />
                  <span className="truncate">{item.location}</span>
                </div>

                {/* Description */}
                <p className="text-[10px] text-slate-400 leading-relaxed line-clamp-2">
                  {item.description}
                </p>
              </div>

              {/* Footer info: Camera ID & Confidence */}
              <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span className="flex items-center gap-1">
                  <Video className="w-2.5 h-2.5" />
                  {item.cameraId.toUpperCase()}
                </span>
                <span className="text-cyan-400 font-semibold">
                  CONF: {(item.confidence * 100).toFixed(0)}%
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
