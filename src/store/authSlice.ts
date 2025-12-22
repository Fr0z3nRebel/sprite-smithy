import { StateCreator } from 'zustand';
import { User, Session } from '@supabase/supabase-js';
import { UserProfile } from '@/types/auth';

export interface AuthSlice {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isLoading: boolean;
  setAuth: (user: User | null, session: Session | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  setLoading: (isLoading: boolean) => void;
  clearAuth: () => void;
}

const initialAuthState = {
  user: null,
  session: null,
  profile: null,
  isLoading: true,
};

export const createAuthSlice: StateCreator<AuthSlice> = (set) => ({
  ...initialAuthState,

  setAuth: (user, session) =>
    set({
      user,
      session,
      isLoading: false,
    }),

  setProfile: (profile) =>
    set({
      profile,
    }),

  setLoading: (isLoading) =>
    set({
      isLoading,
    }),

  clearAuth: () =>
    set({
      ...initialAuthState,
      isLoading: false,
    }),
});
