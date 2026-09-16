import React from 'react';
import { Layers, Database, Cpu, ShieldCheck } from 'lucide-react';

export const CapabilitiesSection: React.FC = () => {
  return (
    <section
      id="capabilities"
      className="py-24 bg-[#020503] border-b border-[#142B1F] relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-[#00D084]/10 border border-[#00D084]/20 text-[#00D084] text-xs font-serif">
            <span>SYSTEM ARCHITECTURE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-serif">
            Engineered for Enterprise Multi-Modal Intelligence
          </h2>
          <p className="text-base text-gray-400 font-serif leading-relaxed">
            Avyra replaces fragmented generative tools with an autonomous, zero-trust content pipeline. Ingest unstructured documentation, cross-reference proprietary knowledge bases, and synthesize precision collateral.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 font-serif">
          {[
            {
              icon: Layers,
              title: 'Multi-Modal Ingestion',
              desc: 'Deep extraction across PDF contracts, DOCX technical papers, spreadsheets, and slides with automated layout awareness.',
            },
            {
              icon: Database,
              title: 'Supabase Vector RAG',
              desc: 'Dense vector embeddings stored with HNSW indexing to guarantee mathematical factuality and zero hallucinations.',
            },
            {
              icon: Cpu,
              title: 'Parallel Agent Mesh',
              desc: 'Specialized autonomous models concurrently distill strategy briefs, executive decks, and targeted social campaigns.',
            },
            {
              icon: ShieldCheck,
              title: 'Strict Role Isolation',
              desc: 'Role-Based Access Control segregating Super Admin authority, Technical Lead telemetry, and PR campaign managers.',
            },
          ].map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={i}
                className="rounded-md border border-[#142B1F] bg-[#071510] p-6 space-y-4 hover:border-[#00D084]/40 transition-colors group"
              >
                <div className="w-10 h-10 rounded-sm bg-[#00D084]/10 border border-[#00D084]/20 flex items-center justify-center text-[#00D084] group-hover:scale-105 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white font-serif tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed font-serif">
                  {feature.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Workflow Matrix Steps */}
        <div className="mt-16 p-8 rounded-md border border-[#142B1F] bg-[#051310] font-serif">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-300 mb-6">
            Autonomous Synthesis Lifecycle:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: 'Ingest & Chunk',
                detail: 'Multi-format files parsed into normalized semantic chunks with 384-dimensional vector indexing.',
              },
              {
                step: '02',
                title: 'Retrieve & Reason',
                detail: 'Cosine similarity ranking retrieves verified facts to steer multi-agent generation models.',
              },
              {
                step: '03',
                title: 'Synthesize & Revise',
                detail: 'Instant deliverable generation with interactive popup revision loops and export pipelines.',
              },
            ].map((s, idx) => (
              <div key={idx} className="space-y-2 border-l-2 border-[#142B1F] pl-4">
                <span className="text-xs font-mono text-[#00D084] font-bold">{s.step}</span>
                <h4 className="text-sm font-bold text-white">{s.title}</h4>
                <p className="text-xs text-gray-400 leading-relaxed">{s.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
