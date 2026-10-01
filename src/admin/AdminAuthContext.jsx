import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [adminUser, setAdminUser] = useState(null);
  const [adminProfile, setAdminProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchAdminProfile(session.user);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchAdminProfile(session.user);
      } else {
        setAdminUser(null);
        setAdminProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchAdminProfile = async (user) => {
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        // Profile doesn't exist yet, create it
        if (profileError.code === 'PGRST116') {
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert({ id: user.id, email: user.email, role: 'customer' })
            .select()
            .single();
          
          if (!createError && newProfile) {
            setAdminUser(user);
            setAdminProfile(newProfile);
          }
        }
      } else if (profile) {
        setAdminUser(user);
        setAdminProfile(profile);
      }
    } catch (err) {
      console.error('Error fetching admin profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const adminLogin = async (email, password) => {
    setError(null);
    setLoading(true);
    
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setLoading(false);
        if (authError.message.includes('Invalid login credentials')) {
          throw new Error('Invalid email or password. Please try again.');
        }
        if (authError.message.includes('Email not confirmed')) {
          throw new Error('Please verify your email before logging in.');
        }
        throw new Error('Login failed. Please try again.');
      }

      // Profile will be fetched via onAuthStateChange
      return { success: true };
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const adminLogout = async () => {
    await supabase.auth.signOut();
    setAdminUser(null);
    setAdminProfile(null);
  };

  const isAdmin = adminProfile?.role === 'admin';

  return (
    <AdminAuthContext.Provider value={{
      adminUser,
      adminProfile,
      loading,
      error,
      isAdmin,
      adminLogin,
      adminLogout,
    }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
}
