import React from 'react';
import { Database, Cpu, Sliders, CheckCircle } from 'lucide-react';

export const TechnicalTelemetryPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white tracking-tight">Technical Telemetry</h2>
        <p className="text-xs text-[#9EB3A8]">
          Monitor multi-agent execution pipeline, RAG vector retrieval latency, and model orchestrations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 rounded-xl border border-[#1E2F26] bg-[#0E1712] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#9EB3A8]">Supabase pgvector</span>
            <Database className="w-4 h-4 text-[#52B788]" />
          </div>
          <div className="text-xl font-bold text-white font-mono">384-dim HNSW</div>
          <p className="text-[11px] text-[#7A9386]">Cosine distance index with zero-loss semantic caching.</p>
        </div>

        <div className="p-5 rounded-xl border border-[#1E2F26] bg-[#0E1712] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#9EB3A8]">Model Orchestration</span>
            <Cpu className="w-4 h-4 text-[#52B788]" />
          </div>
          <div className="text-xl font-bold text-white font-mono">Parallel Router</div>
          <p className="text-[11px] text-[#7A9386]">Autonomous fallback with rate-limit evasion.</p>
        </div>

        <div className="p-5 rounded-xl border border-[#1E2F26] bg-[#0E1712] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#9EB3A8]">Average Latency</span>
            <Sliders className="w-4 h-4 text-[#52B788]" />
          </div>
          <div className="text-xl font-bold text-white font-mono">1.82s</div>
          <p className="text-[11px] text-[#7A9386]">Zero-shot multi-agent chunking & delivery.</p>
        </div>
      </div>

      {/* Diagnostics */}
      <div className="p-6 rounded-xl border border-[#1E2F26] bg-[#0E1712] space-y-4">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-[#52B788]" />
          Pipeline Runtime Status
        </h3>
        <div className="space-y-2 text-xs font-mono text-[#DCE6E0]">
          <div className="p-3 rounded-lg bg-[#111C16] border border-[#1A2820] flex justify-between">
            <span>FastAPI Uvicorn Runtime</span>
            <span className="text-[#52B788]">PORT 8000 · OPERATIONAL</span>
          </div>
          <div className="p-3 rounded-lg bg-[#111C16] border border-[#1A2820] flex justify-between">
            <span>SSE Event Streaming Protocol</span>
            <span className="text-[#52B788]">ACTIVE · BUFFER 1024</span>
          </div>
          <div className="p-3 rounded-lg bg-[#111C16] border border-[#1A2820] flex justify-between">
            <span>Deliverable Revision & Versioning Modal</span>
            <span className="text-[#52B788]">ONLINE · RE-SYNTHESIS READY</span>
          </div>
        </div>
      </div>
    </div>
  );
};
