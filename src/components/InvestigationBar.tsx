import React, { useState } from 'react';
import { Search, Sparkles, Filter, Clock, MapPin, Tag } from 'lucide-react';

interface InvestigationBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
  activeQuery: string;
}

export const PRESET_QUERIES = [
  "Find the blue sedan near Gate 1 after 15:00 and track its movement until exit.",
  "Track person wearing dark hoodie carrying black backpack near Perimeter.",
  "Locate red SUV departing via Exit Gate."
];

export const InvestigationBar: React.FC<InvestigationBarProps> = ({
  onSearch,
  isLoading,
  activeQuery
}) => {
  const [queryInput, setQueryInput] = useState<string>(activeQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (queryInput.trim()) {
      onSearch(queryInput.trim());
    }
  };

  const handleSelectPreset = (preset: string) => {
    setQueryInput(preset);
    onSearch(preset);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl flex flex-col gap-3">
      {/* Title & Pipeline Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-cyan-950 text-cyan-400 rounded-lg border border-cyan-800/80">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white tracking-wide flex items-center gap-2">
              NATURAL LANGUAGE FORENSIC INVESTIGATION
              <span className="text-[10px] bg-slate-800 text-slate-400 font-mono px-2 py-0.5 rounded border border-slate-700">
                LANGGRAPH + CLIP + QDRANT
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Pose arbitrary situational queries. The system extracts entities, executes hybrid temporal/spatial vector search, and verifies trajectories.
            </p>
          </div>
        </div>

        {/* Anti-Hallucination Badge */}
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-md border border-emerald-800/80">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          ANTI-HALLUCINATION RIGOR ENFORCED
        </div>
      </div>

      {/* Main Search Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <Search className="w-4 h-4 text-cyan-400" />
          </div>
          <input
            type="text"
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            placeholder="e.g. Find the blue sedan near Gate 1 after 15:00 and track its movement until exit..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !queryInput.trim()}
          className="px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs rounded-lg shadow-lg shadow-cyan-900/40 flex items-center gap-2 disabled:opacity-50 transition-all font-mono"
        >
          {isLoading ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>REASONING...</span>
            </>
          ) : (
            <>
              <Search className="w-3.5 h-3.5" />
              <span>INVESTIGATE</span>
            </>
          )}
        </button>
      </form>

      {/* Quick Preset Queries */}
      <div className="flex items-center gap-2 flex-wrap text-xs">
        <span className="text-slate-500 font-mono text-[11px] flex items-center gap-1">
          <Filter className="w-3 h-3" /> Quick Cases:
        </span>
        {PRESET_QUERIES.map((preset, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSelectPreset(preset)}
            className="bg-slate-950/70 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/40 px-2.5 py-1 rounded-md text-[11px] font-mono transition-all text-left"
          >
            {preset}
          </button>
        ))}
      </div>
    </div>
  );
};
