'use client';

import { useUser } from './useUser';

export function useOnboarding() {
  const { profile, updateProfile } = useUser();

  const completeOnboarding = async () => {
    await updateProfile({ has_completed_onboarding: true });
  };

  return {
    hasCompletedOnboarding: profile?.has_completed_onboarding || false,
    completeOnboarding,
  };
}
