import { BoundingBox } from '@/types/frame';
import { SizingSettings } from '@/types/processing';
import {
  imageDataToCanvas,
  canvasToImageData,
  createBlankImageData,
} from './canvasUtils';
import { detectBoundingBox, applyPaddingReduction } from './boundingBox';

/**
 * Normalize a single frame to target dimensions with specified alignment
 * This is deterministic - always produces the same output for the same inputs
 */
export function normalizeFrame(
  frame: ImageData,
  globalBox: BoundingBox,
  settings: SizingSettings
): ImageData {
  const { targetSize, paddingReduction, anchor } = settings;

  // Apply padding reduction to global box
  const adjustedBox = applyPaddingReduction(globalBox, paddingReduction);

  // Detect this frame's bounding box
  const frameBox = detectBoundingBox(frame);

  // Calculate scale to fit content in target size
  const scale = Math.min(
    targetSize / adjustedBox.width,
    targetSize / adjustedBox.height
  );

  // Calculate scaled dimensions
  const scaledWidth = Math.round(frameBox.width * scale);
  const scaledHeight = Math.round(frameBox.height * scale);

  // Create blank canvas of target size (transparent background)
  const output = createBlankImageData(targetSize, targetSize);
  const outputCanvas = imageDataToCanvas(output);
  const ctx = outputCanvas.getContext('2d', { willReadFrequently: true });

  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  // Calculate position based on anchor
  let x: number;
  let y: number;

  switch (anchor) {
    case 'center-bottom':
      // Center horizontally, align to bottom
      x = Math.round((targetSize - scaledWidth) / 2);
      y = targetSize - scaledHeight;
      break;

    case 'center':
      // Center both horizontally and vertically
      x = Math.round((targetSize - scaledWidth) / 2);
      y = Math.round((targetSize - scaledHeight) / 2);
      break;

    case 'top-left':
      // Align to top-left
      x = 0;
      y = 0;
      break;

    default:
      // Default to center-bottom
      x = Math.round((targetSize - scaledWidth) / 2);
      y = targetSize - scaledHeight;
  }

  // Create canvas from frame
  const frameCanvas = document.createElement('canvas');
  frameCanvas.width = frame.width;
  frameCanvas.height = frame.height;
  const frameCtx = frameCanvas.getContext('2d', { willReadFrequently: true });

  if (!frameCtx) {
    throw new Error('Failed to get frame canvas context');
  }

  frameCtx.putImageData(frame, 0, 0);

  // Draw cropped and scaled frame onto output canvas
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  ctx.drawImage(
    frameCanvas,
    frameBox.minX,
    frameBox.minY,
    frameBox.width,
    frameBox.height,
    x,
    y,
    scaledWidth,
    scaledHeight
  );

  return canvasToImageData(outputCanvas);
}

/**
 * Normalize all frames with progress tracking
 */
export async function normalizeFrames(
  frames: ImageData[],
  globalBox: BoundingBox,
  settings: SizingSettings,
  onProgress?: (progress: number) => void
): Promise<ImageData[]> {
  const results: ImageData[] = [];
  const batchSize = 10;

  for (let i = 0; i < frames.length; i += batchSize) {
    const batch = frames.slice(i, Math.min(i + batchSize, frames.length));

    // Process batch
    const processedBatch = batch.map((frame) =>
      normalizeFrame(frame, globalBox, settings)
    );

    results.push(...processedBatch);

    // Update progress
    if (onProgress) {
      const progress = Math.round(
        (Math.min(i + batchSize, frames.length) / frames.length) * 100
      );
      onProgress(progress);
    }

    // Allow UI to breathe
    await new Promise((resolve) => setTimeout(resolve, 0));
  }

  return results;
}

/**
 * Preview normalization on a single frame
 */
export function previewNormalization(
  frame: ImageData,
  globalBox: BoundingBox,
  settings: SizingSettings
): ImageData {
  return normalizeFrame(frame, globalBox, settings);
}

/**
 * Calculate what the output dimensions will be
 */
export function calculateNormalizedDimensions(
  globalBox: BoundingBox,
  targetSize: number,
  paddingReduction: number
): {
  scale: number;
  scaledWidth: number;
  scaledHeight: number;
} {
  const adjustedBox = applyPaddingReduction(globalBox, paddingReduction);

  const scale = Math.min(
    targetSize / adjustedBox.width,
    targetSize / adjustedBox.height
  );

  return {
    scale,
    scaledWidth: Math.round(adjustedBox.width * scale),
    scaledHeight: Math.round(adjustedBox.height * scale),
  };
}
