import React from 'react';
import { X, Video, ShieldCheck, Activity, Wifi, Radio } from 'lucide-react';
import { Camera } from '../types/forensic';

interface CameraManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  cameras: Camera[];
  currentCamera: Camera;
  onSelectCamera: (cam: Camera) => void;
}

export const CameraManagerModal: React.FC<CameraManagerModalProps> = ({
  isOpen,
  onClose,
  cameras,
  currentCamera,
  onSelectCamera
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-950 text-cyan-400 rounded-lg border border-cyan-800">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
                CCTV CAMERA FLEET MONITOR
              </h2>
              <span className="text-xs text-slate-400 font-mono">
                RTSP / ONVIF PROTOCOL STACK • 4/4 CHANNELS SYNCHRONIZED
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Camera List */}
        <div className="p-6 space-y-3">
          {cameras.map((cam) => {
            const isSelected = cam.id === currentCamera.id;

            return (
              <div
                key={cam.id}
                className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                  isSelected
                    ? 'bg-slate-950 border-cyan-500 shadow-md shadow-cyan-950/40'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-cyan-400">
                    <Radio className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-white">
                        {cam.name}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        ONLINE
                      </span>
                    </div>
                    <div className="text-xs font-mono text-slate-400 mt-1 flex items-center gap-3">
                      <span>ZONE: <strong className="text-slate-300">{cam.location}</strong></span>
                      <span>•</span>
                      <span>RESOLUTION: <strong className="text-slate-300">{cam.resolution}</strong></span>
                      <span>•</span>
                      <span>FPS: <strong className="text-slate-300">{cam.fps}</strong></span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-500 mt-1">
                      STREAM: {cam.stream_url}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onSelectCamera(cam);
                    onClose();
                  }}
                  className={`px-4 py-2 rounded-lg font-mono text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-cyan-600 text-white'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  {isSelected ? 'ACTIVE VIEW' : 'SWITCH FEED'}
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="bg-slate-950 px-6 py-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-500">
          <span>RTSP H.265 / ONVIF Profile S Compliance Verified</span>
          <span>4 Channels Active</span>
        </div>
      </div>
    </div>
  );
};
