import React, { useState, useEffect } from 'react';
import {
  Users, UserPlus, Trash2, Edit, RefreshCw,
  CheckCircle, AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
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
      <div className="p-8 text-center text-gray-400 font-serif">
        <Users className="w-10 h-10 mx-auto mb-3 text-gray-600" />
        <p>Access restricted to Super Admin role.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight font-serif">Authorized Directory</h2>
          <p className="text-xs text-gray-400 font-serif">
            Manage assigned roles, team credentials, and Supabase RLS security profiles. Passwords are never revealed.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadUsers}
            className="gap-1.5 text-xs rounded-sm border-[#142B1F] bg-[#06110A]"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            size="sm"
            onClick={() => {
              setModalEmail('');
              setModalFullName('');
              setModalRole('technical_team');
              setModalPassword('');
              setShowModal(true);
            }}
            className="gap-1.5 text-xs rounded-sm bg-[#00D084] text-black hover:bg-[#05E594] font-bold"
          >
            <UserPlus className="w-3.5 h-3.5" />
            Add Team Member
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-sm bg-red-950/40 border border-red-800/40 text-xs text-red-300">
          {error}
        </div>
      )}

      {/* Users Table */}
      <div className="rounded-md border border-[#142B1F] bg-[#040906] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-serif">
            <thead className="bg-[#06110A] border-b border-[#142B1F] text-gray-400 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Team Member</th>
                <th className="py-3 px-4">Authorized Email</th>
                <th className="py-3 px-4">Role / Permissions</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Last Activity</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#142B1F]">
              {users.map((u) => {
                const rStyle = ROLE_BADGE_COLORS[u.role] || ROLE_BADGE_COLORS.technical_team;
                return (
                  <tr key={u.email} className="hover:bg-[#07150E] transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-white">{u.full_name}</td>
                    <td className="py-3.5 px-4 font-mono text-gray-300">{u.email}</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-block text-[10px] font-mono px-2 py-0.5 rounded-sm border ${rStyle.bg} ${rStyle.text} ${rStyle.border}`}>
                        {ROLE_DISPLAY_NAMES[u.role]}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {u.is_active ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-[#00D084]">
                          <CheckCircle className="w-3 h-3" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-red-400">
                          <AlertTriangle className="w-3 h-3" /> Revoked
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-gray-400 text-[11px]">
                      {u.last_login_at ? new Date(u.last_login_at).toLocaleString() : 'Never'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setModalEmail(u.email);
                            setModalFullName(u.full_name);
                            setModalRole(u.role);
                            setModalPassword('');
                            setShowModal(true);
                          }}
                          className="h-7 px-2 text-[11px] rounded-sm border-[#142B1F] bg-[#08120D] text-gray-300 hover:text-white"
                        >
                          <Edit className="w-3 h-3 mr-1" /> Edit
                        </Button>
                        {u.email !== 'ayeshamahek2509@gmail.com' && u.is_active && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRevoke(u.email)}
                            className="h-7 px-2 text-[11px] rounded-sm border-red-800/30 bg-red-950/20 text-red-400 hover:bg-red-900/30"
                          >
                            <Trash2 className="w-3 h-3 mr-1" /> Revoke
                          </Button>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-md border border-[#142B1F] bg-[#040906] p-6 font-serif">
            <h3 className="text-base font-bold text-white mb-4">
              Add / Update Authorized Team Member
            </h3>

            {modalMessage && (
              <div className="mb-4 p-2.5 rounded-sm bg-emerald-950/40 border border-emerald-800/40 text-xs text-emerald-300">
                {modalMessage}
              </div>
            )}

            <form onSubmit={handleSaveUser} className="space-y-4 text-xs font-serif">
              <div className="space-y-1">
                <label className="text-gray-300 font-semibold">User Email Address</label>
                <input
                  type="email"
                  value={modalEmail}
                  onChange={(e) => setModalEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                  className="w-full px-3 py-2 rounded-sm bg-[#020604] border border-[#142B1F] text-white focus:outline-none focus:border-[#00D084]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 font-semibold">Full Name / Designation</label>
                <input
                  type="text"
                  value={modalFullName}
                  onChange={(e) => setModalFullName(e.target.value)}
                  placeholder="e.g. Surav Vaishnavi"
                  className="w-full px-3 py-2 rounded-sm bg-[#020604] border border-[#142B1F] text-white focus:outline-none focus:border-[#00D084]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 font-semibold">Assigned Role</label>
                <select
                  value={modalRole}
                  onChange={(e) => setModalRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 rounded-sm bg-[#020604] border border-[#142B1F] text-white focus:outline-none focus:border-[#00D084]"
                >
                  <option value="super_admin">Super Admin</option>
                  <option value="technical_lead">Technical Lead</option>
                  <option value="pr_lead">PR Lead</option>
                  <option value="technical_team">Technical Team Member</option>
                  <option value="pr_team">PR Team Member</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 font-semibold">
                  Password (Leave blank if keeping existing)
                </label>
                <input
                  type="password"
                  value={modalPassword}
                  onChange={(e) => setModalPassword(e.target.value)}
                  placeholder="Enter authorized password"
                  className="w-full px-3 py-2 rounded-sm bg-[#020604] border border-[#142B1F] text-white focus:outline-none focus:border-[#00D084]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#142B1F]">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowModal(false)}
                  className="rounded-sm border-[#142B1F] bg-[#06110A]"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={modalSubmitting}
                  size="sm"
                  className="rounded-sm bg-[#00D084] text-black hover:bg-[#05E594] font-bold"
                >
                  {modalSubmitting ? 'Saving…' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
