import { extractFrames as extractFramesFFmpeg } from './decoder';

export interface FrameExtractionOptions {
  file: File;
  startFrame: number;
  endFrame: number;
  fps: number;
  onProgress?: (progress: number) => void;
}

/**
 * Extract frames from video
 */
export async function extractFrames(
  options: FrameExtractionOptions
): Promise<ImageData[]> {
  const { file, startFrame, endFrame, fps, onProgress } = options;

  // Validate inputs
  if (startFrame < 0 || endFrame < startFrame) {
    throw new Error('Invalid frame range');
  }

  const frameCount = endFrame - startFrame + 1;
  if (frameCount > 1000) {
    throw new Error(
      'Too many frames. Maximum 1000 frames per extraction. Please reduce the range.'
    );
  }

  // Extract using FFmpeg
  try {
    const frames = await extractFramesFFmpeg(
      file,
      startFrame,
      endFrame,
      fps,
      onProgress
    );

    if (frames.length === 0) {
      throw new Error('No frames extracted');
    }

    return frames;
  } catch (error) {
    throw new Error(
      `Frame extraction failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Generate thumbnails from ImageData frames
 */
export function generateThumbnails(
  frames: ImageData[],
  thumbnailSize: number = 128
): string[] {
  return frames.map((frame) => {
    const canvas = document.createElement('canvas');
    const aspectRatio = frame.width / frame.height;

    if (aspectRatio > 1) {
      canvas.width = thumbnailSize;
      canvas.height = Math.round(thumbnailSize / aspectRatio);
    } else {
      canvas.height = thumbnailSize;
      canvas.width = Math.round(thumbnailSize * aspectRatio);
    }

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) {
      return '';
    }

    // Create temporary canvas with original frame
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = frame.width;
    tempCanvas.height = frame.height;
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) {
      return '';
    }

    tempCtx.putImageData(frame, 0, 0);

    // Draw scaled to thumbnail canvas
    ctx.drawImage(tempCanvas, 0, 0, canvas.width, canvas.height);

    return canvas.toDataURL('image/png');
  });
}
