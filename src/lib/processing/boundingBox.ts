import { BoundingBox } from '@/types/frame';

/**
 * Detect bounding box for a single frame
 * Scans all pixels and finds min/max coordinates where alpha > threshold
 * This is deterministic - always returns the same result for the same input
 */
export function detectBoundingBox(
  imageData: ImageData,
  alphaThreshold: number = 10
): BoundingBox {
  const { data, width, height } = imageData;

  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;
  let hasOpaquePixels = false;

  // Scan all pixels
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = (y * width + x) * 4;
      const alpha = data[index + 3];

      // Check if pixel is opaque enough
      if (alpha > alphaThreshold) {
        hasOpaquePixels = true;
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }

  // If no opaque pixels found, return full image bounds
  if (!hasOpaquePixels) {
    return {
      minX: 0,
      minY: 0,
      maxX: width - 1,
      maxY: height - 1,
      width,
      height,
    };
  }

  return {
    minX,
    minY,
    maxX,
    maxY,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
  };
}

/**
 * Calculate global bounding box across all frames
 * Returns the maximum dimensions needed to fit all frames
 */
export function getGlobalBoundingBox(
  frames: ImageData[],
  alphaThreshold: number = 10
): BoundingBox {
  if (frames.length === 0) {
    return {
      minX: 0,
      minY: 0,
      maxX: 0,
      maxY: 0,
      width: 0,
      height: 0,
    };
  }

  // Detect bounding box for each frame
  const boxes = frames.map((frame) => detectBoundingBox(frame, alphaThreshold));

  // Find global min/max
  const globalMinX = Math.min(...boxes.map((b) => b.minX));
  const globalMinY = Math.min(...boxes.map((b) => b.minY));
  const globalMaxX = Math.max(...boxes.map((b) => b.maxX));
  const globalMaxY = Math.max(...boxes.map((b) => b.maxY));

  // Calculate max width and height across all frames
  const maxWidth = Math.max(...boxes.map((b) => b.width));
  const maxHeight = Math.max(...boxes.map((b) => b.height));

  return {
    minX: globalMinX,
    minY: globalMinY,
    maxX: globalMaxX,
    maxY: globalMaxY,
    width: maxWidth,
    height: maxHeight,
  };
}

/**
 * Apply padding reduction to a bounding box
 * Reduces the box size by a percentage (useful for removing AI-generated padding)
 */
export function applyPaddingReduction(
  box: BoundingBox,
  reductionPercent: number
): BoundingBox {
  if (reductionPercent <= 0) {
    return box;
  }

  const reductionFactor = reductionPercent / 100;
  const widthReduction = Math.round(box.width * reductionFactor);
  const heightReduction = Math.round(box.height * reductionFactor);

  const newWidth = Math.max(1, box.width - widthReduction);
  const newHeight = Math.max(1, box.height - heightReduction);

  const xOffset = Math.round(widthReduction / 2);
  const yOffset = Math.round(heightReduction / 2);

  return {
    minX: box.minX + xOffset,
    minY: box.minY + yOffset,
    maxX: box.maxX - xOffset,
    maxY: box.maxY - yOffset,
    width: newWidth,
    height: newHeight,
  };
}

/**
 * Get bounding box statistics for visualization
 */
export function getBoundingBoxStats(boxes: BoundingBox[]): {
  avgWidth: number;
  avgHeight: number;
  minWidth: number;
  maxWidth: number;
  minHeight: number;
  maxHeight: number;
} {
  if (boxes.length === 0) {
    return {
      avgWidth: 0,
      avgHeight: 0,
      minWidth: 0,
      maxWidth: 0,
      minHeight: 0,
      maxHeight: 0,
    };
  }

  const widths = boxes.map((b) => b.width);
  const heights = boxes.map((b) => b.height);

  return {
    avgWidth: Math.round(widths.reduce((a, b) => a + b, 0) / widths.length),
    avgHeight: Math.round(heights.reduce((a, b) => a + b, 0) / heights.length),
    minWidth: Math.min(...widths),
    maxWidth: Math.max(...widths),
    minHeight: Math.min(...heights),
    maxHeight: Math.max(...heights),
  };
}
