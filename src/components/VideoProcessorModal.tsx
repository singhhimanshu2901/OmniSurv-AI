import React, { useState } from 'react';
import { X, Play, Upload, CheckCircle2, Cpu, Database, Activity, RefreshCw } from 'lucide-react';

interface VideoProcessorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProcessingComplete?: () => void;
}

export const VideoProcessorModal: React.FC<VideoProcessorModalProps> = ({
  isOpen,
  onClose,
  onProcessingComplete
}) => {
  const [selectedFile, setSelectedFile] = useState<string>('gate1_incident_20261005_1500.mp4');
  const [yoloConf, setYoloConf] = useState<number>(0.35);
  const [trackBuffer, setTrackBuffer] = useState<number>(30);
  const [clipBatch, setClipBatch] = useState<number>(32);

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [processedFrames, setProcessedFrames] = useState<number>(0);
  const [detectionsCount, setDetectionsCount] = useState<number>(0);
  const [tracksCount, setTracksCount] = useState<number>(0);
  const [embeddingsCount, setEmbeddingsCount] = useState<number>(0);
  const [currentStep, setCurrentStep] = useState<string>('Idle');

  if (!isOpen) return null;

  const handleStartProcessing = () => {
    setIsProcessing(true);
    setProgress(0);
    setProcessedFrames(0);
    setDetectionsCount(0);
    setTracksCount(0);
    setEmbeddingsCount(0);

    const totalFrames = 120;
    let current = 0;

    const interval = setInterval(() => {
      current += 6;
      const pct = Math.min(100, Math.round((current / totalFrames) * 100));
      setProgress(pct);
      setProcessedFrames(current);
      setDetectionsCount(Math.round(current * 1.8));
      setTracksCount(Math.min(12, Math.round(current * 0.1) + 2));
      setEmbeddingsCount(Math.round(current * 1.2));

      if (current < 30) {
        setCurrentStep('OpenCV Frame Ingestion & Resolution Validation');
      } else if (current < 65) {
        setCurrentStep('YOLOv11x Deep Feature Extraction & Bounding Boxes');
      } else if (current < 85) {
        setCurrentStep('ByteTrack Kalman Association & Tracklet Persistence');
      } else if (current < 110) {
        setCurrentStep('Crop Extraction & CLIP ViT-B/32 512D Embeddings');
      } else {
        setCurrentStep('Qdrant Vector HNSW Indexing & PostgreSQL Metadata Commit');
      }

      if (current >= totalFrames) {
        clearInterval(interval);
        setIsProcessing(false);
        setCurrentStep('Ingestion Pipeline Completed Successfully');
        if (onProcessingComplete) onProcessingComplete();
      }
    }, 180);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-950 text-indigo-400 rounded-lg border border-indigo-800">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-mono">
                VIDEO INGESTION & CV PIPELINE STUDIO
              </h2>
              <span className="text-xs text-slate-400 font-mono">
                YOLOv11x • BYTETRACK • CLIP ViT-B/32 • QDRANT VECTOR STORE
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

        {/* Form Body */}
        <div className="p-6 space-y-5 text-sm">
          {/* Video selection */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-bold text-slate-300 block">
              SELECT CCTV SOURCE FOOTAGE
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: 'gate1_incident_20261005_1500.mp4', label: 'Camera 01: Gate 1 Incident Clip (180s)' },
                { name: 'parking_area_b_feed.mp4', label: 'Camera 02: Parking Area B Clip (240s)' }
              ].map((v) => (
                <button
                  key={v.name}
                  type="button"
                  onClick={() => setSelectedFile(v.name)}
                  className={`p-3 rounded-lg border text-left font-mono text-xs transition-all ${
                    selectedFile === v.name
                      ? 'bg-slate-950 border-cyan-500 text-cyan-300'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="font-bold block text-slate-200">{v.name}</span>
                  <span className="text-[10px] text-slate-500 mt-1 block">{v.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Hyperparameters Config */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
              <label className="text-[11px] font-mono text-slate-400 block">
                YOLO CONFIDENCE THRESHOLD
              </label>
              <div className="flex items-center justify-between text-xs font-mono text-cyan-400 font-bold">
                <span>{yoloConf.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min={0.15}
                max={0.80}
                step={0.05}
                value={yoloConf}
                onChange={(e) => setYoloConf(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
              <label className="text-[11px] font-mono text-slate-400 block">
                BYTETRACK BUFFER (FRAMES)
              </label>
              <div className="flex items-center justify-between text-xs font-mono text-indigo-400 font-bold">
                <span>{trackBuffer} frames</span>
              </div>
              <input
                type="range"
                min={10}
                max={60}
                step={5}
                value={trackBuffer}
                onChange={(e) => setTrackBuffer(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-indigo-400"
              />
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
              <label className="text-[11px] font-mono text-slate-400 block">
                CLIP BATCH SIZE
              </label>
              <div className="flex items-center justify-between text-xs font-mono text-emerald-400 font-bold">
                <span>{clipBatch} crops</span>
              </div>
              <input
                type="range"
                min={8}
                max={64}
                step={8}
                value={clipBatch}
                onChange={(e) => setClipBatch(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-emerald-400"
              />
            </div>
          </div>

          {/* Real-time Progress HUD */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3 font-mono">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-bold">PIPELINE STATUS:</span>
              <span className="text-cyan-400 font-bold">{currentStep}</span>
            </div>

            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-emerald-500 transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-4 gap-2 text-center text-xs pt-1">
              <div className="p-2 bg-slate-900 rounded border border-slate-800">
                <span className="text-[10px] text-slate-500 block">FRAMES</span>
                <span className="font-bold text-white">{processedFrames}</span>
              </div>
              <div className="p-2 bg-slate-900 rounded border border-slate-800">
                <span className="text-[10px] text-slate-500 block">DETECTIONS</span>
                <span className="font-bold text-indigo-400">{detectionsCount}</span>
              </div>
              <div className="p-2 bg-slate-900 rounded border border-slate-800">
                <span className="text-[10px] text-slate-500 block">TRACKS</span>
                <span className="font-bold text-amber-400">{tracksCount}</span>
              </div>
              <div className="p-2 bg-slate-900 rounded border border-slate-800">
                <span className="text-[10px] text-slate-500 block">EMBEDDINGS</span>
                <span className="font-bold text-emerald-400">{embeddingsCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs font-mono text-slate-500">
            Worker Pool: Celery / Redis 7 • Device: CPU
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-mono transition-colors"
            >
              CLOSE
            </button>
            <button
              onClick={handleStartProcessing}
              disabled={isProcessing}
              className="px-5 py-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white rounded-lg text-xs font-mono font-bold flex items-center gap-2 shadow-lg disabled:opacity-50 transition-all"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>EXTRACTING & EMBEDDING...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>RUN INGESTION PIPELINE</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
