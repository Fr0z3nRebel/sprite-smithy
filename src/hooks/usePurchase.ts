'use client';

import { useEffect, useMemo } from 'react';
import { useStore } from '@/store';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from './useAuth';

/**
 * Hook to fetch and manage purchase/tier data
 */
export function usePurchase() {
  const { user } = useAuth();
  const { purchase, tier, isPro, isLoading, setPurchase, setLoading } = useStore();
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    if (!user) {
      setPurchase(null);
      setLoading(false);
      return;
    }

    // Don't fetch if purchase already exists for this user
    if (purchase?.user_id === user.id) {
      return;
    }

    // Check store state directly to prevent race conditions from multiple components
    const storeState = useStore.getState();
    if (storeState.isLoading || storeState.purchase?.user_id === user.id) {
      return;
    }

    // Fetch purchase data
    const fetchPurchase = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('purchases')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!error && data) {
        setPurchase(data);
      }
      setLoading(false);
    };

    fetchPurchase();
  }, [user?.id, purchase?.user_id, supabase, setPurchase, setLoading]);

  const refreshPurchase = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('purchases')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (data) {
      setPurchase(data);
    }
  };

  return {
    purchase,
    tier,
    isPro,
    isFree: tier === 'free',
    isLoading: useStore((state) => state.isLoading),
    refreshPurchase,
  };
}
