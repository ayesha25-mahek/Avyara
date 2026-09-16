import {
  Video, Linkedin, Twitter, Presentation, FileText,
  BarChart2, Layout, PenTool, Check
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { OutputFormat, OutputFormatMeta } from '@/types';

const OUTPUT_FORMATS: OutputFormatMeta[] = [
  {
    id: 'linkedin',
    label: 'LinkedIn Post',
    description: 'Executive positioning & hooks',
    icon: 'Linkedin',
    estimatedTime: '~20s',
    badge: 'Popular',
  },
  {
    id: 'twitter',
    label: 'X / Twitter',
    description: 'Thread breakdown & hooks',
    icon: 'Twitter',
    estimatedTime: '~15s',
  },
  {
    id: 'executive_summary',
    label: 'Executive Brief',
    description: 'Decision matrices & KPIs',
    icon: 'BarChart2',
    estimatedTime: '~25s',
    badge: 'Strategic',
  },
  {
    id: 'presentation',
    label: 'Deck Presentation',
    description: 'Slide deck & speaker notes',
    icon: 'Presentation',
    estimatedTime: '~45s',
  },
  {
    id: 'advisory',
    label: 'Technical Advisory',
    description: 'Mitigation frameworks',
    icon: 'FileText',
    estimatedTime: '~35s',
    badge: 'Enterprise',
  },
  {
    id: 'infographic',
    label: 'Infographic Spec',
    description: 'Data visual layout & calls',
    icon: 'Layout',
    estimatedTime: '~30s',
  },
  {
    id: 'article',
    label: 'Deep-Dive Article',
    description: 'Technical whitepaper',
    icon: 'PenTool',
    estimatedTime: '~50s',
  },
  {
    id: 'video',
    label: 'AI Video Package',
    description: 'Scenes & neural audio',
    icon: 'Video',
    estimatedTime: '2–4m',
    badge: 'Precision',
  },
];

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Video,
  Linkedin,
  Twitter,
  Presentation,
  FileText,
  BarChart2,
  Layout,
  PenTool,
};

interface OutputFormatCardProps {
  format: OutputFormatMeta;
  selected: boolean;
  onToggle: (id: OutputFormat) => void;
  disabled?: boolean;
}

const OutputFormatCard: React.FC<OutputFormatCardProps> = ({ format, selected, onToggle, disabled }) => {
  const IconComponent = ICON_MAP[format.icon] ?? FileText;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onToggle(format.id)}
      className={cn(
        'group relative w-full flex items-center gap-2.5 p-2 rounded-md transition-all duration-150 text-left border select-none',
        selected
          ? 'bg-[#00D084]/15 border-[#00D084]/80 text-white'
          : 'bg-[#040906] border-[#142B1F] text-gray-300 hover:border-[#00D084]/40 hover:bg-[#07150E]',
        disabled && 'opacity-40 cursor-not-allowed'
      )}
    >
      {/* Small Checkbox Square */}
      <div
        className={cn(
          'w-4 h-4 rounded-sm border flex items-center justify-center shrink-0 transition-colors',
          selected
            ? 'bg-[#00D084] border-[#00D084] text-black'
            : 'border-[#1E4230] bg-[#08120D] group-hover:border-[#00D084]/60'
        )}
      >
        {selected && <Check className="w-3 h-3 stroke-[3]" />}
      </div>

      {/* Mini Icon */}
      <div
        className={cn(
          'w-6 h-6 rounded-sm flex items-center justify-center shrink-0 border transition-colors',
          selected
            ? 'bg-[#00D084]/20 border-[#00D084]/40 text-[#00D084]'
            : 'bg-[#08120D] border-[#163022] text-gray-400 group-hover:text-white'
        )}
      >
        <IconComponent className="w-3 h-3" />
      </div>

      {/* Label and Info */}
      <div className="flex-1 min-w-0 pr-1">
        <div className="flex items-center gap-1.5 justify-between">
          <span className="text-xs font-bold font-serif truncate leading-tight">
            {format.label}
          </span>
          <span className="text-[9px] font-mono text-gray-500 shrink-0">
            {format.estimatedTime}
          </span>
        </div>
        <p className="text-[10px] text-gray-400 truncate leading-tight font-serif">
          {format.description}
        </p>
      </div>
    </button>
  );
};

interface OutputFormatSelectorProps {
  selected: OutputFormat[];
  onToggle: (id: OutputFormat) => void;
  disabled?: boolean;
}

const OutputFormatSelector: React.FC<OutputFormatSelectorProps> = ({ selected, onToggle, disabled }) => {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-sm bg-[#00D084]" />
          <h3 className="text-xs sm:text-sm font-bold text-white tracking-wide uppercase font-serif">
            Select Output Formats
          </h3>
        </div>
        {selected.length > 0 && (
          <span className="text-[11px] font-serif font-semibold px-2 py-0.5 rounded-sm bg-[#00D084]/15 text-[#00D084] border border-[#00D084]/30">
            {selected.length} Selected
          </span>
        )}
      </div>

      {/* Small Checkbox Grid: 2 cols on mobile, 4 cols on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        {OUTPUT_FORMATS.map((format) => (
          <OutputFormatCard
            key={format.id}
            format={format}
            selected={selected.includes(format.id)}
            onToggle={onToggle}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
};

export { OutputFormatSelector, OUTPUT_FORMATS };
