import React from 'react';
import { User, Bell, Shield, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  ROLE_DISPLAY_NAMES, ROLE_BADGE_COLORS,
  type UserProfile
} from '@/types/auth';

interface SettingsPageProps {
  user: UserProfile;
  onSignOut: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ user, onSignOut }) => {
  const badgeStyle = ROLE_BADGE_COLORS[user.role] || ROLE_BADGE_COLORS.technical_team;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-white tracking-tight font-serif">Settings</h2>
        <p className="text-xs text-gray-400 font-serif">
          Manage your account preferences and platform configuration.
        </p>
      </div>

      {/* Account Info */}
      <div className="p-6 rounded-md border border-[#142B1F] bg-[#040906] space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 font-serif">
          <User className="w-4 h-4 text-[#00D084]" />
          Account Information
        </h3>
        <div className="space-y-3 text-xs font-serif">
          <div className="p-3 rounded-sm bg-[#06110A] border border-[#142B1F] flex justify-between items-center">
            <span className="text-gray-400">Email</span>
            <span className="text-white font-mono">{user.email}</span>
          </div>
          <div className="p-3 rounded-sm bg-[#06110A] border border-[#142B1F] flex justify-between items-center">
            <span className="text-gray-400">Full Name</span>
            <span className="text-white">{user.full_name}</span>
          </div>
          <div className="p-3 rounded-sm bg-[#06110A] border border-[#142B1F] flex justify-between items-center">
            <span className="text-gray-400">Role</span>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-sm border ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border}`}>
              {ROLE_DISPLAY_NAMES[user.role]}
            </span>
          </div>
          <div className="p-3 rounded-sm bg-[#06110A] border border-[#142B1F] flex justify-between items-center">
            <span className="text-gray-400">Status</span>
            <span className="text-[#00D084] text-[11px]">● Active</span>
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="p-6 rounded-md border border-[#142B1F] bg-[#040906] space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 font-serif">
          <Bell className="w-4 h-4 text-[#00D084]" />
          Notification Preferences
        </h3>
        <div className="space-y-3 text-xs font-serif">
          {[
            { label: 'Email notifications for completed generations', enabled: true },
            { label: 'Activity alerts for team changes', enabled: true },
            { label: 'Weekly usage report digest', enabled: false },
          ].map((pref, i) => (
            <div key={i} className="p-3 rounded-sm bg-[#06110A] border border-[#142B1F] flex justify-between items-center">
              <span className="text-gray-300">{pref.label}</span>
              <div className={`w-8 h-4 rounded-full relative cursor-pointer transition-colors ${pref.enabled ? 'bg-[#00D084]' : 'bg-gray-700'}`}>
                <div className={`w-3 h-3 rounded-full bg-white absolute top-0.5 transition-all ${pref.enabled ? 'left-4.5' : 'left-0.5'}`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Appearance */}
      <div className="p-6 rounded-md border border-[#142B1F] bg-[#040906] space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 font-serif">
          <Palette className="w-4 h-4 text-[#00D084]" />
          Appearance
        </h3>
        <div className="text-xs font-serif">
          <div className="p-3 rounded-sm bg-[#06110A] border border-[#142B1F] flex justify-between items-center">
            <span className="text-gray-300">Theme</span>
            <span className="text-[#00D084] font-mono text-[11px]">Dark (Default)</span>
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="p-6 rounded-md border border-[#142B1F] bg-[#040906] space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 font-serif">
          <Shield className="w-4 h-4 text-[#00D084]" />
          Security
        </h3>
        <div className="space-y-3">
          <div className="p-3 rounded-sm bg-[#06110A] border border-[#142B1F] flex justify-between items-center text-xs font-serif">
            <span className="text-gray-300">Session</span>
            <span className="text-[#00D084] font-mono text-[11px]">Active</span>
          </div>
          <Button
            onClick={onSignOut}
            variant="outline"
            size="sm"
            className="w-full rounded-sm border-red-800/30 bg-red-950/20 text-red-400 hover:bg-red-900/30 font-serif text-xs"
          >
            Sign Out of All Sessions
          </Button>
        </div>
      </div>
    </div>
  );
};
