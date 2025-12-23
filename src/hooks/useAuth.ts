'use client';

import { useEffect, useMemo } from 'react';
import { useStore } from '@/store';
import { createClient } from '@/lib/supabase/client';

/**
 * Hook to manage authentication state
 * Initializes auth state from Supabase and listens for changes
 */
export function useAuth() {
  const { user, session, setAuth, clearAuth, setLoading } = useStore();
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    // Get initial session
    setLoading(true);
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuth(session?.user ?? null, session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuth(session?.user ?? null, session);
    });

    return () => subscription.unsubscribe();
  }, [supabase, setAuth, setLoading]);

  const signOut = async () => {
    await supabase.auth.signOut();
    clearAuth();
  };

  return {
    user,
    session,
    isAuthenticated: !!session,
    isLoading: useStore((state) => state.isLoading),
    signOut,
  };
}
