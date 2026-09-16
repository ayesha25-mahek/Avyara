import React from 'react';
import { Cpu, Zap, FileSearch, CheckCircle2, Sparkles, Loader2, Activity } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import type { ProgressEvent, ResultEvent, OutputFormat } from '@/types';
import { OUTPUT_FORMATS } from '@/components/OutputFormatSelector';

const STAGE_ICONS: Record<string, React.FC<{ className?: string }>> = {
  reading: FileSearch,
  analyzing: Cpu,
  preparing: Sparkles,
  generating: Zap,
  done: CheckCircle2,
};

interface ProgressPanelProps {
  progress: ProgressEvent | null;
  completedResults: Partial<Record<OutputFormat, ResultEvent>>;
  selectedOutputs: OutputFormat[];
}

const ProgressPanel: React.FC<ProgressPanelProps> = ({ progress, completedResults, selectedOutputs }) => {
  const stage = progress?.stage ?? 'analyzing';
  const StageIcon = STAGE_ICONS[stage] ?? Zap;
  const percent = progress?.percent ?? 0;
  const message = progress?.message ?? 'Autonomous Pipeline Active…';

  return (
    <div className="relative rounded-md border border-[#142B1F] bg-[#040906] p-5 space-y-4 font-serif">
      {/* Stage indicator & Telemetry */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-sm bg-[#00D084]/15 border border-[#00D084]/30 flex items-center justify-center">
            <StageIcon className="w-4 h-4 text-[#00D084]" />
          </div>
          <div>
            <p className="text-xs sm:text-sm font-bold text-white font-serif tracking-tight">{message}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-sm bg-[#00D084]" />
              <span className="text-[10px] font-mono text-gray-400 tracking-wider uppercase">
                {stage === 'done' ? 'ALL DELIVERABLES ASSEMBLED' : `AVRA PLAYBOOK // ${stage.toUpperCase()}`}
              </span>
            </div>
          </div>
        </div>

        <div className="text-right hidden sm:block">
          <span className="text-lg font-mono font-bold text-[#00D084]">
            {percent}%
          </span>
        </div>
      </div>

      {/* High-tech Progress bar */}
      <div className="space-y-1.5">
        <Progress value={percent} />
        <div className="flex justify-between text-[11px] font-mono text-gray-400">
          <span className="flex items-center gap-1">
            <Activity className="w-3 h-3 text-[#00E599]" /> Neural Inference Stream
          </span>
          <span className="text-white font-bold">{percent}% COMPLETED</span>
        </div>
      </div>

      {/* Neural Pipeline Output Stage Status List */}
      {selectedOutputs.length > 0 && (
        <div className="space-y-2 pt-1 border-t border-[#1B362C]/60">
          <div className="flex items-center justify-between text-[10px] font-mono text-gray-400 uppercase tracking-widest px-1">
            <span>Target Pipeline Task</span>
            <span>Execution Status</span>
          </div>

          {selectedOutputs.map((outputId) => {
            const meta = OUTPUT_FORMATS.find((f) => f.id === outputId);
            const result = completedResults[outputId];
            const isDone = !!result;
            const isError = result?.status === 'error';
            const isCurrent = progress?.current === outputId;

            return (
              <div
                key={outputId}
                className={cn(
                  'flex items-center justify-between px-3.5 py-2 rounded-sm text-xs font-serif transition-all duration-150',
                  isDone && !isError ? 'bg-[#00D084]/10 border border-[#00D084]/30 text-[#00D084]' :
                  isError ? 'bg-red-500/10 border border-red-500/30 text-red-300' :
                  isCurrent ? 'bg-[#00D084]/15 border border-[#00D084]/40 text-white' :
                  'bg-[#060D09] border border-[#142B1F] text-gray-400'
                )}
              >
                <div className="flex items-center gap-2.5">
                  {isDone && !isError ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00D084] shrink-0" />
                  ) : isCurrent ? (
                    <Loader2 className="w-3.5 h-3.5 text-[#00D084] animate-spin shrink-0" />
                  ) : (
                    <div className={cn('w-3.5 h-3.5 rounded-sm border flex items-center justify-center text-[9px] shrink-0',
                      isError ? 'border-red-400 text-red-400' : 'border-white/20 text-gray-600'
                    )}>
                      •
                    </div>
                  )}
                  <span className={cn('font-semibold font-serif text-xs',
                    isDone && !isError ? 'text-white' :
                    isCurrent ? 'text-white' : 'text-gray-400'
                  )}>
                    {meta?.label ?? outputId}
                  </span>
                </div>

                <div className="text-[11px] font-mono">
                  {isError && <span className="text-red-400 font-bold">FAILED</span>}
                  {isDone && !isError && <span className="text-[#00E599] font-bold">READY</span>}
                  {isCurrent && <span className="text-[#00E599] font-bold animate-pulse">PROCESSING…</span>}
                  {!isDone && !isCurrent && !isError && <span className="text-gray-600">QUEUED</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export { ProgressPanel };
