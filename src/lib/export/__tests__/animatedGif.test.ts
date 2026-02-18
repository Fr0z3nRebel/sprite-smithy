import { describe, it, expect } from 'vitest';
import { encodeAnimatedGif } from '../animatedGif';

function createFrame(
  width: number,
  height: number,
  fill: [number, number, number, number] = [255, 0, 0, 255]
): ImageData {
  const data = new Uint8ClampedArray(width * height * 4);
  for (let i = 0; i < data.length; i += 4) {
    data[i] = fill[0];
    data[i + 1] = fill[1];
    data[i + 2] = fill[2];
    data[i + 3] = fill[3];
  }
  return { width, height, data };
}

describe('encodeAnimatedGif', () => {
  it('throws when given no frames', async () => {
    await expect(encodeAnimatedGif([], 10)).rejects.toThrow(
      'No frames to encode'
    );
  });

  it('returns a blob with type image/gif', async () => {
    const frames = [
      createFrame(4, 4),
      createFrame(4, 4, [0, 255, 0, 255]),
    ];
    const blob = await encodeAnimatedGif(frames, 10);
    expect(blob.type).toBe('image/gif');
    expect(blob.size).toBeGreaterThan(0);
  });

  it('produces valid GIF header (GIF89a)', async () => {
    const frames = [createFrame(2, 2)];
    const blob = await encodeAnimatedGif(frames, 10);
    const buf = await blob.arrayBuffer();
    const header = new Uint8Array(buf, 0, 6);
    const sig = String.fromCharCode(...header);
    expect(sig).toBe('GIF89a');
  });

  it('calls onProgress with 0–100', async () => {
    const frames = [
      createFrame(2, 2),
      createFrame(2, 2),
      createFrame(2, 2),
    ];
    const progressValues: number[] = [];
    await encodeAnimatedGif(frames, 10, (p) => progressValues.push(p));
    expect(progressValues.length).toBe(3);
    expect(progressValues[0]).toBeGreaterThanOrEqual(0);
    expect(progressValues[2]).toBe(100);
  });

  it('duplicates frames for low FPS to match selected speed', async () => {
    const frames = [createFrame(2, 2), createFrame(2, 2)];
    const blobLow = await encodeAnimatedGif(frames, 5);
    const blobHigh = await encodeAnimatedGif(frames, 10);
    expect(blobLow.size).toBeGreaterThan(blobHigh.size);
  });
});
