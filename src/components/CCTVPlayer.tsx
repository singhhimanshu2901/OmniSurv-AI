import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, RotateCcw, RotateCw, Maximize2, Shield, Eye, Video, ZoomIn, ZoomOut, Crosshair } from 'lucide-react';
import { Camera, EvidenceItem } from '../types/forensic';

interface CCTVPlayerProps {
  currentCamera: Camera;
  onCameraChange: (camera: Camera) => void;
  cameras: Camera[];
  currentTime: number; // in seconds relative to 15:00:00 (e.g., 441 = 15:07:21)
  onTimeChange: (time: number) => void;
  selectedTrackId: number | null;
  onSelectTrack: (trackId: number | null) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  activeEvidence: EvidenceItem | null;
}

export const CCTVPlayer: React.FC<CCTVPlayerProps> = ({
  currentCamera,
  onCameraChange,
  cameras,
  currentTime,
  onTimeChange,
  selectedTrackId,
  onSelectTrack,
  isPlaying,
  onTogglePlay,
  activeEvidence
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [showOverlays, setShowOverlays] = useState<boolean>(true);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [opticalFilter, setOpticalFilter] = useState<'standard' | 'night_vision' | 'high_contrast'>('standard');

  // Format current seconds to standard 15:MM:SS
  const formatTimeHUD = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    const ms = Math.floor((sec % 1) * 100);
    return `15:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  // Internal playback tick
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      onTimeChange(Math.min(900, currentTime + (0.1 * playbackSpeed)));
    }, 100);
    return () => clearInterval(interval);
  }, [isPlaying, currentTime, playbackSpeed, onTimeChange]);

  // Canvas CCTV Surveillance Renderer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    ctx.save();

    // Optical filters
    if (opticalFilter === 'night_vision') {
      ctx.fillStyle = '#051808';
    } else if (opticalFilter === 'high_contrast') {
      ctx.fillStyle = '#0c0f14';
    } else {
      ctx.fillStyle = '#11151c';
    }
    ctx.fillRect(0, 0, width, height);

    // Apply zoom transformation centered
    ctx.translate(width / 2, height / 2);
    ctx.scale(zoomLevel, zoomLevel);
    ctx.translate(-width / 2, -height / 2);

    // 1. Draw Environmental CCTV Scene based on Camera Location
    if (currentCamera.id === 'cam-01') {
      // Gate 1 North Entry: Asphalt road, security gate post, barrier arm, perimeter trees
      ctx.fillStyle = '#1a202c';
      ctx.beginPath();
      ctx.moveTo(120, height);
      ctx.lineTo(380, 240);
      ctx.lineTo(540, 240);
      ctx.lineTo(840, height);
      ctx.closePath();
      ctx.fill();

      // Road dividing stripes
      ctx.strokeStyle = '#e2e8f0';
      ctx.setLineDash([16, 12]);
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(480, height);
      ctx.lineTo(460, 240);
      ctx.stroke();
      ctx.setLineDash([]);

      // Security booth
      ctx.fillStyle = '#2d3748';
      ctx.fillRect(570, 220, 110, 140);
      ctx.fillStyle = '#63b3ed';
      ctx.fillRect(585, 235, 80, 50);

      // Gate 1 Boom Barrier
      ctx.strokeStyle = '#e53e3e';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(370, 310);
      ctx.lineTo(560, 310);
      ctx.stroke();

    } else if (currentCamera.id === 'cam-02') {
      // Parking Area B: Parking grid slots, road surface, curbs
      ctx.fillStyle = '#1c2230';
      ctx.fillRect(80, 180, width - 160, height - 240);

      // Parking lane markings
      ctx.strokeStyle = '#718096';
      ctx.lineWidth = 2;
      for (let i = 120; i < width - 150; i += 110) {
        ctx.strokeRect(i, 200, 90, 160);
        ctx.strokeRect(i, 400, 90, 160);
      }

      // Static parked vehicles
      ctx.fillStyle = '#4a5568';
      ctx.fillRect(240, 215, 70, 130);
      ctx.fillStyle = '#718096';
      ctx.fillRect(460, 215, 70, 130);
      ctx.fillStyle = '#2b6cb0';
      ctx.fillRect(680, 415, 70, 130);

    } else if (currentCamera.id === 'cam-03') {
      // Main Perimeter Corridor: Chain-link fence line, gravel path, floodlight posts
      ctx.fillStyle = '#171d28';
      ctx.fillRect(0, 0, width, height);

      // Gravel pathway
      ctx.fillStyle = '#283344';
      ctx.fillRect(80, 300, width - 160, 200);

      // Security fence lines
      ctx.strokeStyle = '#4a5568';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(80, 120);
      ctx.lineTo(width - 80, 120);
      ctx.moveTo(80, 280);
      ctx.lineTo(width - 80, 280);
      ctx.stroke();

      // Mesh crisscross pattern
      ctx.strokeStyle = 'rgba(74, 85, 104, 0.35)';
      ctx.lineWidth = 1;
      for (let x = 80; x < width - 80; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 120);
        ctx.lineTo(x + 20, 280);
        ctx.stroke();
      }

    } else {
      // Camera 04: Exit Gate & Loading Dock
      ctx.fillStyle = '#161b26';
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = '#212936';
      ctx.fillRect(140, 160, 680, 440);

      // Exit arrows
      ctx.fillStyle = '#ed8936';
      ctx.beginPath();
      ctx.moveTo(480, 480);
      ctx.lineTo(440, 520);
      ctx.lineTo(465, 520);
      ctx.lineTo(465, 560);
      ctx.lineTo(495, 560);
      ctx.lineTo(495, 520);
      ctx.lineTo(520, 520);
      ctx.closePath();
      ctx.fill();
    }

    // 2. Render Dynamic Objects according to Current Time HUD & Camera
    // Target Track #42 (Blue Sedan): Visible in Cam 1 (440s - 520s), Cam 2 (570s - 720s), Cam 4 (780s - 860s)
    let t42_visible = false;
    let t42_x = 0;
    let t42_y = 0;
    let t42_w = 140;
    let t42_h = 75;

    if (currentCamera.id === 'cam-01' && currentTime >= 430 && currentTime <= 530) {
      t42_visible = true;
      const progress = (currentTime - 430) / 100;
      t42_x = 220 + progress * 320;
      t42_y = 260 + progress * 240;
      t42_w = 90 + progress * 70;
      t42_h = 50 + progress * 40;
    } else if (currentCamera.id === 'cam-02' && currentTime >= 570 && currentTime <= 730) {
      t42_visible = true;
      const progress = (currentTime - 570) / 160;
      t42_x = 180 + progress * 460;
      t42_y = 380 - Math.sin(progress * Math.PI) * 40;
      t42_w = 135;
      t42_h = 70;
    } else if (currentCamera.id === 'cam-04' && currentTime >= 780 && currentTime <= 870) {
      t42_visible = true;
      const progress = (currentTime - 780) / 90;
      t42_x = 260 + progress * 400;
      t42_y = 340 - progress * 100;
      t42_w = 130 - progress * 30;
      t42_h = 70 - progress * 15;
    }

    // Draw Blue Sedan Track #42
    if (t42_visible) {
      // Body
      ctx.fillStyle = '#1e3a8a'; // Deep blue
      ctx.beginPath();
      ctx.roundRect(t42_x, t42_y, t42_w, t42_h, 8);
      ctx.fill();

      // Cabin roof
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.roundRect(t42_x + t42_w * 0.2, t42_y + t42_h * 0.15, t42_w * 0.55, t42_h * 0.7, 4);
      ctx.fill();

      // Headlights / taillights
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(t42_x + t42_w - 6, t42_y + 8, 5, 12);
      ctx.fillRect(t42_x + t42_w - 6, t42_y + t42_h - 20, 5, 12);

      // Wheels
      ctx.fillStyle = '#000000';
      ctx.fillRect(t42_x + 14, t42_y - 4, 20, 6);
      ctx.fillRect(t42_x + t42_w - 34, t42_y - 4, 20, 6);
      ctx.fillRect(t42_x + 14, t42_y + t42_h - 2, 20, 6);
      ctx.fillRect(t42_x + t42_w - 34, t42_y + t42_h - 2, 20, 6);

      // Bounding Box Overlay
      if (showOverlays) {
        const isSelected = selectedTrackId === 42;
        ctx.strokeStyle = isSelected ? '#00f0ff' : '#38bdf8';
        ctx.lineWidth = isSelected ? 3 : 2;
        ctx.strokeRect(t42_x - 6, t42_y - 8, t42_w + 12, t42_h + 16);

        // Reticle corners if selected
        if (isSelected) {
          ctx.strokeStyle = '#00f0ff';
          ctx.lineWidth = 4;
          const cornerLen = 14;
          const bx = t42_x - 6;
          const by = t42_y - 8;
          const bw = t42_w + 12;
          const bh = t42_h + 16;
          // Top-left
          ctx.beginPath(); ctx.moveTo(bx, by + cornerLen); ctx.lineTo(bx, by); ctx.lineTo(bx + cornerLen, by); ctx.stroke();
          // Top-right
          ctx.beginPath(); ctx.moveTo(bx + bw - cornerLen, by); ctx.lineTo(bx + bw, by); ctx.lineTo(bx + bw, by + cornerLen); ctx.stroke();
          // Bottom-left
          ctx.beginPath(); ctx.moveTo(bx, by + bh - cornerLen); ctx.lineTo(bx, by + bh); ctx.lineTo(bx + cornerLen, by + bh); ctx.stroke();
          // Bottom-right
          ctx.beginPath(); ctx.moveTo(bx + bw - cornerLen, by + bh); ctx.lineTo(bx + bw, by + bh); ctx.lineTo(bx + bw, by + bh - cornerLen); ctx.stroke();
        }

        // Tag badge
        ctx.fillStyle = isSelected ? 'rgba(0, 240, 255, 0.95)' : 'rgba(14, 165, 233, 0.85)';
        ctx.fillRect(t42_x - 6, t42_y - 32, 160, 22);
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 11px monospace';
        ctx.fillText(`ID:42 CAR 94% [TARGET]`, t42_x - 2, t42_y - 17);
      }
    }

    // Pedestrian Track #19 & Bag #55 on Camera 03 (300s - 450s)
    if (currentCamera.id === 'cam-03' && currentTime >= 300 && currentTime <= 450) {
      const p_prog = (currentTime - 300) / 150;
      const px = 180 + p_prog * 480;
      const py = 330;

      // Draw walking person
      ctx.fillStyle = '#1e293b'; // Dark jacket
      ctx.fillRect(px, py - 40, 26, 50);
      // Head
      ctx.fillStyle = '#fed7aa';
      ctx.beginPath();
      ctx.arc(px + 13, py - 52, 10, 0, Math.PI * 2);
      ctx.fill();
      // Legs
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(px + 3, py + 10, 8, 30);
      ctx.fillRect(px + 15, py + 10, 8, 30);
      // Backpack (Track #55)
      ctx.fillStyle = '#000000';
      ctx.fillRect(px - 10, py - 35, 12, 24);

      if (showOverlays) {
        const isSelectedPerson = selectedTrackId === 19;
        ctx.strokeStyle = isSelectedPerson ? '#10b981' : '#34d399';
        ctx.lineWidth = 2;
        ctx.strokeRect(px - 16, py - 66, 54, 110);

        ctx.fillStyle = 'rgba(16, 185, 129, 0.9)';
        ctx.fillRect(px - 16, py - 86, 140, 18);
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 10px monospace';
        ctx.fillText(`ID:19 PERSON 91%`, px - 12, py - 73);

        // Backpack overlay
        ctx.strokeStyle = '#f59e0b';
        ctx.strokeRect(px - 12, py - 38, 16, 28);
        ctx.fillStyle = 'rgba(245, 158, 11, 0.9)';
        ctx.fillRect(px - 12, py - 52, 100, 14);
        ctx.fillStyle = '#000000';
        ctx.fillText(`ID:55 BAG 88%`, px - 10, py - 42);
      }
    }

    // 3. Scanline & Sensor Grain FX
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
    ctx.lineWidth = 1;
    for (let y = 0; y < height; y += 4) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Restore canvas matrix
    ctx.restore();

    // 4. CCTV HUD Display
    // Top-left: Camera Name, Status, Frame rate
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(14, 14, 380, 52);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.strokeRect(14, 14, 380, 52);

    // Blinking REC dot
    const blink = Math.floor(Date.now() / 600) % 2 === 0;
    ctx.fillStyle = blink ? '#ef4444' : '#7f1d1d';
    ctx.beginPath();
    ctx.arc(28, 32, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px monospace';
    ctx.fillText(`REC ${currentCamera.name.toUpperCase()}`, 40, 35);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px monospace';
    ctx.fillText(`${currentCamera.resolution} | ${currentCamera.fps} FPS | ${currentCamera.bitrate || '4.2 Mbps'} | H.265`, 40, 52);

    // Top-right: Accurate Surveillance Timestamp
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(width - 250, 14, 236, 52);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.strokeRect(width - 250, 14, 236, 52);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 14px monospace';
    ctx.fillText(`2026-10-05 ${formatTimeHUD(currentTime)}`, width - 236, 36);
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '10px monospace';
    ctx.fillText(`ZONE: ${currentCamera.location.toUpperCase()} | SECURE`, width - 236, 52);

    // Crosshairs in center
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 20, height / 2);
    ctx.lineTo(width / 2 + 20, height / 2);
    ctx.moveTo(width / 2, height / 2 - 20);
    ctx.lineTo(width / 2, height / 2 + 20);
    ctx.stroke();

  }, [currentCamera, currentTime, selectedTrackId, showOverlays, zoomLevel, opticalFilter]);

  // Handle canvas click to select tracks
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    // For demo interactivity, clicking on canvas toggles track 42 selection
    if (selectedTrackId === 42) {
      onSelectTrack(null);
    } else {
      onSelectTrack(42);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col">
      {/* CCTV Monitor Header & Camera Switcher */}
      <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-800/60">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            LIVE OPTICAL MATRIX
          </div>
          <span className="text-xs text-slate-400 font-mono">
            FEED: <strong className="text-slate-200">{currentCamera.name}</strong>
          </span>
        </div>

        {/* Multi-camera selector buttons */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-lg border border-slate-800">
          {cameras.map((cam) => {
            const isActive = cam.id === currentCamera.id;
            return (
              <button
                key={cam.id}
                onClick={() => onCameraChange(cam)}
                className={`px-2.5 py-1 text-xs font-mono rounded transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-cyan-600 text-white font-bold shadow-md shadow-cyan-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Video className="w-3 h-3" />
                {cam.id.toUpperCase()}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main CCTV Surveillance Canvas */}
      <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden cursor-crosshair">
        <canvas
          ref={canvasRef}
          width={960}
          height={540}
          onClick={handleCanvasClick}
          className="w-full h-full object-contain"
        />

        {/* Target spotlight indicator if track selected */}
        {selectedTrackId && (
          <div className="absolute top-4 left-4 bg-cyan-950/90 border border-cyan-500 text-cyan-200 text-xs px-3 py-1.5 rounded-md backdrop-blur-md flex items-center gap-2 shadow-lg">
            <Crosshair className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
            <span>TRACKING LOCK: <strong>#{selectedTrackId}</strong> (CLICK TARGET TO TOGGLE)</span>
          </div>
        )}

        {/* Optical Sensor Filter switcher badge */}
        <div className="absolute bottom-4 right-4 flex items-center gap-1 bg-slate-950/80 p-1 rounded-lg border border-slate-800 text-[10px] font-mono text-slate-300">
          <button
            onClick={() => setOpticalFilter('standard')}
            className={`px-2 py-0.5 rounded ${opticalFilter === 'standard' ? 'bg-slate-700 text-white' : 'hover:bg-slate-800'}`}
          >
            RGB
          </button>
          <button
            onClick={() => setOpticalFilter('night_vision')}
            className={`px-2 py-0.5 rounded ${opticalFilter === 'night_vision' ? 'bg-emerald-900 text-emerald-300' : 'hover:bg-slate-800'}`}
          >
            NV-IR
          </button>
          <button
            onClick={() => setOpticalFilter('high_contrast')}
            className={`px-2 py-0.5 rounded ${opticalFilter === 'high_contrast' ? 'bg-cyan-950 text-cyan-300' : 'hover:bg-slate-800'}`}
          >
            ENHANCED
          </button>
        </div>
      </div>

      {/* Forensic Timeline Scrubber & HUD Controls */}
      <div className="bg-slate-950 p-3.5 border-t border-slate-800 flex flex-col gap-2.5">
        {/* Scrubber slider */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-cyan-400 font-bold w-20">
            {formatTimeHUD(currentTime).slice(0, 8)}
          </span>
          <div className="relative flex-1">
            <input
              type="range"
              min={300}
              max={900}
              step={0.5}
              value={currentTime}
              onChange={(e) => onTimeChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
            />
            {/* Markers for key forensic evidence */}
            <div
              className="absolute top-0 w-2 h-2 bg-cyan-400 rounded-full -mt-0.5 transform -translate-x-1/2 pointer-events-none"
              style={{ left: `${((441 - 300) / 600) * 100}%` }}
              title="15:07:21 Gate 1 Entry"
            />
            <div
              className="absolute top-0 w-2 h-2 bg-amber-400 rounded-full -mt-0.5 transform -translate-x-1/2 pointer-events-none"
              style={{ left: `${((583 - 300) / 600) * 100}%` }}
              title="15:09:43 Parking Bay"
            />
            <div
              className="absolute top-0 w-2 h-2 bg-emerald-400 rounded-full -mt-0.5 transform -translate-x-1/2 pointer-events-none"
              style={{ left: `${((842 - 300) / 600) * 100}%` }}
              title="15:14:02 Exit Gate"
            />
          </div>
          <span className="text-xs font-mono text-slate-500 w-16 text-right">
            15:15:00
          </span>
        </div>

        {/* Playback Controls & Utility Actions */}
        <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={onTogglePlay}
              className={`p-2 rounded-lg font-medium flex items-center gap-1.5 transition-all ${
                isPlaying
                  ? 'bg-amber-600 hover:bg-amber-500 text-white'
                  : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-600/30'
              }`}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
            </button>

            <button
              onClick={() => onTimeChange(Math.max(300, currentTime - 5))}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg flex items-center gap-1"
              title="Step back 5 seconds"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>-5s</span>
            </button>

            <button
              onClick={() => onTimeChange(Math.min(900, currentTime + 5))}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg flex items-center gap-1"
              title="Step forward 5 seconds"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>+5s</span>
            </button>

            {/* Playback speed selector */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
              {[0.5, 1, 2, 4].map((spd) => (
                <button
                  key={spd}
                  onClick={() => setPlaybackSpeed(spd)}
                  className={`px-2 py-1 rounded text-[11px] font-mono ${
                    playbackSpeed === spd
                      ? 'bg-slate-700 text-white font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Toggle Bounding Boxes */}
            <button
              onClick={() => setShowOverlays(!showOverlays)}
              className={`px-2.5 py-1.5 rounded-lg border font-mono flex items-center gap-1.5 transition-all ${
                showOverlays
                  ? 'bg-slate-800 border-cyan-500/50 text-cyan-300'
                  : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>OVERLAYS {showOverlays ? 'ON' : 'OFF'}</span>
            </button>

            {/* Zoom Controls */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1 gap-1">
              <button
                onClick={() => setZoomLevel(Math.max(1, zoomLevel - 0.25))}
                className="p-1 text-slate-400 hover:text-white"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-mono text-slate-300 px-1">
                {zoomLevel.toFixed(2)}x
              </span>
              <button
                onClick={() => setZoomLevel(Math.min(2.5, zoomLevel + 0.25))}
                className="p-1 text-slate-400 hover:text-white"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
