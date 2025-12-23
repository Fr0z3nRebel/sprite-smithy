'use client';

import { useEffect, useMemo } from 'react';
import { useStore } from '@/store';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from './useAuth';

/**
 * Hook to fetch and manage user profile data
 */
export function useUser() {
  const { user } = useAuth();
  const { profile, setProfile } = useStore();
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      return;
    }

    // Fetch user profile
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!error && data) {
        setProfile(data);
      }
    };

    fetchProfile();
  }, [user, supabase, setProfile]);

  const updateProfile = async (updates: {
    full_name?: string;
    avatar_url?: string;
    has_completed_onboarding?: boolean;
  }) => {
    if (!user) return { error: new Error('No user logged in') };

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (!error && data) {
      setProfile(data);
    }

    return { data, error };
  };

  return {
    profile,
    isLoading: !user || !profile,
    updateProfile,
  };
}
