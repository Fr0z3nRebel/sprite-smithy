/**
 * Apply watermark to a canvas for free tier users
 */
export async function applyWatermark(
  canvas: HTMLCanvasElement,
  watermarkText: string = 'Sprite Smithy - Free Trial'
): Promise<void> {
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  // Calculate font size based on canvas size
  const fontSize = Math.max(12, Math.floor(canvas.width / 40));

  // Set text style
  ctx.font = `${fontSize}px Arial, sans-serif`;
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'bottom';

  // Measure text
  const textMetrics = ctx.measureText(watermarkText);
  const textWidth = textMetrics.width;
  const textHeight = fontSize;

  // Add background for better readability
  const padding = 8;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.fillRect(
    canvas.width - textWidth - padding * 2,
    canvas.height - textHeight - padding * 2,
    textWidth + padding * 2,
    textHeight + padding * 2
  );

  // Draw text
  ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
  ctx.fillText(
    watermarkText,
    canvas.width - padding,
    canvas.height - padding
  );
}

/**
 * Apply watermark to sprite sheet (positioned in bottom-right)
 */
export async function applyWatermarkToSpriteSheet(
  canvas: HTMLCanvasElement
): Promise<void> {
  await applyWatermark(canvas, 'Sprite Smithy - Free Trial');
}

/**
 * Apply watermark to individual frame
 */
export async function applyWatermarkToFrame(
  canvas: HTMLCanvasElement
): Promise<void> {
  await applyWatermark(canvas, 'Trial');
}

/**
 * Check if watermark should be applied based on license
 */
export function shouldApplyWatermark(isLicensed: boolean): boolean {
  return !isLicensed;
}
