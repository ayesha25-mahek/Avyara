import React from 'react';
import { Layers, Database, Cpu, ShieldCheck, ArrowRight } from 'lucide-react';

export const CapabilitiesSection: React.FC = () => {
  return (
    <section
      id="capabilities"
      className="py-24 bg-[#0F261B] border-b border-[#1A402D] text-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16">
        {/* Header */}
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#163827] border border-[#23573E] text-[#74C69D] text-xs font-semibold tracking-wide">
            SYSTEM ARCHITECTURE
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight font-heading leading-tight text-white">
            Engineered for high-integrity autonomous synthesis.
          </h2>
          <p className="text-base text-[#B8D5C6] leading-relaxed">
            Avyra replaces fragmented single-prompt tools with an orchestrated pipeline that indexes proprietary source files, enforces grounding, and coordinates specialized generation models.
          </p>
        </div>

        {/* 4 Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Layers,
              title: 'Multi-Modal Ingestion',
              desc: 'Deep extraction across PDFs, Word documents, decks, and spreadsheets with semantic layout normalization.',
            },
            {
              icon: Database,
              title: 'Vector Knowledge Base',
              desc: 'Sub-second similarity retrieval across 384-dimensional embeddings stored directly in Supabase pgvector.',
            },
            {
              icon: Cpu,
              title: 'Autonomous Model Mesh',
              desc: 'Dedicated task routing across specialized LLMs for strategy, technical documentation, and social copy.',
            },
            {
              icon: ShieldCheck,
              title: 'Role-Based Guardrails',
              desc: 'Strict isolation separating Super Admin control, Technical Lead metrics, and PR campaign managers.',
            },
          ].map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={i}
                className="rounded-xl border border-[#1E4D36] bg-[#143324] p-6 space-y-4 hover:border-[#2D6E4E] transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-[#1B4330] border border-[#265E43] flex items-center justify-center text-[#74C69D]">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-white tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-xs text-[#9DC4B0] leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* 3 Step Pipeline Breakdown */}
        <div className="p-8 rounded-xl border border-[#1E4D36] bg-[#122E20]">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#74C69D] mb-6">
            Autonomous Pipeline Flow:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Ingest & Embed',
                detail: 'Unstructured source assets are chunked into standardized vectors with HNSW indexing for rapid retrieval.',
              },
              {
                step: '02',
                title: 'Ground & Synthesize',
                detail: 'Retrieved verified facts anchor prompt templates to prevent hallucination across all output models.',
              },
              {
                step: '03',
                title: 'Review & Revise',
                detail: 'Inspect deliverables in real-time popup previews and submit revision prompts for immediate re-synthesis.',
              },
            ].map((s, idx) => (
              <div key={idx} className="space-y-2.5 border-l border-[#245C3F] pl-5">
                <span className="text-xs font-mono text-[#74C69D] font-bold">{s.step}</span>
                <h4 className="text-sm font-semibold text-white">{s.title}</h4>
                <p className="text-xs text-[#9DC4B0] leading-relaxed">{s.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
