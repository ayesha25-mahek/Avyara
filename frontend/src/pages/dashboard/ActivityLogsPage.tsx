import React, { useState, useEffect } from 'react';
import { Activity, RefreshCw } from 'lucide-react';
import { fetchActivityLogs } from '@/lib/authApi';
import type { ActivityLog } from '@/types/auth';

export const ActivityLogsPage: React.FC = () => {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadActivities = async () => {
    setIsLoading(true);
    try {
      const logs = await fetchActivityLogs();
      setActivities(logs);
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadActivities();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white tracking-tight">System Audit Trail</h2>
          <p className="text-xs text-[#9EB3A8]">
            Immutable record of logins, generation pipelines, and deliverable revision events.
          </p>
        </div>
        <button
          type="button"
          onClick={loadActivities}
          className="figma-btn-secondary text-xs py-1.5 px-3 rounded-lg"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="rounded-xl border border-[#1E2F26] bg-[#0E1712] p-4 space-y-2 font-mono text-xs">
        {activities.length === 0 ? (
          <div className="py-12 text-center text-[#6B8276] font-sans">
            <Activity className="w-8 h-8 mx-auto mb-2 text-[#2D4338]" />
            <p>No recent activity records found.</p>
          </div>
        ) : (
          activities.map((a) => (
            <div
              key={a.id}
              className="p-3 rounded-lg bg-[#111C16] border border-[#1A2820] flex flex-wrap items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-[#52B788] font-bold">[{a.action}]</span>
                <span className="text-white">{a.actor_email}</span>
                <span className="text-[#6B8276]">({a.actor_role})</span>
              </div>
              <span className="text-[#7A9386] text-[11px]">
                {new Date(a.timestamp).toLocaleString()}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
