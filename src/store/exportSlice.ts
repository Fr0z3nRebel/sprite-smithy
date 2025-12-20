import { StateCreator } from 'zustand';
import { ExportSettings } from '@/types/export';

export interface ExportSlice {
  exportSettings: ExportSettings;
  setExportSettings: (settings: Partial<ExportSettings>) => void;
  resetExportSettings: () => void;
}

const initialExportSettings: ExportSettings = {
  includeSpriteSheet: true,
  includeFrames: false,
  includeMetadata: true,
  format: 'png',
};

export const createExportSlice: StateCreator<ExportSlice> = (set) => ({
  exportSettings: initialExportSettings,

  setExportSettings: (newSettings) =>
    set((state) => ({
      exportSettings: { ...state.exportSettings, ...newSettings },
    })),

  resetExportSettings: () =>
    set({
      exportSettings: initialExportSettings,
    }),
});
