export interface FramesState {
  raw: ImageData[];           // Original extracted frames
  processed: ImageData[];     // After all processing
  thumbnails: string[];       // Base64 for grid display
}

export interface BoundingBox {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
}
