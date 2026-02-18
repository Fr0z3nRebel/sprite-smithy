import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { VideoSlice, createVideoSlice } from './videoSlice';
import { FramesSlice, createFramesSlice } from './framesSlice';
import { SettingsSlice, createSettingsSlice } from './settingsSlice';
import {
  ExportSlice,
  createExportSlice,
  initialExportSettings,
} from './exportSlice';

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
      partialize: (state) => ({
        settings: state.settings,
        exportSettings: state.exportSettings,
      }),
      merge: (persistedState, currentState): AppStore => {
        const persisted = persistedState as
          | { settings?: AppStore['settings']; exportSettings?: Partial<typeof initialExportSettings> }
          | undefined;
        if (!persisted) return currentState;
        const merged: AppStore = {
          ...currentState,
          ...(persisted.settings !== undefined && { settings: persisted.settings }),
          ...(persisted.exportSettings !== undefined && {
            exportSettings: {
              ...initialExportSettings,
              ...persisted.exportSettings,
            },
          }),
        };
        return merged;
      },
    }
  )
);
