import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from './supabase';

const AuthContext = createContext(null);

// Wrap any promise with a timeout to prevent infinite hangs
function withTimeout(promise, ms, label) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(label + ' timed out after ' + ms + 'ms')), ms)
    ),
  ]);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile from profiles table
  async function fetchProfile(userId) {
    try {
      const { data, error } = await withTimeout(
        supabase.from('profiles').select('*').eq('id', userId).single(),
        8000,
        'fetchProfile'
      );
      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
      return data;
    } catch (err) {
      console.error('fetchProfile failed:', err);
      return null;
    }
  }

  useEffect(() => {
    // Check current session on mount
    withTimeout(supabase.auth.getSession(), 8000, 'getSession')
      .then(async ({ data: { session } }) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          const p = await fetchProfile(session.user.id);
          setProfile(p);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('getSession error:', err);
        // Clear potentially corrupted auth state
        try {
          Object.keys(localStorage).forEach(k => {
            if (k.startsWith('sb-') && k.endsWith('-auth-token')) {
              localStorage.removeItem(k);
            }
          });
        } catch (e) { /* ignore */ }
        setUser(null);
        setProfile(null);
        setLoading(false);
      });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          try {
            const p = await fetchProfile(session.user.id);
            setProfile(p);
          } catch (err) {
            console.error('Auth state profile fetch error:', err);
          }
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Sign up with email/password + profile data
  async function signUp({ email, password, fullName, companyName, jobTitle, revenueBand }) {
    try {
      const { data, error } = await withTimeout(
        supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              company_name: companyName,
              job_title: jobTitle,
              revenue_band: revenueBand
            }
          }
        }),
        15000,
        'signUp'
      );

      if (error) return { error };

      // Profile auto-created by DB trigger with all metadata fields
      if (data.user) {
      // Check approval_mode and default_tier from app_config
      let autoApprove = true;
      let defaultTier = 'free';
      try {
        const { data: configRows } = await supabase.from('app_config').select('key, value');
        if (configRows) {
          const configMap = {};
          configRows.forEach(r => { configMap[r.key] = r.value; });
          if (configMap.approval_mode === 'manual') autoApprove = false;
          if (configMap.default_tier === 'premium') defaultTier = 'premium';
        }
      } catch (e) {
        console.warn('Could not read app_config, using defaults:', e);
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          email: email,
          full_name: fullName,
          company_name: companyName,
          job_title: jobTitle,
          revenue_band: revenueBand,
          role: 'user',
          approved: autoApprove,
          tier: defaultTier,
        });

      if (profileError) {
        console.error('Error creating profile:', profileError);
      }

        const p = await fetchProfile(data.user.id);
        setProfile(p);
      }

      return { data };
    } catch (err) {
      console.error('Sign up error:', err);
      return { error: { message: err.message || 'An unexpected error occurred. Please try again.' } };
    }
  }

  // Sign in with email/password
  async function signIn({ email, password }) {
    try {
      const { data, error } = await withTimeout(
        supabase.auth.signInWithPassword({
          email,
          password,
        }),
        15000,
        'signIn'
      );

      if (error) return { error };

      // Check approval status
      if (data.user) {
        const p = await fetchProfile(data.user.id);
        setProfile(p);

        if (p && !p.approved) {
          await supabase.auth.signOut();
          return { error: { message: 'Your account is pending approval. Please check back later.' } };
        }
      }

      return { data };
    } catch (err) {
      console.error('Sign in error:', err);
      return { error: { message: err.message || 'An unexpected error occurred. Please try again.' } };
    }
  }

  // Sign out
  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  }

  // Reset password
  async function resetPassword(email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/maturity-framework/login`,
    });
    return { error };
  }

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    isAdmin: profile?.role === 'admin',
    isPremium: profile?.tier === 'premium',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
