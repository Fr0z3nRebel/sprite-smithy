import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { VideoSlice, createVideoSlice } from './videoSlice';
import { FramesSlice, createFramesSlice } from './framesSlice';
import { SettingsSlice, createSettingsSlice } from './settingsSlice';
import { ExportSlice, createExportSlice } from './exportSlice';
import { LicenseSlice, createLicenseSlice } from './licenseSlice';
import { AuthSlice, createAuthSlice } from './authSlice';
import { PurchaseSlice, createPurchaseSlice } from './purchaseSlice';
import { UsageSlice, createUsageSlice } from './usageSlice';

// UI state slice
export interface UIState {
  currentStep: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  isProcessing: boolean;
  progress: number;
  error: string | null;
  showChangelog: boolean;
  setCurrentStep: (step: UIState['currentStep']) => void;
  setProcessing: (isProcessing: boolean) => void;
  setProgress: (progress: number) => void;
  setError: (error: string | null) => void;
  setShowChangelog: (show: boolean) => void;
  resetUI: () => void;
}

const initialUIState = {
  currentStep: 1 as const,
  isProcessing: false,
  progress: 0,
  error: null,
  showChangelog: false,
};

// Combined store type
export type AppStore = VideoSlice &
  FramesSlice &
  SettingsSlice &
  ExportSlice &
  LicenseSlice &
  AuthSlice &
  PurchaseSlice &
  UsageSlice &
  UIState;

export const useStore = create<AppStore>()(
  persist(
    (set, get, api) => ({
      // Video slice
      ...createVideoSlice(set, get, api),

      // Frames slice
      ...createFramesSlice(set, get, api),

      // Settings slice
      ...createSettingsSlice(set, get, api),

      // Export slice
      ...createExportSlice(set, get, api),

      // License slice (deprecated, will be removed after migration)
      ...createLicenseSlice(set, get, api),

      // Auth slice
      ...createAuthSlice(set, get, api),

      // Purchase slice
      ...createPurchaseSlice(set, get, api),

      // Usage slice
      ...createUsageSlice(set, get, api),

      // UI state
      ...initialUIState,

      setCurrentStep: (step) => set({ currentStep: step }),

      setProcessing: (isProcessing) => set({ isProcessing }),

      setProgress: (progress) => set({ progress }),

      setError: (error) => set({ error }),

      setShowChangelog: (show) => set({ showChangelog: show }),

      resetUI: () => set(initialUIState),
    }),
    {
      name: 'sprite-smithy-storage',
      // Only persist certain parts of the state
      partialize: (state) => ({
        license: state.license,
        settings: state.settings,
        exportSettings: state.exportSettings,
      }),
    }
  )
);
