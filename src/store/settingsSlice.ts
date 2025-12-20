import { StateCreator } from 'zustand';
import { ProcessingSettings, ChromaKeySettings, SizingSettings, HaloRemovalSettings } from '@/types/processing';

export interface SettingsSlice {
  settings: ProcessingSettings;
  setChromaKeySettings: (settings: Partial<ChromaKeySettings>) => void;
  setSizingSettings: (settings: Partial<SizingSettings>) => void;
  setHaloRemovalSettings: (settings: Partial<HaloRemovalSettings>) => void;
  resetSettings: () => void;
}

const initialSettings: ProcessingSettings = {
  chromaKey: {
    color: { r: 0, g: 255, b: 0 }, // Default to green screen
    threshold: 0.3,
    feathering: 0.1,
  },
  sizing: {
    targetSize: 64,
    paddingReduction: 0,
    anchor: 'center-bottom',
  },
  haloRemoval: {
    strength: 1,
  },
};

export const createSettingsSlice: StateCreator<SettingsSlice> = (set) => ({
  settings: initialSettings,

  setChromaKeySettings: (newSettings) =>
    set((state) => ({
      settings: {
        ...state.settings,
        chromaKey: { ...state.settings.chromaKey, ...newSettings },
      },
    })),

  setSizingSettings: (newSettings) =>
    set((state) => ({
      settings: {
        ...state.settings,
        sizing: { ...state.settings.sizing, ...newSettings },
      },
    })),

  setHaloRemovalSettings: (newSettings) =>
    set((state) => ({
      settings: {
        ...state.settings,
        haloRemoval: { ...state.settings.haloRemoval, ...newSettings },
      },
    })),

  resetSettings: () =>
    set({
      settings: initialSettings,
    }),
});
