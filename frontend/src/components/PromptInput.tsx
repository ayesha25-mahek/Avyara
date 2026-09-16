import React, { useEffect, useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Lightbulb } from 'lucide-react';

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const MAX_CHARS = 8000;

const QUICK_PROMPTS = [
  'Enterprise Product Launch GTM Campaign',
  'Executive Threat Intelligence & Strategic Brief',
  'Cloud Architecture Security Advisory',
];

const PromptInput: React.FC<PromptInputProps> = ({ value, onChange, disabled }) => {
  const ref = useRef<HTMLTextAreaElement>(null);

  // Auto-resize
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(400, Math.max(130, el.scrollHeight))}px`;
  }, [value]);

  return (
    <div className="space-y-2">
      <div className="relative group">
        <Textarea
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value.slice(0, MAX_CHARS))}
          disabled={disabled}
          placeholder="Describe campaign goals, paste raw reports, threat intel, or marketing specs…

Examples:
• 'Synthesize our Q3 AI Security release into LinkedIn leadership posts, an executive deck, and video script'
• Paste a technical advisory, product spec, press release, or whitepaper
• 'Generate high-impact content for enterprise decision makers focusing on ROI and Autonomous AI speed'"
          className="min-h-[140px] text-sm leading-relaxed font-sans pr-24"
        />

        {/* Telemetry Counter */}
        <div className="absolute bottom-3 right-3 text-[11px] font-mono px-2 py-0.5 rounded bg-[#08100C] border border-[#1B362C] text-gray-400 pointer-events-none">
          <span className={value.length > 7000 ? 'text-amber-400' : 'text-[#00E599]'}>
            {value.length.toLocaleString()}
          </span>
          <span className="text-gray-600"> / {MAX_CHARS.toLocaleString()}</span>
        </div>
      </div>

      {/* Quick Prompt Presets */}
      {value.length === 0 && !disabled && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] font-mono text-gray-400 flex items-center gap-1 mr-1">
            <Lightbulb className="w-3 h-3 text-[#00E599]" /> Quick presets:
          </span>
          {QUICK_PROMPTS.map((promptText) => (
            <button
              key={promptText}
              type="button"
              onClick={() => onChange(promptText)}
              className="text-[11px] px-2.5 py-1 rounded-md bg-[#0E1B15] hover:bg-[#00E599]/15 text-gray-300 hover:text-[#00E599] border border-[#1B362C] hover:border-[#00E599]/40 transition-all font-mono"
            >
              {promptText}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export { PromptInput };
