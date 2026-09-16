import React from 'react';
import { Search, Clock } from 'lucide-react';

export const RecentSearchesPage: React.FC = () => {
  // Placeholder recent searches - in production these would come from API/localStorage
  const recentSearches = [
    { query: 'Executive summary for Q3 investor report', time: '2 hours ago', format: 'PDF' },
    { query: 'LinkedIn campaign for product launch', time: '5 hours ago', format: 'Social' },
    { query: 'Technical architecture deck for SOC-2 audit', time: '1 day ago', format: 'PPTX' },
    { query: 'Video script for onboarding walkthrough', time: '2 days ago', format: 'Video' },
    { query: 'Twitter thread for funding announcement', time: '3 days ago', format: 'Social' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-white tracking-tight font-serif">Recent Searches</h2>
        <p className="text-xs text-gray-400 font-serif">
          Your recent generation prompts and synthesis requests.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="text"
          placeholder="Search past prompts..."
          className="w-full pl-10 pr-4 py-2.5 rounded-md bg-[#040906] border border-[#142B1F] text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00D084] font-serif"
        />
      </div>

      {/* Recent Items */}
      <div className="space-y-3">
        {recentSearches.map((item, idx) => (
          <div
            key={idx}
            className="p-4 rounded-md border border-[#142B1F] bg-[#040906] hover:border-[#00D084]/30 transition-colors cursor-pointer group"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-1.5">
                <p className="text-sm text-white font-serif group-hover:text-[#00D084] transition-colors">
                  {item.query}
                </p>
                <div className="flex items-center gap-3 text-xs text-gray-500 font-serif">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {item.time}
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-sm bg-[#00D084]/10 text-[#00D084] border border-[#00D084]/20 shrink-0">
                {item.format}
              </span>
            </div>
          </div>
        ))}
      </div>

      {recentSearches.length === 0 && (
        <div className="py-12 text-center">
          <Search className="w-10 h-10 mx-auto mb-3 text-gray-600" />
          <p className="text-gray-500 text-sm font-serif">No recent searches yet.</p>
          <p className="text-gray-600 text-xs font-serif mt-1">Your generation prompts will appear here.</p>
        </div>
      )}
    </div>
  );
};
