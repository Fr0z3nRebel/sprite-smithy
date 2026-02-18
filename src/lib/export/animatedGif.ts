import { GIFEncoder, quantize, applyPalette } from 'gifenc';

/** Many players use 20ms minimum delay (~50 fps). GIF stores delay in centiseconds (10ms units). */
const MIN_DELAY_MS = 20;
const MAX_DELAY_MS = 100;

/**
 * Build the frame list and delay for encoding. Duplicates frames when needed so
 * the selected FPS is preserved: for low FPS we duplicate to stay under max
 * delay; for high FPS we cap delay at MIN_DELAY_MS so playback isn’t slower.
 */
function buildGifFrameSequence(
  frames: ImageData[],
  fps: number
): { frames: ImageData[]; delayMs: number } {
  const targetDelayMs = 1000 / Math.max(1, fps);
  let delayMs: number;
  let sequence: ImageData[];

  if (targetDelayMs > MAX_DELAY_MS) {
    // Low FPS: duplicate frames so we use MAX_DELAY_MS per frame (avoids huge delays some players ignore)
    const copies = Math.ceil(targetDelayMs / MAX_DELAY_MS);
    delayMs = MAX_DELAY_MS;
    sequence = [];
    for (const frame of frames) {
      for (let c = 0; c < copies; c++) {
        sequence.push(frame);
      }
    }
  } else {
    delayMs = Math.max(MIN_DELAY_MS, Math.round(targetDelayMs / 10) * 10);
    sequence = frames;
  }

  return { frames: sequence, delayMs };
}

/**
 * Encode processed frames into an animated GIF at the given frame dimensions.
 * Uses the same size as step 5. Delay is derived from fps; frames are duplicated
 * when needed to match the selected FPS (e.g. low FPS uses repeated frames to stay under max delay).
 */
export async function encodeAnimatedGif(
  frames: ImageData[],
  fps: number,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  if (frames.length === 0) {
    throw new Error('No frames to encode');
  }

  const width = frames[0].width;
  const height = frames[0].height;
  const { frames: sequence, delayMs } = buildGifFrameSequence(frames, fps);

  const firstData = new Uint8Array(sequence[0].data);
  const palette = quantize(firstData, 256, {
    format: 'rgba4444',
    oneBitAlpha: true,
  });
  const format = 'rgba4444';

  const gif = GIFEncoder();

  for (let i = 0; i < sequence.length; i++) {
    const frame = sequence[i];
    const index = applyPalette(
      new Uint8Array(frame.data),
      palette,
      format
    );
    gif.writeFrame(index, width, height, {
      palette,
      delay: delayMs,
      transparent: true,
      transparentIndex: 0,
    });
    if (onProgress) {
      onProgress(Math.round(((i + 1) / sequence.length) * 100));
    }
  }

  gif.finish();
  const bytes = gif.bytes();
  return new Blob([new Uint8Array(bytes)], { type: 'image/gif' });
}
