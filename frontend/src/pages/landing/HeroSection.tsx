import React from 'react';
import {
  ArrowRight, ShieldCheck, Lock, FileText, Database,
  Cpu, ChevronRight
} from 'lucide-react';
import { LineCanvasAnimation } from '@/components/LineCanvasAnimation';

interface HeroSectionProps {
  isAuthenticated: boolean;
  onPrimaryAction: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  isAuthenticated,
  onPrimaryAction,
}) => {
  return (
    <section
      id="overview"
      className="relative overflow-hidden bg-black border-b border-[#1a1a1a] min-h-[90vh] flex items-center"
    >
      {/* Subtle Canvas Line Animation */}
      <LineCanvasAnimation />

      {/* Ambient Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 lg:py-28 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Left Content (7 Cols) */}
          <div className="lg:col-span-7 space-y-6 relative pl-4 sm:pl-7 border-l-2 border-white/20">
            <div className="absolute -left-[2px] top-0 w-[2px] h-20 bg-[#00D084]" />

            {/* Main Headline */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15] font-serif">
                SOARing above the rest with{' '}
                <span className="font-agentic text-4xl sm:text-5xl lg:text-6xl">
                  Avyra
                </span>.
              </h1>
              <p className="text-base sm:text-lg text-gray-300 font-normal leading-relaxed max-w-xl font-serif">
                SANS independent review: <span className="text-white font-semibold">Avyra</span> autonomous multi-modal content synthesis, Supabase semantic vector grounding, and enterprise executive intelligence.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={onPrimaryAction}
                className="px-6 py-3 rounded-full bg-[#00D084] text-black font-bold text-sm tracking-tight hover:bg-[#05E594] transition-all font-serif flex items-center gap-2"
              >
                <span>{isAuthenticated ? 'Enter Avyra Studio' : 'Launch Workspace'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#capabilities"
                className="px-6 py-3 rounded-full border border-[#222] bg-[#0a0a0a] text-gray-300 hover:text-white hover:border-[#00D084]/40 transition-all text-sm font-serif flex items-center gap-2"
              >
                <span>Explore Capabilities</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </a>
            </div>

            {/* Security & Verification Pill */}
            <div className="flex items-center gap-4 text-xs font-serif text-gray-400 pt-2">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#00D084]" />
                <span>SOC-2 Certified Pipeline</span>
              </div>
              <span className="text-gray-700">|</span>
              <div className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-[#00D084]" />
                <span>Role-Based Supabase Access</span>
              </div>
            </div>
          </div>

          {/* Right Telemetry Matrix Card (5 Cols) */}
          <div className="lg:col-span-5">
            <div className="rounded-md border border-[#1a1a1a] bg-[#0a0a0a] p-6 space-y-5 font-serif">
              <div className="flex items-center justify-between border-b border-[#1a1a1a] pb-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-sm bg-[#00D084]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-white font-serif">
                    Neural Engine Status
                  </span>
                </div>
                <span className="text-[11px] font-mono text-[#00D084] bg-[#00D084]/10 px-2 py-0.5 rounded-sm border border-[#00D084]/20">
                  ONLINE · 99.98%
                </span>
              </div>

              <div className="space-y-3 font-serif">
                {[
                  { label: 'Ingestion Pipeline', val: 'Active (PDF, DOCX, PPTX)', icon: FileText },
                  { label: 'Semantic Grounding', val: 'Supabase pgvector HNSW (384-dim)', icon: Database },
                  { label: 'Agent Mesh', val: 'Autonomous Parallel Synthesis', icon: Cpu },
                  { label: 'Access Control', val: 'Enterprise Role Separation', icon: Lock },
                ].map((row, idx) => {
                  const Icon = row.icon;
                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 rounded-sm bg-[#111] border border-[#1a1a1a]"
                    >
                      <div className="flex items-center gap-2 text-xs text-gray-300">
                        <Icon className="w-3.5 h-3.5 text-[#00D084]" />
                        <span>{row.label}</span>
                      </div>
                      <span className="text-[11px] font-mono text-gray-400">
                        {row.val}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2">
                <button
                  onClick={onPrimaryAction}
                  className="w-full py-2.5 rounded-sm bg-[#111] hover:bg-[#00D084] text-[#00D084] hover:text-black border border-[#1a1a1a] font-bold text-xs font-serif transition-colors flex items-center justify-center gap-2"
                >
                  <span>{isAuthenticated ? 'Open Studio Workspace' : 'Sign In to Authorize'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
