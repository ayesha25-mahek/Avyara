import React, { useState } from 'react';
import { ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react';
import { Select } from '@/components/ui/select';

const LANGUAGES = [
  { value: 'English', label: 'English (US/UK)' },
  { value: 'Spanish', label: 'Spanish' },
  { value: 'French', label: 'French' },
  { value: 'German', label: 'German' },
  { value: 'Arabic', label: 'Arabic' },
  { value: 'Hindi', label: 'Hindi' },
  { value: 'Portuguese', label: 'Portuguese' },
  { value: 'Chinese', label: 'Chinese (Mandarin)' },
  { value: 'Japanese', label: 'Japanese' },
  { value: 'Korean', label: 'Korean' },
];

const TONES = [
  { value: 'Professional', label: 'Executive & Authoritative' },
  { value: 'Conversational', label: 'Engaging & Conversational' },
  { value: 'Formal', label: 'Formal / Institutional' },
  { value: 'Technical', label: 'Deep Technical & Analytical' },
  { value: 'Inspiring', label: 'Visionary & Inspiring' },
  { value: 'Urgent', label: 'High Urgency / Action-Driven' },
  { value: 'Casual', label: 'Casual & Direct' },
  { value: 'Friendly', label: 'Approachable & Warm' },
];

const AUDIENCES = [
  { value: 'General', label: 'General Enterprise Audience' },
  { value: 'Executives', label: 'C-Suite (CIO / CISO / CMO)' },
  { value: 'Technical', label: 'Engineering & SecOps Teams' },
  { value: 'Marketing', label: 'GTM & Growth Marketing' },
  { value: 'Investors', label: 'Venture & Board Investors' },
  { value: 'Students', label: 'Academic & Educational' },
];

const DETAIL_LEVELS = [
  { value: 'Brief', label: 'Precision Brief (High-Level Summary)' },
  { value: 'Standard', label: 'Standard Enterprise Depth' },
  { value: 'Detailed', label: 'Deep Tactical Breakdown' },
  { value: 'Comprehensive', label: 'Comprehensive 360° Package' },
];

interface GenerationParamsProps {
  language: string;
  tone: string;
  targetAudience: string;
  detailLevel: string;
  onChange: (field: string, value: string) => void;
  disabled?: boolean;
}

const GenerationParams: React.FC<GenerationParamsProps> = ({
  language, tone, targetAudience, detailLevel, onChange,
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-md border border-[#142B1F] bg-[#040906] overflow-hidden transition-all duration-150">
      {/* Header */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 bg-[#06110A] hover:bg-[#09170E] transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-5 h-5 rounded-sm bg-[#00D084]/15 flex items-center justify-center border border-[#00D084]/30">
            <SlidersHorizontal className="w-3 h-3 text-[#00D084]" />
          </div>
          <span className="text-xs sm:text-sm font-bold text-gray-200 font-serif tracking-wide">
            Execution Parameters
          </span>
          <span className="text-xs font-serif text-gray-400 hidden sm:inline-block border-l border-[#142B1F] pl-2">
            {language} · {tone} · {targetAudience}
          </span>
        </div>
        <div className="flex items-center gap-2 text-gray-400 font-serif">
          <span className="text-xs text-[#00D084]">
            {expanded ? 'Hide Config' : 'Customize Options'}
          </span>
          {expanded
            ? <ChevronUp className="w-3.5 h-3.5 text-[#00D084]" />
            : <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          }
        </div>
      </button>

      {/* Content */}
      {expanded && (
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-[#030704] border-t border-[#142B1F] animate-in fade-in duration-150">
          <Select
            label="Target Language"
            value={language}
            onValueChange={(v) => onChange('language', v)}
            options={LANGUAGES}
          />
          <Select
            label="Voice & Persona Tone"
            value={tone}
            onValueChange={(v) => onChange('tone', v)}
            options={TONES}
          />
          <Select
            label="Target Audience Persona"
            value={targetAudience}
            onValueChange={(v) => onChange('target_audience', v)}
            options={AUDIENCES}
          />
          <Select
            label="Detail & Output Depth"
            value={detailLevel}
            onValueChange={(v) => onChange('detail_level', v)}
            options={DETAIL_LEVELS}
          />
        </div>
      )}
    </div>
  );
};

export { GenerationParams };
