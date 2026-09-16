import React from 'react';
import { Share2, FileText } from 'lucide-react';

export const PRCampaignsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-white tracking-tight font-serif">PR & Campaign Operations</h2>
        <p className="text-xs text-gray-400 font-serif">
          Manage target audience personas, brand tone presets, and multi-channel campaign strategies.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-6 rounded-md border border-[#142B1F] bg-[#040906] space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 font-serif">
            <Share2 className="w-4 h-4 text-[#00D084]" />
            Active Audience Personas
          </h3>
          <div className="space-y-2 text-xs font-serif">
            {[
              { role: 'C-Suite Executives', focus: 'ROI, Strategy, Risk Reduction' },
              { role: 'Technical Practitioners', focus: 'Architecture, APIs, SOC-2' },
              { role: 'Institutional Investors', focus: 'Scalability, Growth, Moat' },
            ].map((p, i) => (
              <div key={i} className="p-3 rounded-sm bg-[#06110A] border border-[#142B1F] flex justify-between items-center">
                <span className="font-semibold text-white">{p.role}</span>
                <span className="text-gray-400 text-[11px]">{p.focus}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-md border border-[#142B1F] bg-[#040906] space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 font-serif">
            <FileText className="w-4 h-4 text-[#00D084]" />
            Brand Tone & Voice Guidelines
          </h3>
          <div className="space-y-2 text-xs font-serif">
            {[
              { tone: 'Authoritative & Precision', desc: 'Used for Executive Summaries and Advisories' },
              { tone: 'Engaging & Viral', desc: 'Optimized for LinkedIn Thought Leadership and Twitter' },
              { tone: 'Visual & Structured', desc: 'Tuned for Pitch Decks and Slide Outlines' },
            ].map((t, i) => (
              <div key={i} className="p-3 rounded-sm bg-[#06110A] border border-[#142B1F] flex justify-between items-center">
                <span className="font-semibold text-white">{t.tone}</span>
                <span className="text-gray-400 text-[11px]">{t.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
