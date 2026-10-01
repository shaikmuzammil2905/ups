import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Eye, EyeOff, Zap, Lock, Mail, AlertCircle, Loader } from 'lucide-react';
import { useAdminAuth } from './AdminAuthContext';

export default function AdminLogin() {
  const { adminUser, isAdmin, adminLogin, loading } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // If already logged in as admin, redirect
  if (!loading && adminUser && isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    try {
      await adminLogin(email.trim(), password);
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1f35] via-[#0f2b48] to-[#1a3d60] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />

      {/* Glowing orbs */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-[#16a34a] rounded-full opacity-10 blur-3xl" />
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-500 rounded-full opacity-10 blur-3xl" />

      <div className="w-full max-w-md relative z-10">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0f2b48] to-[#1a3d60] p-8 text-center">
            {/* Logo */}
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#16a34a] rounded-xl flex items-center justify-center shadow-lg">
                <Zap className="w-7 h-7 text-white fill-white" />
              </div>
              <div className="text-left">
                <div className="text-white font-black text-xl leading-none">LIVKAM</div>
                <div className="text-[#4ade80] text-xs font-semibold tracking-widest">POWER TECHNOLOGIES</div>
              </div>
            </div>
            <div className="border-t border-white/10 pt-4">
              <h1 className="text-white font-bold text-xl">Admin Portal</h1>
              <p className="text-slate-400 text-sm mt-1">Authorized Personnel Only</p>
            </div>
          </div>

          {/* Form */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Error */}
              {error && (
                <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {/* Email */}
              <div>
                <label htmlFor="admin-email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                  <input
                    id="admin-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@livkampower.in"
                    autoComplete="email"
                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#16a34a] focus:ring-2 focus:ring-[#16a34a]/20 transition-all text-gray-900 placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="admin-password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                  <input
                    id="admin-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="w-full pl-11 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#16a34a] focus:ring-2 focus:ring-[#16a34a]/20 transition-all text-gray-900 placeholder-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
              </div>

              {/* Forgot Password */}
              <div className="text-right">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (email) {
                      import('../lib/supabase').then(({ supabase }) => {
                        supabase.auth.resetPasswordForEmail(email, {
                          redirectTo: `${window.location.origin}/admin/reset-password`,
                        }).then(() => {
                          alert('Password reset email sent! Check your inbox.');
                        });
                      });
                    } else {
                      alert('Please enter your email address first.');
                    }
                  }}
                  className="text-sm text-[#16a34a] hover:underline font-medium"
                >
                  Forgot Password?
                </a>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#16a34a] to-[#15803d] text-white font-bold py-3.5 px-6 rounded-xl hover:from-[#15803d] hover:to-[#166534] transition-all shadow-lg shadow-green-500/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4.5 h-4.5" />
                    <span>LOGIN TO ADMIN</span>
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-6 pt-6 border-t border-gray-100 text-center">
              <a
                href="/"
                className="text-sm text-gray-500 hover:text-[#0f2b48] transition-colors font-medium"
              >
                ← Back to Livkam Website
              </a>
            </div>

            {/* Security Notice */}
            <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3 text-center">
              <p className="text-amber-700 text-xs">
                🔒 This portal is for authorized administrators only. Unauthorized access attempts are logged.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom text */}
        <p className="text-center text-slate-400 text-xs mt-6">
          © 2026 Livkam Power Technologies. Admin System v2.0
        </p>
      </div>
    </div>
  );
}
