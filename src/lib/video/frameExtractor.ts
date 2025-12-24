export interface FrameExtractionOptions {
  file: File;
  startFrame: number;
  endFrame: number;
  frameSkip: number;
  fps: number;
  onProgress?: (progress: number) => void;
}

/**
 * Extract a single frame at a specific time using Canvas API
 */
function extractFrameAtTime(
  video: HTMLVideoElement,
  time: number,
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
): Promise<ImageData> {
  return new Promise((resolve, reject) => {
    const onSeeked = () => {
      video.removeEventListener('seeked', onSeeked);
      try {
        ctx.drawImage(video, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        resolve(imageData);
      } catch (error) {
        reject(error);
      }
    };

    video.addEventListener('seeked', onSeeked);
    video.currentTime = time;
  });
}

/**
 * Extract frames from video using Canvas API (browser-native, no FFmpeg needed)
 */
export async function extractFrames(
  options: FrameExtractionOptions
): Promise<ImageData[]> {
  const { file, startFrame, endFrame, frameSkip, fps, onProgress } = options;

  // Validate inputs
  if (startFrame < 0 || endFrame < startFrame || frameSkip < 1) {
    throw new Error('Invalid frame range or skip value');
  }

  const totalFrameCount = endFrame - startFrame + 1;
  const exportedFrameCount = Math.ceil(totalFrameCount / frameSkip);
  
  if (exportedFrameCount > 1000) {
    throw new Error(
      'Too many frames. Maximum 1000 frames per extraction. Please reduce the range or increase frame skip.'
    );
  }

  // Create video element
  const video = document.createElement('video');
  video.muted = true;
  video.playsInline = true;
  
  const videoURL = URL.createObjectURL(file);

  try {
    // Load video metadata
    await new Promise<void>((resolve, reject) => {
      video.onloadedmetadata = () => resolve();
      video.onerror = () => reject(new Error('Failed to load video'));
      video.src = videoURL;
    });

    // Create canvas for frame extraction
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) {
      throw new Error('Failed to create canvas context');
    }

    // Extract frames based on skip value
    const frames: ImageData[] = [];
    const frameDuration = 1 / fps;

    for (let i = 0; i < exportedFrameCount; i++) {
      const frameIndex = startFrame + (i * frameSkip);
      // Ensure we don't exceed endFrame
      if (frameIndex > endFrame) break;
      
      const time = frameIndex * frameDuration;

      try {
        const imageData = await extractFrameAtTime(video, time, canvas, ctx);
        frames.push(imageData);
      } catch (error) {
        console.warn(`Failed to extract frame ${frameIndex}:`, error);
        // Continue with other frames
      }

      // Update progress
      if (onProgress) {
        const progress = Math.round(((i + 1) / exportedFrameCount) * 100);
        onProgress(progress);
      }
    }

    if (frames.length === 0) {
      throw new Error('No frames extracted');
    }

    return frames;
  } catch (error) {
    throw new Error(
      `Frame extraction failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  } finally {
    // Clean up
    URL.revokeObjectURL(videoURL);
    video.src = '';
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
