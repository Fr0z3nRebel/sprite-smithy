/**
 * Create a sprite sheet from frames in a grid layout
 * Layout is deterministic - always produces the same result
 */
export function createSpriteSheet(
  frames: ImageData[],
  frameSize: number
): HTMLCanvasElement {
  if (frames.length === 0) {
    throw new Error('No frames to create sprite sheet');
  }

  // Calculate grid dimensions (square-ish grid)
  const cols = Math.ceil(Math.sqrt(frames.length));
  const rows = Math.ceil(frames.length / cols);

  // Create sprite sheet canvas
  const canvas = document.createElement('canvas');
  canvas.width = cols * frameSize;
  canvas.height = rows * frameSize;

  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  // Draw each frame in grid position
  frames.forEach((frame, index) => {
    const col = index % cols;
    const row = Math.floor(index / cols);

    // Create temporary canvas for this frame
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = frameSize;
    tempCanvas.height = frameSize;
    const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });

    if (!tempCtx) {
      throw new Error('Failed to get temp canvas context');
    }

    tempCtx.putImageData(frame, 0, 0);

    // Draw frame onto sprite sheet
    ctx.drawImage(tempCanvas, col * frameSize, row * frameSize);
  });

  return canvas;
}

/**
 * Convert canvas to blob for download
 */
export async function canvasToBlob(
  canvas: HTMLCanvasElement,
  format: 'png' | 'webp' = 'png'
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create blob'));
        }
      },
      format === 'png' ? 'image/png' : 'image/webp'
    );
  });
}

/**
 * Get sprite sheet dimensions
 */
export function getSpriteSheetDimensions(
  frameCount: number,
  frameSize: number
): {
  cols: number;
  rows: number;
  width: number;
  height: number;
} {
  const cols = Math.ceil(Math.sqrt(frameCount));
  const rows = Math.ceil(frameCount / cols);

  return {
    cols,
    rows,
    width: cols * frameSize,
    height: rows * frameSize,
  };
}

/**
 * Create a preview of the sprite sheet (scaled down)
 */
export function createSpriteSheetPreview(
  frames: ImageData[],
  frameSize: number,
  maxPreviewSize: number = 512
): HTMLCanvasElement {
  // Create full sprite sheet
  const fullCanvas = createSpriteSheet(frames, frameSize);

  // Calculate scale to fit in preview
  const scale = Math.min(
    maxPreviewSize / fullCanvas.width,
    maxPreviewSize / fullCanvas.height,
    1 // Don't upscale
  );

  // Create preview canvas
  const previewCanvas = document.createElement('canvas');
  previewCanvas.width = Math.round(fullCanvas.width * scale);
  previewCanvas.height = Math.round(fullCanvas.height * scale);

  const ctx = previewCanvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) {
    throw new Error('Failed to get preview canvas context');
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(fullCanvas, 0, 0, previewCanvas.width, previewCanvas.height);

  return previewCanvas;
}
