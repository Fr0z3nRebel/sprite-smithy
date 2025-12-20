export interface ExportSettings {
  includeSpriteSheet: boolean;
  includeFrames: boolean;
  includeMetadata: boolean;
  format: 'png' | 'webp';
}

export interface SpriteSheetMetadata {
  version: string;
  generator: string;
  timestamp: string;
  video: {
    originalFPS: number;
    originalDimensions: {
      width: number;
      height: number;
    };
  };
  frames: {
    count: number;
    size: number;
  };
  processing: {
    chromaKey: {
      color: { r: number; g: number; b: number };
      threshold: number;
      feathering: number;
    };
    sizing: {
      targetSize: number;
      paddingReduction: number;
      anchor: string;
    };
    haloRemoval: {
      strength: number;
    };
  };
  spriteSheet: {
    columns: number;
    rows: number;
  };
}
