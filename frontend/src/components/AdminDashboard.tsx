import React, { useState } from 'react';
import { Shield, ArrowRight, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

  // Default tab based on role
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
    <div className="min-h-screen bg-[#030604] text-gray-100 font-serif">
      {/* ─── DASHBOARD TOP BAR ──────────────────────────────────────────── */}
      <div className="border-b border-[#142B1F] bg-[#020503]/90 sticky top-0 z-30 backdrop-blur-md">
        <div className="px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-sm bg-[#00D084]/10 border border-[#00D084]/20 flex items-center justify-center text-[#00D084]">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-white font-serif tracking-tight">
                  {isSuperAdmin ? 'Avyra Enterprise Admin Center' : 'Avyra Operations Portal'}
                </h1>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-sm border ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border}`}>
                  {ROLE_DISPLAY_NAMES[user.role]}
                </span>
              </div>
              <p className="text-xs text-gray-400 font-serif">
                Authenticated as: <span className="text-gray-200">{user.email}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={onSwitchToStudio}
              className="gap-2 font-serif text-xs rounded-sm bg-[#00D084] text-black hover:bg-[#05E594] font-bold"
            >
              <span>Avyra Generation Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onSignOut}
              className="gap-1.5 font-serif text-xs rounded-sm border-[#142B1F] bg-[#06110A] text-gray-300 hover:text-white"
            >
              <LogOut className="w-3.5 h-3.5 text-red-400" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* ─── SIDEBAR + CONTENT AREA ─────────────────────────────────────── */}
      <div className="flex">
        <DashboardSidebar
          user={user}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onSwitchToStudio={onSwitchToStudio}
        />

        {/* Main Content */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};
