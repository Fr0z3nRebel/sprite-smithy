// Maximum video file size (100MB)
export const MAX_VIDEO_SIZE = 100 * 1024 * 1024;

// Maximum video duration (10 seconds)
export const MAX_VIDEO_DURATION = 10;

// Supported video formats
export const SUPPORTED_VIDEO_FORMATS = [
  'video/mp4',
  'video/webm',
  'video/quicktime',
];

// Supported video extensions
export const SUPPORTED_VIDEO_EXTENSIONS = ['.mp4', '.webm', '.mov'];

// Frame size presets
export const FRAME_SIZE_PRESETS = [16, 24, 32, 48, 64, 96, 128, 256, 512];

// Default processing values
export const DEFAULT_CHROMA_THRESHOLD = 0.3;
export const DEFAULT_CHROMA_FEATHERING = 0.1;
export const DEFAULT_HALO_STRENGTH = 1;

// Export settings
export const SPRITE_SHEET_METADATA_VERSION = '1.0';
export const GENERATOR_NAME = 'Sprite Smithy';

// Batch processing settings
export const BATCH_SIZE = 50;
export const PROGRESS_UPDATE_INTERVAL = 100;
