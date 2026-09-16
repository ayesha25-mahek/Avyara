import React, { useState, useEffect } from 'react';
import { Activity, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
          <h2 className="text-lg font-bold text-white tracking-tight font-serif">System Activity & Audit Trail</h2>
          <p className="text-xs text-gray-400 font-serif">
            Real-time record of logins, generation requests, deliverable revisions, and permission events.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={loadActivities}
          className="gap-1.5 text-xs rounded-sm border-[#142B1F] bg-[#06110A]"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh Logs
        </Button>
      </div>

      <div className="rounded-md border border-[#142B1F] bg-[#040906] p-4 space-y-3 font-mono text-xs">
        {activities.length === 0 ? (
          <div className="py-10 text-center">
            <Activity className="w-8 h-8 mx-auto mb-3 text-gray-600" />
            <p className="text-gray-500 font-serif">No recent activity logged.</p>
          </div>
        ) : (
          activities.map((a) => (
            <div
              key={a.id}
              className="p-3 rounded-sm bg-[#06110A] border border-[#142B1F] flex flex-wrap items-center justify-between gap-2"
            >
              <div className="flex items-center gap-3">
                <span className="text-[#00D084] font-bold">[{a.action}]</span>
                <span className="text-gray-200">{a.actor_email}</span>
                <span className="text-gray-500">({a.actor_role})</span>
              </div>
              <span className="text-gray-500 text-[11px]">
                {new Date(a.timestamp).toLocaleString()}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
