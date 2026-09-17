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
    ...(isSuperAdmin ? [{ id: 'users' as DashboardTab, label: 'User Directory', icon: Users, section: 'main' as const }] : []),
    ...(isTechnical ? [{ id: 'technical' as DashboardTab, label: 'Technical Telemetry', icon: Cpu, section: 'main' as const }] : []),
    ...(isPR ? [{ id: 'pr' as DashboardTab, label: 'PR & Campaigns', icon: Share2, section: 'main' as const }] : []),
    { id: 'activity' as DashboardTab, label: 'Audit Trail', icon: Activity, section: 'main' as const },
    { id: 'recent' as DashboardTab, label: 'Recent Searches', icon: Search, section: 'tools' as const },
    { id: 'settings' as DashboardTab, label: 'Settings', icon: Settings, section: 'tools' as const },
  ];

  const mainItems = navItems.filter((i) => i.section === 'main');
  const toolsItems = navItems.filter((i) => i.section === 'tools');

  return (
    <aside className="w-64 shrink-0 bg-[#0A0F0D] border-r border-[#1E2F26] min-h-[calc(100vh-4rem)] flex flex-col justify-between p-4">
      <div className="space-y-6">
        {/* Workspace Switcher Header */}
        <div className="px-2 pt-1">
          <div className="text-xs font-semibold text-[#9EB3A8] uppercase tracking-wider">
            {isSuperAdmin ? 'Enterprise Admin' : 'Operations'}
          </div>
          <div className="text-sm font-semibold text-white mt-0.5 truncate">
            {user.full_name || user.email}
          </div>
        </div>

        {/* Features / Main Section */}
        <div className="space-y-1">
          <div className="px-2 text-[11px] font-medium text-[#6B8276] uppercase tracking-wider">
            Core Modules
          </div>
          <div className="space-y-1 pt-1">
            {mainItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left ${
                    isActive
                      ? 'bg-[#142E22] text-white border border-[#204A36]'
                      : 'text-[#9EB3A8] hover:text-white hover:bg-[#111A15]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#52B788]' : 'text-[#6B8276]'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tools Section */}
        <div className="space-y-1">
          <div className="px-2 text-[11px] font-medium text-[#6B8276] uppercase tracking-wider">
            Tools
          </div>
          <div className="space-y-1 pt-1">
            {toolsItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left ${
                    isActive
                      ? 'bg-[#142E22] text-white border border-[#204A36]'
                      : 'text-[#9EB3A8] hover:text-white hover:bg-[#111A15]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#52B788]' : 'text-[#6B8276]'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Workspace Action */}
      <div className="pt-4 border-t border-[#16231C]">
        <button
          type="button"
          onClick={onSwitchToStudio}
          className="w-full figma-btn-primary py-2 text-xs rounded-lg"
        >
          <span>Open Workspace</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
