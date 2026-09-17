export type UserRole =
  | 'super_admin'
  | 'technical_lead'
  | 'pr_lead'
  | 'technical_team'
  | 'pr_team';

export interface UserProfile {
  email: string;
  full_name: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  last_login_at?: string | null;
  permissions: string[];
}

export interface AuthResponse {
  token: string;
  user: UserProfile;
}

export interface ActivityLog {
  id: string;
  actor_email: string;
  actor_role: string;
  action: string;
  details: Record<string, unknown>;
  timestamp: string;
}

export const ROLE_DISPLAY_NAMES: Record<UserRole, string> = {
  super_admin: 'Super Admin',
  technical_lead: 'Technical Lead',
  pr_lead: 'PR Lead',
  technical_team: 'Technical Team Member',
  pr_team: 'PR Team Member',
};

export const ROLE_BADGE_COLORS: Record<UserRole, { bg: string; text: string; border: string }> = {
  super_admin: { bg: 'bg-[#0E1B15]', text: 'text-[#52B788]', border: 'border-[#1E2F26]' },
  technical_lead: { bg: 'bg-[#0E1B15]', text: 'text-[#52B788]', border: 'border-[#1E2F26]' },
  pr_lead: { bg: 'bg-[#0E1B15]', text: 'text-[#52B788]', border: 'border-[#1E2F26]' },
  technical_team: { bg: 'bg-[#0E1B15]', text: 'text-[#52B788]', border: 'border-[#1E2F26]' },
  pr_team: { bg: 'bg-[#0E1B15]', text: 'text-[#52B788]', border: 'border-[#1E2F26]' },
};
