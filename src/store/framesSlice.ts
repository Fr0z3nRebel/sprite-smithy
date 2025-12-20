import { StateCreator } from 'zustand';
import { FramesState } from '@/types/frame';

export interface FramesSlice {
  frames: FramesState;
  setRawFrames: (frames: ImageData[]) => void;
  setProcessedFrames: (frames: ImageData[]) => void;
  setThumbnails: (thumbnails: string[]) => void;
  clearFrames: () => void;
}

const initialFramesState: FramesState = {
  raw: [],
  processed: [],
  thumbnails: [],
};

export const createFramesSlice: StateCreator<FramesSlice> = (set) => ({
  frames: initialFramesState,

  setRawFrames: (frames) =>
    set((state) => ({
      frames: { ...state.frames, raw: frames },
    })),

  setProcessedFrames: (frames) =>
    set((state) => ({
      frames: { ...state.frames, processed: frames },
    })),

  setThumbnails: (thumbnails) =>
    set((state) => ({
      frames: { ...state.frames, thumbnails },
    })),

  clearFrames: () =>
    set({
      frames: initialFramesState,
    }),
});
