import React, { useState } from 'react';
import { Shield, ArrowRight, LogOut } from 'lucide-react';
import { DashboardSidebar, type DashboardTab } from '@/components/DashboardSidebar';
import { UserManagementPage } from '@/pages/dashboard/UserManagementPage';
import { TechnicalTelemetryPage } from '@/pages/dashboard/TechnicalTelemetryPage';
import { PRCampaignsPage } from '@/pages/dashboard/PRCampaignsPage';
import { ActivityLogsPage } from '@/pages/dashboard/ActivityLogsPage';
import { RecentSearchesPage } from '@/pages/dashboard/RecentSearchesPage';
import { SettingsPage } from '@/pages/dashboard/SettingsPage';
import {
  ROLE_DISPLAY_NAMES, ROLE_BADGE_COLORS,
  type UserProfile
} from '@/types/auth';

interface AdminDashboardProps {
  user: UserProfile;
  onSwitchToStudio: () => void;
  onSignOut: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  user,
  onSwitchToStudio,
  onSignOut,
}) => {
  const isSuperAdmin = user.role === 'super_admin';
  const isTechnical = user.role === 'technical_lead' || user.role === 'technical_team' || isSuperAdmin;

  const defaultTab: DashboardTab = isSuperAdmin ? 'users' : isTechnical ? 'technical' : 'pr';
  const [activeTab, setActiveTab] = useState<DashboardTab>(defaultTab);

  const badgeStyle = ROLE_BADGE_COLORS[user.role] || ROLE_BADGE_COLORS.technical_team;

  const renderPage = () => {
    switch (activeTab) {
      case 'users':
        return <UserManagementPage user={user} />;
      case 'technical':
        return <TechnicalTelemetryPage />;
      case 'pr':
        return <PRCampaignsPage />;
      case 'activity':
        return <ActivityLogsPage />;
      case 'recent':
        return <RecentSearchesPage />;
      case 'settings':
        return <SettingsPage user={user} onSignOut={onSignOut} />;
      default:
        return <UserManagementPage user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0F0D] text-[#F0F5F2]">
      {/* Dashboard Top Header */}
      <div className="border-b border-[#1E2F26] bg-[#0E1712] sticky top-0 z-30">
        <div className="px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#143324] border border-[#23533B] flex items-center justify-center text-[#52B788]">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-semibold text-white tracking-tight">
                  {isSuperAdmin ? 'Avyra Enterprise Admin Center' : 'Operations Portal'}
                </h1>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded border ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border}`}>
                  {ROLE_DISPLAY_NAMES[user.role]}
                </span>
              </div>
              <p className="text-xs text-[#9EB3A8]">
                Session: <span className="text-[#DCE6E0]">{user.email}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onSwitchToStudio}
              className="figma-btn-primary text-xs py-1.5 px-3.5 rounded-lg"
            >
              <span>Avyra Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={onSignOut}
              className="p-2 rounded-lg border border-[#22332A] bg-[#111A15] text-[#9EB3A8] hover:text-red-400 hover:border-red-900/40 hover:bg-red-950/20 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar + Main Content Layout */}
      <div className="flex">
        <DashboardSidebar
          user={user}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onSwitchToStudio={onSwitchToStudio}
        />

        <main className="flex-1 p-6 sm:p-8 overflow-y-auto max-w-6xl">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};
