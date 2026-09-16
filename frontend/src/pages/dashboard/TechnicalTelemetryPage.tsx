import React from 'react';
import { Database, Cpu, Sliders, CheckCircle } from 'lucide-react';

export const TechnicalTelemetryPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-white tracking-tight font-serif">Technical Control Center</h2>
        <p className="text-xs text-gray-400 font-serif">
          Monitor multi-agent execution pipeline, RAG vector retrieval latency, and model orchestrations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 rounded-md border border-[#142B1F] bg-[#040906] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-serif">Supabase pgvector</span>
            <Database className="w-4 h-4 text-[#00D084]" />
          </div>
          <div className="text-xl font-bold text-white font-mono">384-dim HNSW</div>
          <p className="text-[11px] text-gray-400 font-serif">Cosine similarity metric with pgvector extension enabled.</p>
        </div>

        <div className="p-5 rounded-md border border-[#142B1F] bg-[#040906] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-serif">LLM Fallback Topology</span>
            <Cpu className="w-4 h-4 text-[#00D084]" />
          </div>
          <div className="text-xl font-bold text-white font-mono">Multi-Key Mesh</div>
          <p className="text-[11px] text-gray-400 font-serif">Autonomous retry with rate-limit evasion and timeout management.</p>
        </div>

        <div className="p-5 rounded-md border border-[#142B1F] bg-[#040906] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-serif">Average Synthesis Latency</span>
            <Sliders className="w-4 h-4 text-[#00D084]" />
          </div>
          <div className="text-xl font-bold text-white font-mono">1.82s</div>
          <p className="text-[11px] text-gray-400 font-serif">Zero-shot multi-agent document chunking & synthesis.</p>
        </div>
      </div>

      {/* Technical Diagnostics */}
      <div className="p-6 rounded-md border border-[#142B1F] bg-[#040906] space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 font-serif">
          <CheckCircle className="w-4 h-4 text-[#00D084]" />
          Pipeline Engine Diagnostics:
        </h3>
        <div className="space-y-2 text-xs font-mono text-gray-300">
          <div className="p-2.5 rounded-sm bg-[#06110A] border border-[#142B1F] flex justify-between">
            <span>FastAPI Uvicorn Runtime</span>
            <span className="text-[#00D084]">PORT 8000 · HEALTHY</span>
          </div>
          <div className="p-2.5 rounded-sm bg-[#06110A] border border-[#142B1F] flex justify-between">
            <span>SSE Live Event Streaming Protocol</span>
            <span className="text-[#00D084]">ENABLED · BUFFER 1024</span>
          </div>
          <div className="p-2.5 rounded-sm bg-[#06110A] border border-[#142B1F] flex justify-between">
            <span>Deliverable Revision & Versioning Modal</span>
            <span className="text-[#00D084]">ACTIVE · POPUP LOOP READY</span>
          </div>
        </div>
      </div>
    </div>
  );
};
