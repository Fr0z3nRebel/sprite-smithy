'use client';

import { useEffect } from 'react';
import { useStore } from '@/store';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from './useAuth';

/**
 * Hook to fetch and manage purchase/tier data
 */
export function usePurchase() {
  const { user } = useAuth();
  const { purchase, tier, isPro, setPurchase, setLoading } = useStore();
  const supabase = createClient();

  useEffect(() => {
    if (!user) {
      setPurchase(null);
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
      } else {
        setLoading(false);
      }
    };

    fetchPurchase();
  }, [user, supabase, setPurchase, setLoading]);

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
