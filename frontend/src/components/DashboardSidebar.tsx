import React from 'react';
import {
  LayoutDashboard, Users, Cpu, Share2, Activity,
  Search, Settings, ArrowRight
} from 'lucide-react';
import type { UserProfile } from '@/types/auth';

export type DashboardTab = 'users' | 'technical' | 'pr' | 'activity' | 'recent' | 'settings';

interface DashboardSidebarProps {
  user: UserProfile;
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  onSwitchToStudio: () => void;
}

interface NavItem {
  id: DashboardTab;
  label: string;
  icon: React.ElementType;
  section: 'main' | 'tools';
  roles?: string[];
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  user,
  activeTab,
  onTabChange,
  onSwitchToStudio,
}) => {
  const isSuperAdmin = user.role === 'super_admin';
  const isTechnical = user.role === 'technical_lead' || user.role === 'technical_team' || isSuperAdmin;
  const isPR = user.role === 'pr_lead' || user.role === 'pr_team' || isSuperAdmin;

  const navItems: NavItem[] = [
    // Main section
    ...(isSuperAdmin ? [{ id: 'users' as DashboardTab, label: 'User Management', icon: Users, section: 'main' as const }] : []),
    ...(isTechnical ? [{ id: 'technical' as DashboardTab, label: 'Technical Telemetry', icon: Cpu, section: 'main' as const }] : []),
    ...(isPR ? [{ id: 'pr' as DashboardTab, label: 'PR Campaigns', icon: Share2, section: 'main' as const }] : []),
    { id: 'activity' as DashboardTab, label: 'Activity Logs', icon: Activity, section: 'main' as const },
    // Tools section
    { id: 'recent' as DashboardTab, label: 'Recent Searches', icon: Search, section: 'tools' as const },
    { id: 'settings' as DashboardTab, label: 'Settings', icon: Settings, section: 'tools' as const },
  ];

  const mainItems = navItems.filter(i => i.section === 'main');
  const toolsItems = navItems.filter(i => i.section === 'tools');

  return (
    <aside className="w-60 shrink-0 bg-[#020503] border-r border-[#142B1F] min-h-[calc(100vh-4.5rem)] flex flex-col">
      {/* Dashboard Title */}
      <div className="px-4 py-5 border-b border-[#142B1F]">
        <div className="flex items-center gap-2">
          <LayoutDashboard className="w-4 h-4 text-[#00D084]" />
          <span className="text-sm font-bold text-white font-serif">
            {isSuperAdmin ? 'Admin Center' : 'Operations'}
          </span>
        </div>
      </div>

      {/* Features / Main Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <span className="px-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wider font-serif">
          Features
        </span>
        <div className="mt-2 space-y-0.5">
          {mainItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-serif transition-colors ${
                  isActive
                    ? 'bg-[#00D084]/15 text-[#00D084] font-bold border border-[#00D084]/20'
                    : 'text-gray-400 hover:text-white hover:bg-[#06110A]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tools Section */}
        <div className="pt-5">
          <span className="px-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wider font-serif">
            Tools
          </span>
          <div className="mt-2 space-y-0.5">
            {toolsItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-serif transition-colors ${
                    isActive
                      ? 'bg-[#00D084]/15 text-[#00D084] font-bold border border-[#00D084]/20'
                      : 'text-gray-400 hover:text-white hover:bg-[#06110A]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Studio Quick Access */}
      <div className="px-3 pb-4">
        <button
          onClick={onSwitchToStudio}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-md bg-[#00D084] text-black font-bold text-xs font-serif hover:bg-[#05E594] transition-colors"
        >
          <span>Open Studio</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
