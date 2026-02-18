export interface ExportSettings {
  includeSpriteSheet: boolean;
  includeFrames: boolean;
  includeMetadata: boolean;
  /** When true (default), include sprite-sheet.json (PixiJS/Phaser hash format) with metadata. */
  includeHashSpriteSheet: boolean;
  includeGif: boolean;
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

/** PixiJS/Phaser hash format: frame key → frame data */
export interface HashSpriteSheetFrame {
  frame: { x: number; y: number; w: number; h: number };
  rotated: boolean;
  trimmed: boolean;
  spriteSourceSize: { x: number; y: number; w: number; h: number };
  sourceSize: { w: number; h: number };
}

export interface HashSpriteSheetMeta {
  image: string;
  size: { w: number; h: number };
  version: string;
}

export interface HashSpriteSheetMetadata {
  frames: Record<string, HashSpriteSheetFrame>;
  meta: HashSpriteSheetMeta;
}
