export interface VideoMetadata {
  fps: number;
  duration: number;
  totalFrames: number;
  width: number;
  height: number;
}

export interface VideoState {
  file: File | null;
  url: string | null;
  metadata: VideoMetadata | null;
}

export interface LoopSelection {
  startFrame: number;
  endFrame: number;
  selectedFrames: number[];
}
