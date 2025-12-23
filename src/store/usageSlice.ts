import { StateCreator } from 'zustand';
import { UsageStatus } from '@/types/usage';

export interface UsageSlice {
  usage: UsageStatus | null;
  usageLoading: boolean;
  usageError: string | null;
  setUsage: (usage: UsageStatus | null) => void;
  setUsageLoading: (loading: boolean) => void;
  setUsageError: (error: string | null) => void;
  clearUsage: () => void;
}

export const createUsageSlice: StateCreator<UsageSlice> = (set) => ({
  usage: null,
  usageLoading: false,
  usageError: null,

  setUsage: (usage) => set({ usage, usageError: null }),

  setUsageLoading: (loading) => set({ usageLoading: loading }),

  setUsageError: (error) => set({ usageError: error }),

  clearUsage: () =>
    set({ usage: null, usageLoading: false, usageError: null }),
});
