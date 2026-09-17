import React from 'react';
import { Search, Clock } from 'lucide-react';

export const RecentSearchesPage: React.FC = () => {
  const recentSearches = [
    { query: 'Executive summary for Q3 enterprise investor presentation', time: '2 hours ago', format: 'Executive Summary' },
    { query: 'LinkedIn thought leadership campaign on autonomous agentic security', time: '5 hours ago', format: 'LinkedIn' },
    { query: 'Enterprise slide deck outline for SOC-2 Type II audit', time: '1 day ago', format: 'Slide Deck' },
    { query: 'Audiovisual walkthrough script for cloud architecture migration', time: '2 days ago', format: 'Video Script' },
    { query: 'Technical advisory on vector database partitioning & scaling', time: '3 days ago', format: 'Advisory' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white tracking-tight">Recent Ingestion History</h2>
        <p className="text-xs text-[#9EB3A8]">
          Review and re-launch past generation queries and prompt configurations.
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B8276]" />
        <input
          type="text"
          placeholder="Filter past generation runs..."
          className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#0E1712] border border-[#1E2F26] text-xs text-white placeholder-[#6B8276] focus:outline-none focus:border-[#2E7D56]"
        />
      </div>

      <div className="space-y-2.5">
        {recentSearches.map((item, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl border border-[#1E2F26] bg-[#0E1712] hover:border-[#2D4338] transition-colors cursor-pointer group"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1 min-w-0">
                <p className="text-xs sm:text-sm text-white font-medium group-hover:text-[#52B788] transition-colors truncate">
                  {item.query}
                </p>
                <div className="flex items-center gap-1 text-[11px] text-[#6B8276]">
                  <Clock className="w-3 h-3" />
                  <span>{item.time}</span>
                </div>
              </div>
              <span className="text-[10px] font-medium px-2.5 py-1 rounded bg-[#142E22] text-[#52B788] border border-[#204A36] shrink-0">
                {item.format}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
