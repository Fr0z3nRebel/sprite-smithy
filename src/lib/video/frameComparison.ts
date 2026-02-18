import { resizeImageData } from '@/lib/processing/canvasUtils';

const DEFAULT_MAX_SIZE = 64;

/**
 * Downsample ImageData to a square of at most maxSize for fast comparison.
 * Both dimensions are scaled so the longer side is maxSize.
 */
export function imageDataAtSize(
  imageData: ImageData,
  maxSize: number = DEFAULT_MAX_SIZE
): ImageData {
  const { width, height } = imageData;
  if (width <= maxSize && height <= maxSize) {
    return imageData;
  }
  const scale = maxSize / Math.max(width, height);
  const w = Math.max(1, Math.round(width * scale));
  const h = Math.max(1, Math.round(height * scale));
  return resizeImageData(imageData, w, h);
}

/** Luminance coefficients (Rec. 601) */
const LUM_R = 0.299;
const LUM_G = 0.587;
const LUM_B = 0.114;

function luminanceAt(data: Uint8ClampedArray, i: number): number {
  return LUM_R * data[i]! + LUM_G * data[i + 1]! + LUM_B * data[i + 2]!;
}

/**
 * Compare two ImageData buffers. Returns 0 for exact match, positive value for
 * difference (lower = more similar). Optionally downsamples and/or uses
 * luminance-only comparison (more robust to color/compression noise).
 */
export function compareFrames(
  a: ImageData,
  b: ImageData,
  options?: { maxSize?: number; useLuminance?: boolean }
): number {
  const maxSize = options?.maxSize ?? DEFAULT_MAX_SIZE;
  const useLuminance = options?.useLuminance ?? false;
  const aSmall = imageDataAtSize(a, maxSize);
  const bSmall = imageDataAtSize(b, maxSize);

  const aw = aSmall.width;
  const ah = aSmall.height;
  const bw = bSmall.width;
  const bh = bSmall.height;

  if (aw !== bw || ah !== bh) {
    return Number.MAX_VALUE;
  }

  const dataA = aSmall.data;
  const dataB = bSmall.data;
  const pixelCount = (dataA.length / 4) | 0;

  if (pixelCount === 0) return 0;

  if (useLuminance) {
    let sad = 0;
    for (let i = 0; i < dataA.length; i += 4) {
      sad += Math.abs(
        luminanceAt(dataA, i) - luminanceAt(dataB, i)
      );
    }
    return sad / pixelCount;
  }

  let sad = 0;
  for (let i = 0; i < dataA.length; i++) {
    sad += Math.abs(dataA[i]! - dataB[i]!);
  }
  return sad / pixelCount;
}
