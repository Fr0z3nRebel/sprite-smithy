'use client';

import { useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { usePurchase } from './usePurchase';
import { useStore } from '@/store';

export function useUsage() {
  const { user } = useAuth();
  const { isPro } = usePurchase();

  const usage = useStore((state) => state.usage);
  const isLoading = useStore((state) => state.usageLoading);

  // Load usage on mount
  useEffect(() => {
    // Don't fetch if: no user, already have data, or currently loading
    if (!user || usage !== null || isLoading) {
      return;
    }

    // Check loading state again to prevent race conditions
    const { usageLoading, setUsage, setUsageLoading, setUsageError } = useStore.getState();
    if (usageLoading) {
      return;
    }

    const fetchUsage = async () => {
      // Pro users don't need usage tracking
      if (isPro) {
        setUsage({
          video_count: 0,
          limit: -1, // unlimited
          has_reached_limit: false,
          next_reset_date: new Date(),
          days_until_reset: 0,
        });
        return;
      }

      try {
        setUsageLoading(true);
        const response = await fetch('/api/usage/check');

        if (!response.ok) {
          throw new Error('Failed to fetch usage');
        }

        const data = await response.json();
        setUsage({
          ...data,
          next_reset_date: new Date(data.next_reset_date),
        });
      } catch (err) {
        setUsageError(err instanceof Error ? err.message : 'Failed to fetch usage');
      } finally {
        setUsageLoading(false);
      }
    };

    fetchUsage();
  }, [user, isPro, usage, isLoading]);

  // Increment usage after export
  const incrementUsage = useCallback(async () => {
    if (!user || isPro) return;

    const { setUsage, setUsageError } = useStore.getState();

    try {
      const response = await fetch('/api/usage/increment', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to increment usage');
      }

      const data = await response.json();

      // Update store state
      const currentUsage = useStore.getState().usage;
      if (currentUsage) {
        setUsage({
          ...currentUsage,
          video_count: data.video_count,
          has_reached_limit: data.has_reached_limit,
        });
      }

      return data;
    } catch (err) {
      setUsageError(err instanceof Error ? err.message : 'Failed to increment usage');
      throw err;
    }
  }, [user, isPro]);

  return {
    usage,
    isLoading,
    incrementUsage,
    hasReachedLimit: usage?.has_reached_limit ?? false,
    remainingVideos: usage ? Math.max(0, usage.limit - usage.video_count) : 0,
  };
}
