import React from 'react';
import { LogIn, LogOut, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  ROLE_DISPLAY_NAMES, ROLE_BADGE_COLORS,
  type UserProfile
} from '@/types/auth';

interface HeaderProps {
  user: UserProfile | null;
  activeView: 'landing' | 'studio' | 'dashboard';
  onOpenAuth: (mode?: 'signin' | 'login') => void;
  onSwitchView: (view: 'landing' | 'studio' | 'dashboard') => void;
  onSignOut: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  activeView,
  onOpenAuth,
  onSwitchView,
  onSignOut,
}) => {
  const isSuperAdmin = user?.role === 'super_admin';
  const badgeStyle = user ? (ROLE_BADGE_COLORS[user.role] || ROLE_BADGE_COLORS.technical_team) : null;

  return (
    <header className="sticky top-0 z-50 border-b border-[#143524] bg-[#020503]/95 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 py-3.5 flex items-center justify-between">
        {/* Left: Cortex-style Logo for Avyra in font-agentic */}
        <div className="flex items-center gap-8">
          <div
            onClick={() => onSwitchView(user ? 'studio' : 'landing')}
            className="flex items-center gap-2.5 cursor-pointer"
          >

            <span className="font-agentic text-2xl text-white tracking-wide">
              Avyra
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-[14px] text-gray-300 font-serif">
            <button
              onClick={() => onSwitchView('landing')}
              className={`hover:text-white transition-colors ${activeView === 'landing' ? 'text-white font-bold' : ''}`}
            >
              Overview
            </button>

            {user && (
              <button
                onClick={() => onSwitchView('studio')}
                className={`hover:text-white transition-colors ${activeView === 'studio' ? 'text-[#00D084] font-bold' : ''}`}
              >
                Avyra Studio
              </button>
            )}

            {/* Admin Dashboard: only visible after successful authorized login */}
            {user && (
              <button
                onClick={() => onSwitchView('dashboard')}
                className={`hover:text-white transition-colors flex items-center gap-1.5 ${
                  activeView === 'dashboard' ? 'text-[#00D084] font-bold' : ''
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>{isSuperAdmin ? 'Admin Dashboard' : 'Operations Dashboard'}</span>
              </button>
            )}
          </nav>
        </div>

        {/* Right: Auth Controls */}
        <div className="flex items-center gap-3">
          {user ? (
            /* Authenticated State */
            <div className="flex items-center gap-3">
              {/* User Pill */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-sm bg-[#06110A] border border-[#142B1F] text-xs font-serif">
                <span className="text-gray-300 truncate max-w-[160px]">{user.email}</span>
                {badgeStyle && (
                  <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded-sm border ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border}`}>
                    {ROLE_DISPLAY_NAMES[user.role]}
                  </span>
                )}
              </div>

              {/* Admin Dashboard Button if super admin or authorized */}
              <Button
                variant={activeView === 'dashboard' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onSwitchView(activeView === 'dashboard' ? 'studio' : 'dashboard')}
                className={`font-serif text-xs rounded-sm ${
                  activeView === 'dashboard'
                    ? 'bg-[#00D084] text-black font-bold hover:bg-[#05E594]'
                    : 'border-[#142B1F] bg-[#06110A] text-gray-200 hover:text-white'
                }`}
              >
                {activeView === 'dashboard' ? 'Open Studio' : isSuperAdmin ? 'Admin Dashboard' : 'Dashboard'}
              </Button>

              {/* Sign Out Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={onSignOut}
                title="Sign Out"
                className="h-8 px-2.5 rounded-sm border-[#142B1F] bg-[#06110A] text-gray-400 hover:text-red-400 hover:border-red-800/40"
              >
                <LogOut className="w-3.5 h-3.5" />
              </Button>
            </div>
          ) : (
            /* Unauthenticated State: Sign In and Log In buttons per requirement */
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onOpenAuth('signin')}
                className="font-serif text-xs rounded-sm border-[#142B1F] bg-[#040906] text-gray-200 hover:text-white hover:border-[#00D084]/40"
              >
                Sign In
              </Button>
              <Button
                size="sm"
                onClick={() => onOpenAuth('login')}
                className="font-serif text-xs rounded-sm bg-[#00D084] text-black font-bold hover:bg-[#05E594] transition-all flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Log In</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
