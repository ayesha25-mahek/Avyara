import React from 'react';
import {
  FileText, Linkedin, Presentation, Video, CheckCircle2,
  BarChart2, Layout, PenTool, ArrowRight
} from 'lucide-react';

interface DeliverablesSectionProps {
  isAuthenticated: boolean;
  onPrimaryAction: () => void;
}

export const DeliverablesSection: React.FC<DeliverablesSectionProps> = ({
  isAuthenticated,
  onPrimaryAction,
}) => {
  return (
    <section
      id="deliverables"
      className="py-24 bg-[#F8FAF9] border-b border-[#E1E8E4] text-[#1A2820]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#E8F0EC] border border-[#CFDFD6] text-[#246346] text-xs font-semibold tracking-wide">
            OUTPUT FORMATS
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight font-heading text-[#101F17]">
            Eight enterprise-grade formats from one source input.
          </h2>
          <p className="text-base text-[#567062] leading-relaxed">
            From strategic briefings for the executive committee to multi-slide decks and social thought leadership, Avyra formats every deliverable to platform standards.
          </p>
        </div>

        {/* 4 Primary Output Cards in High-Contrast White Surface */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: BarChart2,
              format: 'Executive Summary',
              badge: 'PDF / DOCX',
              desc: 'High-level synthesis with decision matrices, KPI benchmarks, and prioritized next steps.',
            },
            {
              icon: Linkedin,
              format: 'LinkedIn Thought Leadership',
              badge: 'Copy & Publish',
              desc: 'Audience-targeted narrative hooks, formatted bullet lists, and authoritative industry perspective.',
            },
            {
              icon: Presentation,
              format: 'Executive Slide Deck',
              badge: 'PPTX Presentation',
              desc: 'Complete slide hierarchy with structured headings, key takeaways, and speaker notes.',
            },
            {
              icon: Video,
              format: 'Neural Video Package',
              badge: 'MP4 Media',
              desc: 'Scene-by-scene script breakdowns and simulated audiovisual presentations.',
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="rounded-xl border border-[#DCE4E0] bg-white p-6 space-y-4 flex flex-col justify-between hover:border-[#246346]/40 transition-colors shadow-sm"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-lg bg-[#EAF2EE] border border-[#CFDFD6] flex items-center justify-center text-[#246346]">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F0F5F2] text-[#4A6455] border border-[#D5E0DA]">
                      {item.badge}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-[#101F17]">{item.format}</h3>
                  <p className="text-xs text-[#567062] leading-relaxed">{item.desc}</p>
                </div>

                <div className="pt-3 border-t border-[#EEF3F0] flex items-center justify-between text-xs text-[#246346] font-medium">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Interactive Preview & Revision
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 4 Secondary Output Chips */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
          {[
            { icon: FileText, label: 'Technical Advisory', sub: 'Mitigation frameworks' },
            { icon: Layout, label: 'Infographic Spec', sub: 'Visual callouts & metrics' },
            { icon: PenTool, label: 'Deep-Dive Article', sub: 'Whitepapers & research' },
            { icon: Linkedin, label: 'X / Twitter Thread', sub: 'Viral multi-post breakdown' },
          ].map((chip, i) => {
            const Icon = chip.icon;
            return (
              <div
                key={i}
                className="p-4 rounded-lg bg-white border border-[#DCE4E0] flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded bg-[#EAF2EE] flex items-center justify-center text-[#246346] shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-[#101F17] truncate">{chip.label}</div>
                  <div className="text-[11px] text-[#567062] truncate">{chip.sub}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
