import React from 'react';
import { CheckCircle2, Loader2, ArrowRight, ShieldCheck, Database, Search, GitBranch, FileText, Cpu, AlertTriangle } from 'lucide-react';
import { LangGraphNodeStatus } from '../types/forensic';

interface LangGraphPipelineProps {
  nodes: LangGraphNodeStatus[];
  isRunning: boolean;
  agentLogs: string[];
}

export const LangGraphPipeline: React.FC<LangGraphPipelineProps> = ({
  nodes,
  isRunning,
  agentLogs
}) => {
  const getNodeIcon = (id: string) => {
    switch (id) {
      case 'query_analyzer':
        return <Cpu className="w-3.5 h-3.5 text-cyan-400" />;
      case 'temporal_spatial_gate':
        return <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />;
      case 'hybrid_search':
        return <Search className="w-3.5 h-3.5 text-blue-400" />;
      case 'trajectory_stitcher':
        return <GitBranch className="w-3.5 h-3.5 text-amber-400" />;
      case 'evidence_validator':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
      case 'timeline_generator':
        return <Database className="w-3.5 h-3.5 text-purple-400" />;
      case 'forensic_report_generator':
        return <FileText className="w-3.5 h-3.5 text-rose-400" />;
      default:
        return <Cpu className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></div>
          <h3 className="text-xs font-mono font-bold text-slate-200 tracking-wider">
            LANGGRAPH FORENSIC AGENT PIPELINE [STATE GRAPH]
          </h3>
        </div>
        <div className="text-[11px] font-mono text-slate-400">
          NODES: <strong className="text-cyan-400">7/7 COMPILED</strong> | DETERMINISTIC STATE MACHINE
        </div>
      </div>

      {/* Interactive Node Graph Sequence */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
        {nodes.map((node, index) => {
          const isComplete = node.status === 'completed';
          const isCurrent = node.status === 'running';

          return (
            <div
              key={node.id}
              className={`p-2.5 rounded-lg border flex flex-col justify-between transition-all relative ${
                isComplete
                  ? 'bg-slate-950/80 border-cyan-500/40 shadow-sm shadow-cyan-900/20'
                  : isCurrent
                  ? 'bg-cyan-950/40 border-cyan-400 animate-pulse'
                  : 'bg-slate-950/40 border-slate-800 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="p-1 rounded bg-slate-900 border border-slate-800">
                    {getNodeIcon(node.id)}
                  </div>
                  {isComplete ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : isCurrent ? (
                    <Loader2 className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                  ) : (
                    <span className="text-[10px] font-mono text-slate-600">IDLE</span>
                  )}
                </div>

                <div className="text-[11px] font-bold text-slate-200 leading-tight">
                  {node.name}
                </div>
                <div className="text-[9px] text-slate-400 mt-1 line-clamp-2">
                  {node.description}
                </div>
              </div>

              {node.outputSummary && (
                <div className="mt-2 pt-1.5 border-t border-slate-800/80 text-[10px] font-mono text-cyan-300 truncate">
                  {node.outputSummary}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Real-time Agent Execution Log Console */}
      <div className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 flex flex-col gap-1 max-h-24 overflow-y-auto font-mono text-[10px]">
        <div className="text-slate-500 font-bold border-b border-slate-800 pb-1 flex items-center justify-between">
          <span>FORENSIC AGENT REAL-TIME REASONING AUDIT LOG</span>
          <span className="text-emerald-400">CHAIN OF REASONING PERSISTED</span>
        </div>
        {agentLogs.length === 0 ? (
          <div className="text-slate-600 italic">No active query execution. Ready for query.</div>
        ) : (
          agentLogs.map((log, idx) => (
            <div key={idx} className="text-slate-300">
              <span className="text-slate-600 mr-2">{new Date().toISOString().slice(11, 19)}</span>
              {log.includes('WARNING') ? (
                <span className="text-amber-400 font-semibold">{log}</span>
              ) : log.includes('Extracted') ? (
                <span className="text-cyan-300">{log}</span>
              ) : log.includes('Validation') ? (
                <span className="text-emerald-300 font-semibold">{log}</span>
              ) : (
                <span>{log}</span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
