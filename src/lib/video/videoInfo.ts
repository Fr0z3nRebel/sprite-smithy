import { VideoMetadata } from '@/types/video';

/**
 * Extract metadata from a video file
 */
export async function extractVideoMetadata(
  file: File
): Promise<VideoMetadata> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';

    video.onloadedmetadata = async () => {
      try {
        const fps = await detectFPS(video);
        const metadata: VideoMetadata = {
          fps,
          duration: video.duration,
          totalFrames: Math.floor(video.duration * fps),
          width: video.videoWidth,
          height: video.videoHeight,
        };

        // Clean up
        URL.revokeObjectURL(video.src);
        resolve(metadata);
      } catch (error) {
        reject(error);
      }
    };

    video.onerror = () => {
      URL.revokeObjectURL(video.src);
      reject(new Error('Failed to load video metadata'));
    };

    video.src = URL.createObjectURL(file);
  });
}

/**
 * Detect video FPS by analyzing frame timestamps
 */
async function detectFPS(video: HTMLVideoElement): Promise<number> {
  // Common FPS values to check
  const commonFPS = [24, 25, 30, 50, 60];

  // Try to detect FPS by seeking to multiple points
  const timestamps: number[] = [];
  const sampleCount = 10;

  for (let i = 0; i < sampleCount; i++) {
    const time = (video.duration / sampleCount) * i;
    video.currentTime = time;

    await new Promise<void>((resolve) => {
      video.onseeked = () => resolve();
    });

    timestamps.push(video.currentTime);
  }

  // Calculate average time between frames
  let totalDiff = 0;
  let diffCount = 0;

  for (let i = 1; i < timestamps.length; i++) {
    const diff = timestamps[i] - timestamps[i - 1];
    if (diff > 0) {
      totalDiff += diff;
      diffCount++;
    }
  }

  if (diffCount === 0) {
    // Fallback to common FPS
    return 30;
  }

  const avgTimeBetweenSamples = totalDiff / diffCount;
  const estimatedFPS = 1 / avgTimeBetweenSamples;

  // Round to nearest common FPS
  let closestFPS = commonFPS[0];
  let minDiff = Math.abs(estimatedFPS - closestFPS);

  for (const fps of commonFPS) {
    const diff = Math.abs(estimatedFPS - fps);
    if (diff < minDiff) {
      minDiff = diff;
      closestFPS = fps;
    }
  }

  return closestFPS;
}

/**
 * Get frame at specific time
 */
export function getFrameAtTime(
  video: HTMLVideoElement,
  time: number
): Promise<ImageData> {
  return new Promise((resolve, reject) => {
    video.currentTime = time;

    video.onseeked = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        ctx.drawImage(video, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        resolve(imageData);
      } catch (error) {
        reject(error);
      }
    };

    video.onerror = () => {
      reject(new Error('Failed to seek to time'));
    };
  });
}
