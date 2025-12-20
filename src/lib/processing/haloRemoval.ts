/**
 * Remove color bleeding artifacts (halos) at transparency edges
 * Uses iterative edge erosion - deterministic and always produces same output
 *
 * @param imageData - Source image data
 * @param strength - Number of pixels to erode (0-5 typically)
 * @returns New ImageData with halos removed
 */
export function removeHalo(
  imageData: ImageData,
  strength: number
): ImageData {
  const { data, width, height } = imageData;
  const output = new ImageData(width, height);

  // Copy original data
  output.data.set(data);

  // Iterate 'strength' times for progressive erosion
  for (let iteration = 0; iteration < strength; iteration++) {
    // Create temporary copy for this iteration
    const temp = new Uint8ClampedArray(output.data);

    // Scan all pixels
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        const alpha = temp[idx + 3];

        // If pixel is opaque or semi-opaque
        if (alpha > 200) {
          // Check if it has a transparent neighbor
          const hasTransparentNeighbor = checkNeighborsForTransparency(
            temp,
            width,
            height,
            x,
            y
          );

          if (hasTransparentNeighbor) {
            // Erode this pixel (make it transparent)
            output.data[idx + 3] = 0;
          }
        }
      }
    }
  }

  return output;
}

/**
 * Check if a pixel has any transparent neighbors (8-connected)
 */
function checkNeighborsForTransparency(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  x: number,
  y: number
): boolean {
  // 8-connected neighbors (including diagonals)
  const offsets = [
    [-1, -1], [0, -1], [1, -1],
    [-1,  0],          [1,  0],
    [-1,  1], [0,  1], [1,  1],
  ];

  for (const [dx, dy] of offsets) {
    const nx = x + dx;
    const ny = y + dy;

    // Check bounds
    if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
      const nIdx = (ny * width + nx) * 4 + 3;
      const neighborAlpha = data[nIdx];

      // If neighbor is transparent (alpha < 50)
      if (neighborAlpha < 50) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Apply halo removal to multiple frames
 * Processes frames in batches for better performance
 */
export async function removeHaloBatch(
  frames: ImageData[],
  strength: number,
  onProgress?: (progress: number) => void
): Promise<ImageData[]> {
  const results: ImageData[] = [];
  const batchSize = 10;

  for (let i = 0; i < frames.length; i += batchSize) {
    const batch = frames.slice(i, Math.min(i + batchSize, frames.length));

    // Process batch
    const processedBatch = batch.map((frame) => removeHalo(frame, strength));

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
 * Preview halo removal on a single frame
 */
export function previewHaloRemoval(
  frame: ImageData,
  strength: number
): ImageData {
  return removeHalo(frame, strength);
}

/**
 * Calculate the number of pixels that would be affected by halo removal
 * Useful for showing impact before applying
 */
export function analyzeHaloImpact(imageData: ImageData): {
  edgePixels: number;
  totalOpaquePixels: number;
  percentageAffected: number;
} {
  const { data, width, height } = imageData;
  let edgePixels = 0;
  let totalOpaquePixels = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const alpha = data[idx + 3];

      if (alpha > 200) {
        totalOpaquePixels++;

        // Check if this is an edge pixel
        const hasTransparentNeighbor = checkNeighborsForTransparency(
          data,
          width,
          height,
          x,
          y
        );

        if (hasTransparentNeighbor) {
          edgePixels++;
        }
      }
    }
  }

  const percentageAffected =
    totalOpaquePixels > 0
      ? Math.round((edgePixels / totalOpaquePixels) * 100)
      : 0;

  return {
    edgePixels,
    totalOpaquePixels,
    percentageAffected,
  };
}
