import React, { useState } from 'react';
import {
  Copy, Download, CheckCheck, FileText, Video, Linkedin,
  Twitter, Presentation, BarChart2, Layout, PenTool, AlertCircle, Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { downloadFile } from '@/lib/api';
import type { ResultEvent, OutputFormat } from '@/types';
import { OUTPUT_FORMATS } from '@/components/OutputFormatSelector';

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Video, Linkedin, Twitter, Presentation, FileText, BarChart2, Layout, PenTool,
};

interface ResultCardProps {
  result: ResultEvent;
  index: number;
  onView: (outputType: OutputFormat) => void;
}

const ResultCard: React.FC<ResultCardProps> = ({ result, onView }) => {
  const [copied, setCopied] = useState(false);
  const meta = OUTPUT_FORMATS.find((f) => f.id === result.output_type);
  const IconComponent = ICON_MAP[meta?.icon ?? 'FileText'] ?? FileText;

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(result.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (result.download_url) {
      downloadFile(result.download_url, result.filename);
    }
  };

  const isError = result.status === 'error';
  const hasDownload = !!result.download_url;
  const hasText = !!result.content;

  // Snippet preview for card display (first 220 characters)
  const snippet = result.content
    ? result.content.slice(0, 240).replace(/^[#*-]\s+/gm, '') + (result.content.length > 240 ? '…' : '')
    : 'No content synthesized yet.';

  return (
    <div
      onClick={() => onView(result.output_type)}
      className={cn(
        'group cursor-pointer relative rounded-md border flex flex-col justify-between overflow-hidden transition-all duration-200',
        'bg-[#06150D] hover:bg-[#081C11] p-4 text-left shadow-md',
        isError ? 'border-red-500/40' : 'border-[#173826] hover:border-[#00D084]/60 hover:shadow-[#00D084]/5'
      )}
    >
      {/* Top Bar: Icon + Title + Status */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={cn(
              'w-7 h-7 rounded-sm flex items-center justify-center shrink-0 border',
              isError
                ? 'bg-red-500/20 border-red-500/30 text-red-400'
                : 'bg-[#00D084]/20 border-[#00D084]/40 text-[#00D084]'
            )}>
              {isError
                ? <AlertCircle className="w-3.5 h-3.5" />
                : <IconComponent className="w-3.5 h-3.5" />
              }
            </div>
            <div className="min-w-0">
              <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight truncate font-serif group-hover:text-[#00D084] transition-colors">
                {meta?.label ?? result.output_type}
              </h4>
              <span className="text-[10px] font-mono text-gray-400">
                {result.output_type.toUpperCase()}
              </span>
            </div>
          </div>

          <Badge variant={isError ? 'destructive' : 'success'} className="text-[9px] shrink-0 font-sans rounded-sm px-1.5 py-0">
            {isError ? 'ERROR' : 'READY'}
          </Badge>
        </div>

        {/* Snippet Preview (Click to open full popup preview) */}
        <div className="mb-3 p-2.5 rounded-sm bg-[#030A06] border border-[#132A1D] text-xs text-gray-300 font-serif line-clamp-3 leading-relaxed">
          {snippet}
        </div>
      </div>

      {/* Card Action Buttons (Clicking card opens popup, or use direct buttons) */}
      <div className="pt-2 border-t border-[#132A1D] flex items-center justify-between gap-2">
        <span className="text-[11px] font-serif text-[#00D084] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform font-semibold">
          <Eye className="w-3 h-3" />
          Preview & Edit
        </span>

        <div className="flex items-center gap-1.5">
          {hasText && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              title="Quick copy"
              className="h-6 px-2 text-[10px] rounded-sm bg-[#08160E] border-[#163322] text-gray-300 hover:text-white"
            >
              {copied ? <CheckCheck className="w-3 h-3 text-[#00D084]" /> : <Copy className="w-3 h-3" />}
            </Button>
          )}

          {hasDownload && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              title="Download file"
              className="h-6 px-2 text-[10px] rounded-sm bg-[#08160E] border-[#163322] text-gray-300 hover:text-[#00D084]"
            >
              <Download className="w-3 h-3" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

interface ResultsPanelProps {
  results: Partial<Record<OutputFormat, ResultEvent>>;
  onDownloadAll: () => void;
  onView: (outputType: OutputFormat) => void;
}

const ResultsPanel: React.FC<ResultsPanelProps> = ({ results, onDownloadAll, onView }) => {
  const entries = Object.values(results).filter(Boolean) as ResultEvent[];
  const hasDownloadable = entries.some((r) => r.download_url);

  return (
    <div className="space-y-4 font-serif">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-sm bg-[#00D084]" />
          <span className="text-sm sm:text-base font-bold text-white font-serif tracking-wide">
            Synthesized Outputs
          </span>
          <span className="font-serif text-xs px-2 py-0.5 rounded-sm bg-[#00D084]/20 text-[#00D084] border border-[#00D084]/40 font-semibold">
            {entries.length} Deliverable{entries.length > 1 ? 's' : ''} Ready
          </span>
        </div>

        {hasDownloadable && (
          <Button
            variant="outline"
            size="sm"
            onClick={onDownloadAll}
            className="gap-1.5 text-xs font-serif rounded-sm border-[#163825] bg-[#06150D] text-gray-200 hover:border-[#00D084]/60 hover:text-[#00D084]"
          >
            <Download className="w-3.5 h-3.5 text-[#00D084]" />
            Download All Assets
          </Button>
        )}
      </div>

      <p className="text-xs text-gray-400 font-serif">
        Click any generated output below to inspect the full preview, make instant AI revisions, or download the deliverable.
      </p>

      {/* Side-by-Side Grid (1 col on mobile, 2 cols on tablet/desktop, 3 on large screens) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
        {entries.map((result, i) => (
          <ResultCard key={result.output_type} result={result} index={i} onView={onView} />
        ))}
      </div>
    </div>
  );
};

export { ResultsPanel };
