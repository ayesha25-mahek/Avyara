import React from 'react';
import { Share2, FileText } from 'lucide-react';

export const PRCampaignsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white tracking-tight">PR & Campaigns</h2>
        <p className="text-xs text-[#9EB3A8]">
          Configure target audience personas and authoritative brand tone guidelines.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-6 rounded-xl border border-[#1E2F26] bg-[#0E1712] space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Share2 className="w-4 h-4 text-[#52B788]" />
            Audience Segments
          </h3>
          <div className="space-y-2 text-xs">
            {[
              { role: 'C-Suite Executives', focus: 'Strategic ROI, Risk Governance, Board Impact' },
              { role: 'Technical Practitioners', focus: 'API Specifications, SOC-2, Data Grounding' },
              { role: 'Institutional Investors', focus: 'Scale Economics, Competitive Moat, Metrics' },
            ].map((p, i) => (
              <div key={i} className="p-3 rounded-lg bg-[#111C16] border border-[#1A2820] flex justify-between items-center">
                <span className="font-medium text-white">{p.role}</span>
                <span className="text-[#8CA396] text-[11px]">{p.focus}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-xl border border-[#1E2F26] bg-[#0E1712] space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#52B788]" />
            Tone & Framing Directives
          </h3>
          <div className="space-y-2 text-xs">
            {[
              { tone: 'Executive & Authoritative', desc: 'Applied to Briefs, Summaries, and Advisories' },
              { tone: 'Analytical & Structured', desc: 'Tuned for Pitch Decks and Slide Outlines' },
              { tone: 'Persuasive & Engaging', desc: 'Optimized for Thought Leadership on LinkedIn & X' },
            ].map((t, i) => (
              <div key={i} className="p-3 rounded-lg bg-[#111C16] border border-[#1A2820] flex justify-between items-center">
                <span className="font-medium text-white">{t.tone}</span>
                <span className="text-[#8CA396] text-[11px]">{t.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
