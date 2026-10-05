import React, { useState } from 'react';
import { X, Copy, Download, Printer, Check, ShieldCheck, AlertTriangle, FileText } from 'lucide-react';
import { ForensicReport } from '../types/forensic';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: ForensicReport;
}

export const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, report }) => {
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    const text = JSON.stringify(report, null, 2);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${report.caseId}_FORENSIC_REPORT.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-950 text-cyan-400 rounded-lg border border-cyan-800">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
                OFFICIAL CCTV FORENSIC INCIDENT REPORT
                <span className="text-xs bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800">
                  {report.status}
                </span>
              </h2>
              <span className="text-xs text-slate-400 font-mono">
                CASE ID: <strong>{report.caseId}</strong> • GENERATED: {new Date(report.generatedAt).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg flex items-center gap-1.5 text-xs font-mono transition-colors"
              title="Copy JSON"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'COPIED' : 'COPY JSON'}</span>
            </button>

            <button
              onClick={handleDownloadJSON}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg flex items-center gap-1.5 text-xs font-mono transition-colors"
              title="Download JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span>EXPORT</span>
            </button>

            <button
              onClick={handlePrint}
              className="p-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg flex items-center gap-1.5 text-xs font-mono transition-colors"
              title="Print Report"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>PRINT</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-300 text-sm">
          {/* Query & Executive Summary */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
            <div>
              <span className="text-[11px] font-mono text-cyan-400 font-bold block mb-1">
                ORIGINAL INVESTIGATION QUERY
              </span>
              <p className="text-sm font-semibold text-white bg-slate-900/80 p-2.5 rounded border border-slate-800 font-mono">
                "{report.investigationQuery}"
              </p>
            </div>

            <div>
              <span className="text-[11px] font-mono text-slate-400 font-bold block mb-1">
                EXECUTIVE FINDINGS SUMMARY
              </span>
              <p className="text-sm text-slate-300 leading-relaxed">
                {report.executiveSummary}
              </p>
            </div>
          </div>

          {/* Confidence Assessment Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
              <span className="text-[11px] text-slate-400 block">OVERALL CONFIDENCE</span>
              <span className="text-xl font-bold text-emerald-400">
                {(report.confidenceAssessment.overallConfidence * 100).toFixed(1)}%
              </span>
              <span className="text-[10px] text-slate-500 block mt-1">EVIDENCE GROUNDED</span>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
              <span className="text-[11px] text-slate-400 block">CLIP COSINE SIMILARITY</span>
              <span className="text-xl font-bold text-cyan-400">
                {report.confidenceAssessment.clipCosineSimilarity.toFixed(3)}
              </span>
              <span className="text-[10px] text-slate-500 block mt-1">512D ViT-B/32 VECTOR</span>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
              <span className="text-[11px] text-slate-400 block">YOLOv11x DETECTION AP</span>
              <span className="text-xl font-bold text-indigo-400">
                {(report.confidenceAssessment.yoloDetectionConfidence * 100).toFixed(1)}%
              </span>
              <span className="text-[10px] text-slate-500 block mt-1">IOU ASSOCIATED</span>
            </div>
          </div>

          {/* Chronological Evidence Table */}
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-slate-200 block">
              CHRONOLOGICAL FORENSIC TIMELINE
            </span>
            <div className="border border-slate-800 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">TIMESTAMP</th>
                    <th className="py-2.5 px-3">CAMERA / ZONE</th>
                    <th className="py-2.5 px-3">EVENT TYPE</th>
                    <th className="py-2.5 px-3">FINDINGS & ACTIONS</th>
                    <th className="py-2.5 px-3">CONF</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 bg-slate-900/60">
                  {report.timeline.map((evt) => (
                    <tr key={evt.id} className="hover:bg-slate-800/40">
                      <td className="py-2.5 px-3 text-cyan-300 font-bold">{evt.timeStr}</td>
                      <td className="py-2.5 px-3 text-slate-300">{evt.location} ({evt.cameraId})</td>
                      <td className="py-2.5 px-3">
                        <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] border border-slate-700">
                          {evt.eventType}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-300">{evt.description}</td>
                      <td className="py-2.5 px-3 text-emerald-400">{(evt.confidence * 100).toFixed(0)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Uncertainty & Anti-Hallucination Disclaimers */}
          <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2.5">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold">
              <AlertTriangle className="w-4 h-4" />
              <span>FORENSIC UNCERTAINTY & SENSOR LIMITATIONS STATEMENT</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-mono">
              {report.uncertaintyStatement}
            </p>
            <ul className="list-disc pl-5 text-xs text-slate-400 space-y-1">
              {report.limitations.map((lim, i) => (
                <li key={i}>{lim}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-950 px-6 py-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-500">
          <span>OMNISURV-AI FORENSIC REASONING ENGINE v1.0</span>
          <span>SIGNED: {report.investigator}</span>
        </div>
      </div>
    </div>
  );
};
