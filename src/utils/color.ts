import { RGB } from '@/types/processing';

/**
 * Calculate Euclidean distance between two colors in RGB space
 * This is deterministic and always returns the same result for the same inputs
 */
export function calculateColorDistance(color1: RGB, color2: RGB): number {
  const rDiff = color1.r - color2.r;
  const gDiff = color1.g - color2.g;
  const bDiff = color1.b - color2.b;

  return Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff);
}

/**
 * Normalize color distance to 0-1 range
 * Maximum possible distance in RGB space is sqrt(255^2 + 255^2 + 255^2) = ~441.67
 */
export function normalizeColorDistance(distance: number): number {
  const MAX_RGB_DISTANCE = 441.6729559300637;
  return Math.min(1, distance / MAX_RGB_DISTANCE);
}

/**
 * Convert hex color to RGB
 */
export function hexToRgb(hex: string): RGB | null {
  // Remove # if present
  hex = hex.replace(/^#/, '');

  // Parse hex values
  if (hex.length === 3) {
    // Short form (e.g., "f00")
    const r = parseInt(hex[0] + hex[0], 16);
    const g = parseInt(hex[1] + hex[1], 16);
    const b = parseInt(hex[2] + hex[2], 16);
    return { r, g, b };
  } else if (hex.length === 6) {
    // Long form (e.g., "ff0000")
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return { r, g, b };
  }

  return null;
}

/**
 * Convert RGB to hex
 */
export function rgbToHex(rgb: RGB): string {
  const toHex = (n: number) => {
    const hex = Math.round(Math.max(0, Math.min(255, n))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
}

/**
 * Extract color from ImageData at specific pixel coordinates
 */
export function getPixelColor(
  imageData: ImageData,
  x: number,
  y: number
): RGB {
  const index = (y * imageData.width + x) * 4;
  return {
    r: imageData.data[index],
    g: imageData.data[index + 1],
    b: imageData.data[index + 2],
  };
}

/**
 * Common chroma key colors
 */
export const COMMON_CHROMA_COLORS = {
  green: { r: 0, g: 255, b: 0 },
  blue: { r: 0, g: 0, b: 255 },
  white: { r: 255, g: 255, b: 255 },
  black: { r: 0, g: 0, b: 0 },
};
