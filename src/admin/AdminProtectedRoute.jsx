import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from './AdminAuthContext';

export default function AdminProtectedRoute({ children }) {
  const { adminUser, adminProfile, loading, isAdmin } = useAdminAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f2b48] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#16a34a] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white text-sm font-medium">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!adminUser) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#0f2b48] flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">Your account does not have admin privileges. Please contact the system administrator.</p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-[#0f2b48] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[#1a3d60] transition-colors"
          >
            Back to Website
          </button>
        </div>
      </div>
    );
  }

  return children;
}
