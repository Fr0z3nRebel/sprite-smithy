import { RGB } from '@/types/processing';
import { calculateColorDistance, normalizeColorDistance } from '@/utils/color';

/**
 * Apply chroma key (background removal) to an image
 * This algorithm is deterministic - same inputs always produce the same output
 *
 * @param imageData - Source image data
 * @param keyColor - Color to remove (e.g., green screen)
 * @param threshold - Color distance threshold (0-1). Pixels closer than this become transparent
 * @param feathering - Soft edge range (0-1). Creates gradual transparency near threshold
 * @returns New ImageData with transparency applied
 */
export function applyChromaKey(
  imageData: ImageData,
  keyColor: RGB,
  threshold: number,
  feathering: number
): ImageData {
  const { data, width, height } = imageData;
  const output = new ImageData(width, height);

  // Copy all data first
  output.data.set(data);

  // Process each pixel
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const originalAlpha = data[i + 3];

    // Calculate color distance from key color
    const distance = calculateColorDistance({ r, g, b }, keyColor);
    const normalizedDistance = normalizeColorDistance(distance);

    // Calculate alpha based on threshold and feathering
    let alpha = originalAlpha;

    if (normalizedDistance < threshold) {
      // Within threshold - apply transparency
      if (feathering > 0 && normalizedDistance > threshold - feathering) {
        // Soft edge - gradual transparency
        const featherRatio =
          (normalizedDistance - (threshold - feathering)) / feathering;
        // Use Math.round for determinism
        alpha = Math.round(featherRatio * originalAlpha);
      } else {
        // Fully transparent
        alpha = 0;
      }
    }

    // Set the alpha value
    output.data[i + 3] = alpha;
  }

  return output;
}

/**
 * Apply chroma key to multiple frames
 * Processes frames in batches for better performance
 */
export async function applyChromaKeyBatch(
  frames: ImageData[],
  keyColor: RGB,
  threshold: number,
  feathering: number,
  onProgress?: (progress: number) => void
): Promise<ImageData[]> {
  const results: ImageData[] = [];
  const batchSize = 10;

  for (let i = 0; i < frames.length; i += batchSize) {
    const batch = frames.slice(i, Math.min(i + batchSize, frames.length));

    // Process batch
    const processedBatch = batch.map((frame) =>
      applyChromaKey(frame, keyColor, threshold, feathering)
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
 * Preview chroma key on a single frame
 * Useful for real-time adjustment of settings
 */
export function previewChromaKey(
  frame: ImageData,
  keyColor: RGB,
  threshold: number,
  feathering: number
): ImageData {
  return applyChromaKey(frame, keyColor, threshold, feathering);
}

/**
 * Auto-detect the most common background color in a frame
 * Useful for suggesting a chroma key color
 */
export function detectBackgroundColor(imageData: ImageData): RGB {
  const { data, width, height } = imageData;
  const colorCounts = new Map<string, { color: RGB; count: number }>();

  // Sample edge pixels (likely to be background)
  const edgePixels: Array<{ x: number; y: number }> = [];

  // Top and bottom edges
  for (let x = 0; x < width; x += 4) {
    edgePixels.push({ x, y: 0 });
    edgePixels.push({ x, y: height - 1 });
  }

  // Left and right edges
  for (let y = 0; y < height; y += 4) {
    edgePixels.push({ x: 0, y });
    edgePixels.push({ x: width - 1, y });
  }

  // Count edge colors
  for (const { x, y } of edgePixels) {
    const index = (y * width + x) * 4;
    const r = Math.round(data[index] / 16) * 16; // Quantize for grouping
    const g = Math.round(data[index + 1] / 16) * 16;
    const b = Math.round(data[index + 2] / 16) * 16;

    const key = `${r},${g},${b}`;
    const existing = colorCounts.get(key);

    if (existing) {
      existing.count++;
    } else {
      colorCounts.set(key, { color: { r, g, b }, count: 1 });
    }
  }

  // Find most common color
  let maxCount = 0;
  let mostCommonColor: RGB = { r: 0, g: 255, b: 0 }; // Default to green

  for (const { color, count } of colorCounts.values()) {
    if (count > maxCount) {
      maxCount = count;
      mostCommonColor = color;
    }
  }

  return mostCommonColor;
}
