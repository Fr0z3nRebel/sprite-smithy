import { StateCreator } from 'zustand';
import { Purchase, Tier } from '@/types/purchase';

export interface PurchaseSlice {
  purchase: Purchase | null;
  tier: Tier;
  isPro: boolean;
  isLoading: boolean;
  setPurchase: (purchase: Purchase | null) => void;
  setLoading: (isLoading: boolean) => void;
  clearPurchase: () => void;
}

const initialPurchaseState = {
  purchase: null,
  tier: 'free' as Tier,
  isPro: false,
  isLoading: true,
};

export const createPurchaseSlice: StateCreator<PurchaseSlice> = (set) => ({
  ...initialPurchaseState,

  setPurchase: (purchase) =>
    set({
      purchase,
      tier: purchase?.tier || 'free',
      isPro: purchase?.tier === 'paid',
      isLoading: false,
    }),

  setLoading: (isLoading) =>
    set({
      isLoading,
    }),

  clearPurchase: () =>
    set({
      ...initialPurchaseState,
      isLoading: false,
    }),
});
