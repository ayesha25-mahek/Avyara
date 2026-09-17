import React from 'react';
import { ArrowRight, ShieldCheck, Lock, FileText, Database, Cpu, CheckCircle2, ChevronRight } from 'lucide-react';
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
      className="relative overflow-hidden bg-black border-b border-[#1A2820]"
      style={{ minHeight: '520px' }}
    >
      {/* Horizontal stripe lines — right-side only via canvas */}
      <LineCanvasAnimation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Left Column: pure black, text only */}
          <div className="lg:col-span-7 space-y-7">

            {/* Brand word — exact font & gradient colors from AGENTIC image 2 */}
            <div>
              <span
                className="block font-black italic leading-none select-none tracking-tighter uppercase"
                style={{
                  fontSize: 'clamp(72px, 12vw, 130px)',
                  fontFamily: '"Impact", "Arial Black", sans-serif',
                  background: 'linear-gradient(180deg, #4ADE80 0%, #22C55E 35%, #F59E0B 75%, #F97316 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  transform: 'skewX(-6deg)',
                }}
              >
                AVYRA
              </span>
            </div>

            {/* Main Headline — bold, dark-green background section feel from image 3 */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-bold text-white tracking-tight leading-[1.1]">
                Autonomous content<br />synthesis for<br />enterprise teams.
              </h1>

              {/* Subtitle in Times New Roman — "mathematical factuality" line */}
              <p
                className="text-base sm:text-lg text-[#9EB3A8] leading-relaxed max-w-xl"
                style={{ fontFamily: '"Times New Roman", Times, serif' }}
              >
                Avyra connects multi-modal document extraction with Supabase vector grounding to synthesize production-ready briefs, presentations, and campaigns with mathematical factuality.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onPrimaryAction}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-lg bg-[#00C070] hover:bg-[#00A85E] text-black transition-colors"
              >
                <span>{isAuthenticated ? 'Open Studio Workspace' : 'Get Started with Avyra'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#capabilities"
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold rounded-lg border border-[#2A3F33] text-[#9EB3A8] hover:text-white hover:border-[#3A5545] transition-colors"
              >
                <span>Platform Architecture</span>
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-6 pt-4 text-xs text-[#7A9386] border-t border-[#16231C]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#52B788]" />
                <span>SOC-2 Type II Certified</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#52B788]" />
                <span>Supabase Row-Level Security</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#52B788]" />
                <span>Zero-Data Retention Option</span>
              </div>
            </div>
          </div>

          {/* Right Column: Architectural Status Card */}
          <div className="lg:col-span-5">
            <div className="rounded-xl border border-[#1E2F26] bg-[#0E1712] p-6 space-y-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-[#1A2820] pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-[#52B788]" />
                  <span className="text-xs font-semibold text-white tracking-wide uppercase">
                    System Telemetry
                  </span>
                </div>
                <span className="text-[11px] font-mono text-[#52B788] bg-[#142E22] px-2.5 py-0.5 rounded border border-[#204A36]">
                  STATUS: OPERATIONAL
                </span>
              </div>

              {/* Telemetry Rows */}
              <div className="space-y-2.5">
                {[
                  { label: 'Document Ingestion', val: 'PDF, DOCX, PPTX (Active)', icon: FileText },
                  { label: 'Vector Database', val: 'Supabase pgvector (384-dim)', icon: Database },
                  { label: 'Autonomous Mesh', val: 'Parallel Agent Router (Online)', icon: Cpu },
                  { label: 'Role Separation', val: 'Admin, Tech, PR Leads (Enforced)', icon: Lock },
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-lg bg-[#111C16] border border-[#1A2820]"
                    >
                      <div className="flex items-center gap-2.5 text-xs text-[#DCE6E0]">
                        <Icon className="w-3.5 h-3.5 text-[#52B788]" />
                        <span className="font-medium">{item.label}</span>
                      </div>
                      <span className="text-[11px] font-mono text-[#8CA396]">
                        {item.val}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Card Footer CTA */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onPrimaryAction}
                  className="w-full py-2.5 px-4 rounded-lg bg-[#142E22] hover:bg-[#1C3E2F] text-[#52B788] hover:text-white border border-[#204A36] text-xs font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <span>{isAuthenticated ? 'Enter Workspace' : 'Sign In to Authorize Workspace'}</span>
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

