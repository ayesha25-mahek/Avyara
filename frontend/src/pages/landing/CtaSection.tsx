import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

interface CtaSectionProps {
  isAuthenticated: boolean;
  onPrimaryAction: () => void;
}

export const CtaSection: React.FC<CtaSectionProps> = ({
  isAuthenticated,
  onPrimaryAction,
}) => {
  return (
    <section className="py-24 bg-[#0F261B] text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#163827] border border-[#23573E] text-[#74C69D] text-xs font-semibold tracking-wide">
            GET STARTED TODAY
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight font-heading text-white">
            Accelerate your enterprise content pipeline.
          </h2>
          <p className="text-base sm:text-lg text-[#B8D5C6] max-w-xl mx-auto leading-relaxed">
            Ingest strategy documents, synthesize executive decks, and deploy authoritative campaigns with verified grounding in seconds.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            type="button"
            onClick={onPrimaryAction}
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg bg-white text-[#0F261B] font-semibold text-sm hover:bg-[#F0F5F2] transition-colors shadow-sm"
          >
            <span>{isAuthenticated ? 'Open Studio Workspace' : 'Sign In to Authorize Workspace'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs text-[#8BB29D]">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#74C69D]" />
            Role-Based Access Control
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#74C69D]" />
            Supabase Vector Grounding
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#74C69D]" />
            8 Output Pipelines
          </span>
        </div>
      </div>
    </section>
  );
};
