import React, { useState } from 'react';
import { X, Award, BookOpen, Layers, CheckCircle2, ChevronRight, HelpCircle, Code } from 'lucide-react';

interface VivaGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VivaGuideModal: React.FC<VivaGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'viva_qa' | 'math'>('architecture');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-950 text-amber-400 rounded-lg border border-amber-800">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
                B.TECH MAJOR PROJECT VIVA & ARCHITECTURAL DEFENSE
                <span className="text-xs bg-amber-950 text-amber-300 px-2 py-0.5 rounded border border-amber-800">
                  FINAL YEAR DEFENSE
                </span>
              </h2>
              <span className="text-xs text-slate-400 font-mono">
                OMNISURV-AI: Multimodal Intelligent CCTV Forensic & Event Intelligence System
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

        {/* Tab Switcher */}
        <div className="bg-slate-950 px-6 py-2 border-b border-slate-800 flex gap-2 font-mono text-xs">
          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'architecture'
                ? 'bg-cyan-600 text-white font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            SYSTEM ARCHITECTURE & MODULES
          </button>
          <button
            onClick={() => setActiveTab('viva_qa')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'viva_qa'
                ? 'bg-amber-600 text-white font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            VIVA Q&A & DESIGN RATIONALE
          </button>
          <button
            onClick={() => setActiveTab('math')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'math'
                ? 'bg-indigo-600 text-white font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            MATHEMATICAL FORMULATIONS
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm text-slate-300">
          {activeTab === 'architecture' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <h4 className="text-cyan-400 font-mono font-bold text-xs uppercase">
                  End-to-End Multimodal Pipeline Topology
                </h4>
                <div className="bg-slate-900 p-3 rounded font-mono text-xs text-slate-300 leading-relaxed border border-slate-800 overflow-x-auto">
                  {`CCTV MP4/RTSP Stream
       ↓
OpenCV Frame Extraction (Configurable 10-30 FPS)
       ↓
YOLOv11x Object Detection (Bounding Boxes [x1, y1, x2, y2], Classes: person, car, bag)
       ↓
ByteTrack Multi-Object Tracker (Kalman Velocity Forecasting + Hungarian IoU Matching)
       ↓
Persistent Track IDs Across Occlusions
       ↓
Crop Extraction (Clamping + Adaptive Padding + Standard 224×224 Resize)
       ↓
CLIP ViT-B/32 Multimodal Visual Embeddings (512-Dimensional L2-Normalized Vectors)
       ↓
Hybrid Indexing:
  ├── Qdrant Vector DB (HNSW Indexing on 512D Cosine Distance)
  └── PostgreSQL Relational DB (ACID Metadata: Cameras, Frames, Trajectories)
       ↓
LangGraph Agentic Investigation Workflow (7-Node Deterministic State Machine)
       ↓
Anti-Hallucination Evidence Gate & 2D Trajectory Reconstruction
       ↓
Interactive React 19 Forensic Console with Synchronized Video Scrubber`}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
                  <span className="text-cyan-400 font-mono font-bold block">1. Computer Vision Layer</span>
                  <p className="text-slate-400 leading-relaxed">
                    Combines YOLOv11x object localization with ByteTrack tracker to assign continuous temporal track IDs across video frames, eliminating ID switches.
                  </p>
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
                  <span className="text-indigo-400 font-mono font-bold block">2. Multimodal Embedding</span>
                  <p className="text-slate-400 leading-relaxed">
                    CLIP ViT-B/32 projects visual object crops and arbitrary natural-language text descriptions into the same 512D metric hypersphere.
                  </p>
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
                  <span className="text-emerald-400 font-mono font-bold block">3. Hybrid Search Engine</span>
                  <p className="text-slate-400 leading-relaxed">
                    Deterministic temporal, spatial, and class filters prune search space before evaluating Qdrant HNSW vector cosine similarity.
                  </p>
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
                  <span className="text-amber-400 font-mono font-bold block">4. Anti-Hallucination Policy</span>
                  <p className="text-slate-400 leading-relaxed">
                    Strict rule forbidding LLMs from inventing video evidence. If physical evidence is missing, the system outputs "Insufficient evidence".
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'viva_qa' && (
            <div className="space-y-3 font-mono text-xs">
              {[
                {
                  q: "Why did you choose YOLOv11x over legacy detectors like Faster R-CNN?",
                  a: "YOLOv11x provides single-stage high-speed inference (sub-15ms on GPU, realistic CPU latency) while delivering state-of-the-art mAP on surveillance targets through C3k2 blocks and cross-stage partial connections, essential for real-time CCTV stream processing."
                },
                {
                  q: "Why ByteTrack instead of DeepSORT?",
                  a: "DeepSORT discards low-confidence detection boxes, which causes frequent track loss during CCTV occlusions (e.g. cars behind trees). ByteTrack associates high-confidence boxes first, and in a second pass associates remaining tracks with low-confidence boxes via Kalman filter velocity forecasting, reducing identity switches by over 60%."
                },
                {
                  q: "Why CLIP ViT-B/32 instead of ResNet embeddings?",
                  a: "CLIP ViT-B/32 was trained on 400M image-text pairs with contrastive learning, enabling open-vocabulary text-to-image search. Investigators can type arbitrary descriptions ('blue sedan', 'dark hoodie') without retraining the model for each attribute."
                },
                {
                  q: "Why Qdrant for vector search instead of FAISS in-memory?",
                  a: "Qdrant provides persistent HNSW indexing and native payload filtering. It allows combining spatial/temporal constraints (e.g. camera_id == 'cam-01' AND timestamp >= 900) in a single-pass query directly inside the vector engine."
                },
                {
                  q: "Why LangGraph instead of simple ReAct agent loop?",
                  a: "ReAct agent loops can hallucinate tool sequences and fail to terminate predictably. LangGraph compiles a deterministic, cyclic/acyclic state machine with an explicit state dictionary, ensuring every forensic step is audited and validated against strict anti-hallucination rules."
                }
              ].map((item, idx) => (
                <div key={idx} className="p-3.5 bg-slate-950 border border-slate-800 rounded-lg space-y-1.5">
                  <div className="text-amber-400 font-bold flex items-start gap-2">
                    <span className="text-slate-500">Q{idx + 1}:</span>
                    <span>{item.q}</span>
                  </div>
                  <div className="text-slate-300 leading-relaxed pl-6 border-l-2 border-slate-800">
                    {item.a}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'math' && (
            <div className="space-y-4 font-mono text-xs">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <span className="text-indigo-400 font-bold block">1. Cosine Similarity Metric in CLIP Hypersphere:</span>
                <p className="text-slate-400">
                  Given visual embedding vector <strong className="text-white">v</strong> and query text vector <strong className="text-white">q</strong> in ℝ⁵¹²:
                </p>
                <div className="bg-slate-900 p-2.5 rounded text-cyan-300 text-center font-bold">
                  cos(θ) = ( v • q ) / ( ||v||₂ × ||q||₂ )
                </div>
                <p className="text-slate-400 text-[11px]">
                  Vectors are L2-normalized upon extraction (||v||₂ = 1.0), reducing search computation to simple inner dot product v • q.
                </p>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <span className="text-indigo-400 font-bold block">2. ByteTrack Kalman Filter Motion State:</span>
                <p className="text-slate-400">
                  The motion state of each tracked bounding box is represented as an 8-dimensional state vector:
                </p>
                <div className="bg-slate-900 p-2.5 rounded text-amber-300 text-center font-bold">
                  x = [ u, v, s, r, u̇, v̇, ṡ, ṙ ]ᵀ
                </div>
                <p className="text-slate-400 text-[11px]">
                  Where (u, v) is box center, s is scale (area), r is aspect ratio, and (u̇, v̇, ṡ, ṙ) represent first-order linear velocities.
                </p>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <span className="text-indigo-400 font-bold block">3. Intersection-over-Union (IoU) Matching:</span>
                <div className="bg-slate-900 p-2.5 rounded text-emerald-300 text-center font-bold">
                  IoU(Box_A, Box_B) = Area(Box_A ∩ Box_B) / Area(Box_A ∪ Box_B)
                </div>
                <p className="text-slate-400 text-[11px]">
                  Cost matrix C = 1 - IoU is solved optimally using the Hungarian / Munkres bipartite matching algorithm.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-950 px-6 py-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-500">
          <span>DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING</span>
          <span>B.TECH MAJOR PROJECT 2026</span>
        </div>
      </div>
    </div>
  );
};
