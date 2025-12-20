import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

let ffmpegInstance: FFmpeg | null = null;
let isLoading = false;
let isLoaded = false;

/**
 * Load FFmpeg.wasm library
 */
export async function loadFFmpeg(
  onProgress?: (progress: number) => void
): Promise<FFmpeg> {
  if (isLoaded && ffmpegInstance) {
    return ffmpegInstance;
  }

  if (isLoading && ffmpegInstance) {
    // Wait for loading to complete
    while (isLoading) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    if (isLoaded && ffmpegInstance) {
      return ffmpegInstance;
    }
  }

  isLoading = true;

  try {
    const ffmpeg = new FFmpeg();

    // Set up logging
    ffmpeg.on('log', ({ message }) => {
      console.log('[FFmpeg]', message);
    });

    // Set up progress reporting
    if (onProgress) {
      ffmpeg.on('progress', ({ progress }) => {
        onProgress(Math.round(progress * 100));
      });
    }

    // Load FFmpeg
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
    await ffmpeg.load({
      coreURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.js`,
        'text/javascript'
      ),
      wasmURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.wasm`,
        'application/wasm'
      ),
    });

    ffmpegInstance = ffmpeg;
    isLoaded = true;
    isLoading = false;

    return ffmpeg;
  } catch (error) {
    isLoading = false;
    isLoaded = false;
    throw new Error(
      `Failed to load FFmpeg: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Extract frames from video file
 */
export async function extractFrames(
  file: File,
  startFrame: number,
  endFrame: number,
  fps: number,
  onProgress?: (progress: number) => void
): Promise<ImageData[]> {
  const ffmpeg = await loadFFmpeg(onProgress);

  try {
    // Calculate time range
    const startTime = startFrame / fps;
    const frameCount = endFrame - startFrame + 1;
    const duration = frameCount / fps;

    // Write input file to FFmpeg virtual file system
    await ffmpeg.writeFile('input.mp4', await fetchFile(file));

    // Extract frames as PNG sequence
    // -ss: start time
    // -t: duration
    // -vf fps=: force frame rate
    await ffmpeg.exec([
      '-i',
      'input.mp4',
      '-ss',
      startTime.toString(),
      '-t',
      duration.toString(),
      '-vf',
      `fps=${fps}`,
      'frame-%04d.png',
    ]);

    // Read extracted frames
    const frames: ImageData[] = [];

    for (let i = 0; i < frameCount; i++) {
      const frameIndex = i + 1;
      const filename = `frame-${frameIndex.toString().padStart(4, '0')}.png`;

      try {
        const data = await ffmpeg.readFile(filename);
        // Create a proper Blob from the data
        const blob = new Blob([data as BlobPart], { type: 'image/png' });
        const imageData = await blobToImageData(blob);
        frames.push(imageData);

        // Update progress
        if (onProgress) {
          const progress = Math.round(((i + 1) / frameCount) * 100);
          onProgress(progress);
        }

        // Clean up frame file
        await ffmpeg.deleteFile(filename);
      } catch (error) {
        console.warn(`Failed to read frame ${frameIndex}:`, error);
        // Continue with other frames
      }
    }

    // Clean up input file
    await ffmpeg.deleteFile('input.mp4');

    return frames;
  } catch (error) {
    throw new Error(
      `Failed to extract frames: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Convert Blob to ImageData
 */
async function blobToImageData(blob: Blob): Promise<ImageData> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(blob);

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to get canvas context'));
        return;
      }

      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      URL.revokeObjectURL(url);
      resolve(imageData);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
}

/**
 * Get FFmpeg version (for debugging)
 */
export async function getFFmpegVersion(): Promise<string> {
  try {
    const ffmpeg = await loadFFmpeg();
    return 'FFmpeg 0.12.6 (WASM)';
  } catch (error) {
    return 'Not loaded';
  }
}
