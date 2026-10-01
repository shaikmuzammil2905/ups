import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAdminAuth } from './AdminAuthContext';
import ConfirmDialog from './components/ConfirmDialog';
import {
  UserCog, Plus, Search, ShieldCheck, Mail, Calendar, KeyRound,
  Trash2, Loader, Check, AlertCircle, Lock
} from 'lucide-react';

export default function AdminUsers() {
  const { adminProfile } = useAdminAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newFullName, setNewFullName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [creating, setCreating] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'admin')
        .order('created_at', { ascending: false });
      if (!error) setUsers(data || []);
    } catch (err) {
      console.error('Fetch admins error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    if (!newEmail || !newPassword) return;

    setCreating(true);
    try {
      // Sign up via Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: newEmail,
        password: newPassword,
        options: {
          data: {
            full_name: newFullName || 'Livkam Admin',
            role: 'admin',
          },
        },
      });

      if (error) throw error;

      // Upsert into profiles to make sure role is admin
      if (data?.user?.id) {
        await supabase.from('profiles').upsert({
          id: data.user.id,
          email: newEmail,
          full_name: newFullName || 'Livkam Admin',
          role: 'admin',
          created_at: new Date().toISOString(),
        });
      }

      setSuccessMsg(`Admin account "${newEmail}" created!`);
      setTimeout(() => setSuccessMsg(''), 4000);
      setIsModalOpen(false);
      setNewEmail('');
      setNewFullName('');
      setNewPassword('');
      fetchAdmins();
    } catch (err) {
      alert(`Error creating admin: ${err.message}`);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', deleteConfirm.id);
      if (error) throw error;
      setUsers(prev => prev.filter(u => u.id !== deleteConfirm.id));
      setDeleteConfirm(null);
      setSuccessMsg('Admin profile removed.');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      alert(`Delete error: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2.5">
            <UserCog className="w-7 h-7 text-[#16a34a]" />
            Admin Users & Role Security
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage authenticated administrators who have access to this CMS.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#16a34a] hover:bg-green-700 text-white rounded-xl font-bold text-sm shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Create Admin User
        </button>
      </div>

      {successMsg && (
        <div className="flex items-center gap-2 p-3 bg-green-50 text-green-800 border border-green-200 rounded-xl text-sm font-medium animate-fade-in">
          <Check className="w-4 h-4 text-green-600" />
          {successMsg}
        </div>
      )}

      {/* Admin Users Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <Loader className="w-8 h-8 animate-spin mx-auto mb-2 text-[#16a34a]" />
            Loading administrators...
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <UserCog className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-semibold text-slate-700">No admins listed in profiles</p>
            <p className="text-xs text-slate-400 mt-1">You can create your first admin user above.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-500 uppercase text-[11px] font-bold tracking-wider border-b border-slate-100">
                  <th className="py-3 px-4">Admin User</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Created Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/70">
                    <td className="py-3.5 px-4 font-bold text-slate-800">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-xs">
                          {u.full_name?.charAt(0) || u.email?.charAt(0) || 'A'}
                        </div>
                        <div>{u.full_name || 'Administrator'}</div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-mono text-slate-600">
                      {u.email}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
                        <ShieldCheck className="w-3 h-3" />
                        Super Admin
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-400">
                      {new Date(u.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {adminProfile?.id !== u.id && (
                        <button
                          onClick={() => setDeleteConfirm(u)}
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-100 p-6 space-y-4">
            <h2 className="text-xl font-black text-slate-800 pb-3 border-b border-slate-100">
              Create Admin Account
            </h2>

            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  placeholder="e.g. Shaik Muzammil"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Admin Email *
                </label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="admin@livkampower.in"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  minLength={8}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-bold text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#16a34a] hover:bg-green-700 text-white rounded-xl font-bold text-sm shadow-md disabled:opacity-50"
                >
                  {creating && <Loader className="w-4 h-4 animate-spin" />}
                  Create Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <ConfirmDialog
          isOpen={true}
          title="Remove Admin"
          message={`Remove administrator "${deleteConfirm.email}"?`}
          confirmText="Yes, Remove"
          onConfirm={handleDelete}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}
    </div>
  );
}
