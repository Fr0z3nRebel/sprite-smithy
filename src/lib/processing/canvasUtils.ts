/**
 * Create a canvas from ImageData
 */
export function imageDataToCanvas(imageData: ImageData): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = imageData.width;
  canvas.height = imageData.height;

  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

/**
 * Convert canvas to ImageData
 */
export function canvasToImageData(canvas: HTMLCanvasElement): ImageData {
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

/**
 * Crop ImageData to a specific region
 */
export function cropImageData(
  imageData: ImageData,
  x: number,
  y: number,
  width: number,
  height: number
): ImageData {
  const canvas = imageDataToCanvas(imageData);
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  return ctx.getImageData(x, y, width, height);
}

/**
 * Resize ImageData to new dimensions while preserving aspect ratio
 */
export function resizeImageData(
  imageData: ImageData,
  newWidth: number,
  newHeight: number
): ImageData {
  const sourceCanvas = imageDataToCanvas(imageData);

  const targetCanvas = document.createElement('canvas');
  targetCanvas.width = newWidth;
  targetCanvas.height = newHeight;

  const ctx = targetCanvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  // Use high-quality image scaling
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  ctx.drawImage(sourceCanvas, 0, 0, newWidth, newHeight);

  return canvasToImageData(targetCanvas);
}

/**
 * Create a blank ImageData with optional background color
 */
export function createBlankImageData(
  width: number,
  height: number,
  backgroundColor?: { r: number; g: number; b: number; a: number }
): ImageData {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  if (backgroundColor) {
    ctx.fillStyle = `rgba(${backgroundColor.r}, ${backgroundColor.g}, ${backgroundColor.b}, ${backgroundColor.a})`;
    ctx.fillRect(0, 0, width, height);
  }

  return ctx.getImageData(0, 0, width, height);
}

/**
 * Composite one ImageData onto another at a specific position
 */
export function compositeImageData(
  background: ImageData,
  foreground: ImageData,
  x: number,
  y: number
): ImageData {
  const bgCanvas = imageDataToCanvas(background);
  const fgCanvas = imageDataToCanvas(foreground);

  const ctx = bgCanvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  ctx.drawImage(fgCanvas, x, y);

  return canvasToImageData(bgCanvas);
}
