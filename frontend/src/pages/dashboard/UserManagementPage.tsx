import React, { useState, useEffect } from 'react';
import {
  Users, UserPlus, Trash2, Edit, RefreshCw,
  CheckCircle, AlertTriangle
} from 'lucide-react';
import {
  fetchUsersList, createOrUpdateUser, revokeUserAccess
} from '@/lib/authApi';
import {
  ROLE_DISPLAY_NAMES, ROLE_BADGE_COLORS,
  type UserProfile, type UserRole
} from '@/types/auth';

interface UserManagementPageProps {
  user: UserProfile;
}

export const UserManagementPage: React.FC<UserManagementPageProps> = ({ user }) => {
  const isSuperAdmin = user.role === 'super_admin';

  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalEmail, setModalEmail] = useState('');
  const [modalFullName, setModalFullName] = useState('');
  const [modalRole, setModalRole] = useState<UserRole>('technical_team');
  const [modalPassword, setModalPassword] = useState('');
  const [modalSubmitting, setModalSubmitting] = useState(false);
  const [modalMessage, setModalMessage] = useState<string | null>(null);

  const loadUsers = async () => {
    if (!isSuperAdmin) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchUsersList();
      setUsers(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalEmail.trim()) return;
    setModalSubmitting(true);
    setModalMessage(null);
    try {
      await createOrUpdateUser(modalEmail, modalRole, modalFullName, modalPassword || undefined);
      setModalMessage('User updated successfully.');
      setShowModal(false);
      setModalEmail('');
      setModalFullName('');
      setModalPassword('');
      await loadUsers();
    } catch (err: unknown) {
      setModalMessage(err instanceof Error ? err.message : 'Operation failed');
    } finally {
      setModalSubmitting(false);
    }
  };

  const handleRevoke = async (targetEmail: string) => {
    if (!confirm(`Are you sure you want to revoke access for ${targetEmail}?`)) return;
    try {
      await revokeUserAccess(targetEmail);
      await loadUsers();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to revoke user');
    }
  };

  if (!isSuperAdmin) {
    return (
      <div className="p-8 text-center text-[#9EB3A8]">
        <Users className="w-10 h-10 mx-auto mb-3 text-[#52B788]" />
        <p className="text-sm">Access restricted to Super Admin role.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white tracking-tight">Authorized Directory</h2>
          <p className="text-xs text-[#9EB3A8]">
            Manage assigned roles and team credentials. Passwords are never shown.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadUsers}
            className="figma-btn-secondary text-xs py-1.5 px-3 rounded-lg"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            type="button"
            onClick={() => {
              setModalEmail('');
              setModalFullName('');
              setModalRole('technical_team');
              setModalPassword('');
              setShowModal(true);
            }}
            className="figma-btn-primary text-xs py-1.5 px-3 rounded-lg"
          >
            <UserPlus className="w-3.5 h-3.5" />
            Add Member
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-950/30 border border-red-900/40 text-xs text-red-300">
          {error}
        </div>
      )}

      {/* Users Table */}
      <div className="rounded-xl border border-[#1E2F26] bg-[#0E1712] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#111C16] border-b border-[#1E2F26] text-[#9EB3A8] uppercase text-[10px] tracking-wider font-medium">
              <tr>
                <th className="py-3 px-4">Team Member</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Last Activity</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A2820]">
              {users.map((u) => {
                const rStyle = ROLE_BADGE_COLORS[u.role] || ROLE_BADGE_COLORS.technical_team;
                return (
                  <tr key={u.email} className="hover:bg-[#131F19] transition-colors">
                    <td className="py-3.5 px-4 font-medium text-white">{u.full_name}</td>
                    <td className="py-3.5 px-4 font-mono text-[#9EB3A8]">{u.email}</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-block text-[10px] font-medium px-2 py-0.5 rounded border ${rStyle.bg} ${rStyle.text} ${rStyle.border}`}>
                        {ROLE_DISPLAY_NAMES[u.role]}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {u.is_active ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-[#52B788]">
                          <CheckCircle className="w-3 h-3" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-red-400">
                          <AlertTriangle className="w-3 h-3" /> Revoked
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[#7A9386] text-[11px]">
                      {u.last_login_at ? new Date(u.last_login_at).toLocaleString() : 'Never'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setModalEmail(u.email);
                            setModalFullName(u.full_name);
                            setModalRole(u.role);
                            setModalPassword('');
                            setShowModal(true);
                          }}
                          className="px-2 py-1 text-[11px] rounded border border-[#22332A] bg-[#111A15] text-[#DCE6E0] hover:text-white hover:bg-[#18261F] transition-colors"
                        >
                          <Edit className="w-3 h-3 mr-1 inline" /> Edit
                        </button>
                        {u.email !== 'ayeshamahek2509@gmail.com' && u.is_active && (
                          <button
                            type="button"
                            onClick={() => handleRevoke(u.email)}
                            className="px-2 py-1 text-[11px] rounded border border-red-900/40 bg-red-950/20 text-red-400 hover:bg-red-900/30 transition-colors"
                          >
                            <Trash2 className="w-3 h-3 mr-1 inline" /> Revoke
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit User Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-[#1E2F26] bg-[#0E1712] p-6 space-y-4">
            <h3 className="text-base font-semibold text-white">
              Add / Update Team Member
            </h3>

            {modalMessage && (
              <div className="p-2.5 rounded-lg bg-[#142E22] border border-[#204A36] text-xs text-[#52B788]">
                {modalMessage}
              </div>
            )}

            <form onSubmit={handleSaveUser} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="text-[#9EB3A8] font-medium">User Email Address</label>
                <input
                  type="email"
                  value={modalEmail}
                  onChange={(e) => setModalEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                  className="w-full px-3 py-2 rounded-lg bg-[#0A0F0D] border border-[#1E2F26] text-white focus:outline-none focus:border-[#2E7D56]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#9EB3A8] font-medium">Full Name / Designation</label>
                <input
                  type="text"
                  value={modalFullName}
                  onChange={(e) => setModalFullName(e.target.value)}
                  placeholder="e.g. Surav Vaishnavi"
                  className="w-full px-3 py-2 rounded-lg bg-[#0A0F0D] border border-[#1E2F26] text-white focus:outline-none focus:border-[#2E7D56]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#9EB3A8] font-medium">Assigned Role</label>
                <select
                  value={modalRole}
                  onChange={(e) => setModalRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0A0F0D] border border-[#1E2F26] text-white focus:outline-none focus:border-[#2E7D56]"
                >
                  <option value="super_admin">Super Admin</option>
                  <option value="technical_lead">Technical Lead</option>
                  <option value="pr_lead">PR Lead</option>
                  <option value="technical_team">Technical Team Member</option>
                  <option value="pr_team">PR Team Member</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[#9EB3A8] font-medium">
                  Password (Leave blank if keeping existing)
                </label>
                <input
                  type="password"
                  value={modalPassword}
                  onChange={(e) => setModalPassword(e.target.value)}
                  placeholder="Enter authorized password"
                  className="w-full px-3 py-2 rounded-lg bg-[#0A0F0D] border border-[#1E2F26] text-white focus:outline-none focus:border-[#2E7D56]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#1E2F26]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="figma-btn-secondary text-xs py-1.5 px-3 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalSubmitting}
                  className="figma-btn-primary text-xs py-1.5 px-3.5 rounded-lg"
                >
                  {modalSubmitting ? 'Saving…' : 'Save Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
