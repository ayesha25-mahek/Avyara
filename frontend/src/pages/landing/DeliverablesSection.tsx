import React from 'react';
import {
  ArrowRight, FileText, Linkedin, Presentation, Video,
  CheckCircle2
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
      className="py-24 bg-white relative border-b border-gray-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-[#00D084]/10 border border-[#00D084]/20 text-[#00D084] text-xs font-serif">
            <span>OUTPUT DELIVERABLES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight font-serif">
            One Input. Eight Production-Ready Formats.
          </h2>
          <p className="text-base text-gray-500 font-serif">
            From high-impact executive summaries to animated presentation decks and social threads, Avyra outputs fully formatted deliverables with interactive revision capabilities.
          </p>
        </div>

        {/* Key Output Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 font-serif">
          {[
            {
              icon: FileText,
              format: 'Executive Summary',
              badge: 'PDF / DOCX',
              desc: 'Condensed strategic briefings with key metrics, risks, and next-step recommendations.',
            },
            {
              icon: Linkedin,
              format: 'LinkedIn & Social Campaign',
              badge: 'Copy & Publish',
              desc: 'Audience-tailored social thought leadership posts with engaging hooks and hashtags.',
            },
            {
              icon: Presentation,
              format: 'Executive Slide Deck',
              badge: 'PPTX Download',
              desc: 'Complete slide presentations with layout structure, bullets, and speaker notes.',
            },
            {
              icon: Video,
              format: 'Neural Video & Script',
              badge: 'MP4 Media',
              desc: 'Scene-by-scene script breakdowns and simulated video presentations with audio telemetry.',
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="rounded-md border border-gray-200 bg-gray-50 p-6 space-y-4 flex flex-col justify-between hover:border-[#00D084]/40 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-sm bg-[#00D084]/10 border border-[#00D084]/20 flex items-center justify-center text-[#00D084]">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-sm bg-white text-gray-500 border border-gray-200">
                      {item.badge}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-gray-900 font-serif">{item.format}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed font-serif">{item.desc}</p>
                </div>

                <div className="pt-3 border-t border-gray-200 flex items-center justify-between text-xs text-gray-400">
                  <span className="flex items-center gap-1.5 text-[#00D084]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    View & Revise Modal
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* High-Impact CTA Box */}
        <div className="mt-20 rounded-md border border-gray-200 bg-gray-50 p-8 sm:p-12 text-center space-y-6 relative overflow-hidden font-serif">
          <div className="max-w-2xl mx-auto space-y-3 relative z-10">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-serif tracking-tight">
              Ready to Experience Autonomous Content Synthesis?
            </h3>
            <p className="text-sm text-gray-500 font-serif leading-relaxed">
              Log in with your authorized team credentials to access the generation workspace, telemetry controls, and deliverable management.
            </p>
          </div>

          <div className="pt-2 flex justify-center items-center gap-4 relative z-10">
            <button
              onClick={onPrimaryAction}
              className="px-8 py-3.5 rounded-full bg-[#00D084] text-black font-bold text-base tracking-tight hover:bg-[#05E594] transition-all font-serif flex items-center gap-2"
            >
              <span>{isAuthenticated ? 'Enter Workspace' : 'Sign In / Log In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
