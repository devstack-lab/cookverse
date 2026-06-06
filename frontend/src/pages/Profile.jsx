import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { User, Mail, Shield, RefreshCw, KeyRound, LogOut } from 'lucide-react';

const Profile = () => {
  const { user, logout, updateName } = useAuth();
  
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [name, setName] = useState('');
  const [editLoading, setEditLoading] = useState(false);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await authAPI.getProfile();
        setProfileData(response.data);
        setName(response.data.name);
      } catch (err) {
        setError('Failed to fetch profile details');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleUpdateName = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    
    if (!name.trim()) {
      setError('Name cannot be empty');
      return;
    }

    setEditLoading(true);
    try {
      await authAPI.updateProfile(name);
      updateName(name);
      setMessage('Profile name updated successfully!');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setEditLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!oldPassword || !newPassword || !confirmNewPassword) {
      setError('Please fill in all password fields');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }

    setPasswordLoading(true);
    try {
      await authAPI.changePassword({ oldPassword, newPassword });
      setMessage('Password updated successfully!');
      setOldPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 transition-colors duration-300">
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
        Account Profile
      </h1>
      
      {message && (
        <div className="mt-4 rounded-xl bg-green-50 p-4 text-sm font-semibold text-green-600 dark:bg-green-950/20 dark:text-green-400">
          {message}
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-600 dark:bg-red-950/20 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="mt-8 grid gap-8 md:grid-cols-12">
        {/* Left Column */}
        <div className="space-y-6 md:col-span-4">
          <div className="rounded-2xl border border-slate-200/50 bg-white p-6 text-center shadow-sm dark:border-slate-800/50 dark:bg-slate-900">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-500/10 text-amber-500 dark:bg-amber-500/20">
              <User className="h-10 w-10" />
            </div>
            <h2 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">{user?.name}</h2>
            <p className="text-xs text-slate-400 mt-1">{user?.email}</p>
            
            <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-2xs font-semibold uppercase tracking-wider text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              <Shield className="h-3 w-3" />
              <span>{user?.role?.replace('ROLE_', '')}</span>
            </div>

            <hr className="my-6 border-slate-200/50 dark:border-slate-800" />

            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-950">
                <span className="block text-xl font-extrabold text-slate-900 dark:text-white">
                  {profileData?.uploadedRecipesCount || 0}
                </span>
                <span className="text-3xs uppercase tracking-wider font-semibold text-slate-400">Uploaded</span>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-950">
                <span className="block text-xl font-extrabold text-slate-900 dark:text-white">
                  {profileData?.favoriteRecipesCount || 0}
                </span>
                <span className="text-3xs uppercase tracking-wider font-semibold text-slate-400">Favorites</span>
              </div>
            </div>

            <button
              onClick={logout}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50/50 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-100 dark:border-red-950 dark:bg-red-950/20 dark:text-red-400 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6 md:col-span-8">
          <div className="rounded-2xl border border-slate-200/50 bg-white p-6 shadow-sm dark:border-slate-800/50 dark:bg-slate-900">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Profile Details</h3>
            <form onSubmit={handleUpdateName} className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
                <div className="relative mt-2 rounded-xl shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <User className="h-4.5 w-4.5" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
                <div className="relative mt-2 rounded-xl shadow-sm opacity-60">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Mail className="h-4.5 w-4.5" />
                  </div>
                  <input
                    type="email"
                    disabled
                    value={user?.email}
                    className="block w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 py-2.5 pl-10 pr-3 text-sm text-slate-900 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={editLoading}
                className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-amber-500/10 hover:bg-amber-600 transition-colors"
              >
                {editLoading && <RefreshCw className="h-4 w-4 animate-spin" />}
                Save Changes
              </button>
            </form>
          </div>

          <div className="rounded-2xl border border-slate-200/50 bg-white p-6 shadow-sm dark:border-slate-800/50 dark:bg-slate-900">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Security & Password</h3>
            <form onSubmit={handleChangePassword} className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-350">Current Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="mt-2 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-350">New Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="mt-2 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-355">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="mt-2 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={passwordLoading}
                className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-amber-500/10 hover:bg-amber-600 transition-colors"
              >
                {passwordLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
                Change Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
