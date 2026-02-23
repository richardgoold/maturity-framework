import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from './supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);
  const realtimeChannelRef = useRef(null);

  // Fetch user profile from profiles table
  async function fetchProfile(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    return data;
  }

  // Manual refresh function exposed to consumers
  const refreshProfile = useCallback(async () => {
    if (user?.id) {
      const p = await fetchProfile(user.id);
      if (p) setProfile(p);
      return p;
    }
    return null;
  }, [user]);

  // Subscribe to real-time profile changes for the current user
  function subscribeToProfileChanges(userId) {
    // Unsubscribe from any existing channel
    if (realtimeChannelRef.current) {
      supabase.removeChannel(realtimeChannelRef.current);
      realtimeChannelRef.current = null;
    }

    const channel = supabase
      .channel(`profile-changes-${userId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'profiles',
        filter: `id=eq.${userId}`,
      }, (payload) => {
        console.log('Profile updated via realtime:', payload.new?.tier);
        setProfile(payload.new);
      })
      .subscribe();

    realtimeChannelRef.current = channel;
  }

  useEffect(() => {
    // Check current session on mount
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        const p = await fetchProfile(session.user.id);
        setProfile(p);
        subscribeToProfileChanges(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'PASSWORD_RECOVERY') {
          setIsPasswordRecovery(true);
        }
        setUser(session?.user ?? null);
        if (session?.user) {
          const p = await fetchProfile(session.user.id);
          setProfile(p);
          subscribeToProfileChanges(session.user.id);
        } else {
          setProfile(null);
          // Clean up realtime subscription on logout
          if (realtimeChannelRef.current) {
            supabase.removeChannel(realtimeChannelRef.current);
            realtimeChannelRef.current = null;
          }
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
      if (realtimeChannelRef.current) {
        supabase.removeChannel(realtimeChannelRef.current);
      }
    };
  }, []);

  // Sign up with email/password + profile data
  async function signUp({ email, password, fullName, companyName, jobTitle, revenueBand }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) return { error };

    // Insert profile row
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
        return { error: profileError };
      }

      // Fetch the profile we just created
      const p = await fetchProfile(data.user.id);
      setProfile(p);
    }

    return { data };
  }

  // Sign in with email/password
  async function signIn({ email, password }) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

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
      redirectTo: `${window.location.origin}/login`,
    });
    return { error };
  }

  // Update password (used after password recovery)
  async function updatePassword(newPassword) {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (!error) {
      setIsPasswordRecovery(false);
    }
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
    updatePassword,
    refreshProfile,
    isPasswordRecovery,
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
