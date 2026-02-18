import { StateCreator } from 'zustand';
import { VideoState, LoopSelection } from '@/types/video';

export interface VideoSlice {
  video: VideoState;
  loop: LoopSelection;
  /** FPS chosen in Step 2 (Preview FPS); used for animated GIF export when set. */
  previewFps: number | null;
  setVideoFile: (file: File) => void;
  setVideoUrl: (url: string) => void;
  setVideoMetadata: (metadata: VideoState['metadata']) => void;
  setLoopSelection: (start: number, end: number) => void;
  setFrameSkip: (skip: number) => void;
  setSelectedFrames: (frames: number[]) => void;
  setPreviewFps: (fps: number | null) => void;
  resetVideo: () => void;
}

const initialVideoState: VideoState = {
  file: null,
  url: null,
  metadata: null,
};

const initialLoopSelection: LoopSelection = {
  startFrame: 0,
  endFrame: 0,
  frameSkip: 1,
  selectedFrames: [],
};

export const createVideoSlice: StateCreator<VideoSlice> = (set) => ({
  video: initialVideoState,
  loop: initialLoopSelection,
  previewFps: null,

  setVideoFile: (file) =>
    set((state) => ({
      video: { ...state.video, file, url: URL.createObjectURL(file) },
    })),

  setVideoUrl: (url) =>
    set((state) => ({
      video: { ...state.video, url },
    })),

  setVideoMetadata: (metadata) =>
    set((state) => ({
      video: { ...state.video, metadata },
      loop: {
        ...state.loop,
        endFrame: metadata?.totalFrames || 0,
      },
    })),

  setLoopSelection: (start, end) =>
    set((state) => ({
      loop: { ...state.loop, startFrame: start, endFrame: end },
    })),

  setFrameSkip: (skip) =>
    set((state) => ({
      loop: { ...state.loop, frameSkip: skip },
    })),

  setSelectedFrames: (frames) =>
    set((state) => ({
      loop: { ...state.loop, selectedFrames: frames },
    })),

  setPreviewFps: (fps) => set({ previewFps: fps }),

  resetVideo: () =>
    set({
      video: initialVideoState,
      loop: initialLoopSelection,
      previewFps: null,
    }),
});
