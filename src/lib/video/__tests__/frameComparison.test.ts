import { describe, it, expect } from 'vitest';
import { compareFrames, imageDataAtSize } from '../frameComparison';

/** Create ImageData-like object for tests (no global ImageData in Node/happy-dom). */
function makeImageData(
  width: number,
  height: number,
  fill: (i: number) => number
): ImageData {
  const data = new Uint8ClampedArray(width * height * 4);
  for (let i = 0; i < data.length; i++) {
    data[i] = fill(i);
  }
  return { data, width, height } as ImageData;
}

describe('imageDataAtSize', () => {
  it('returns same ImageData when already within maxSize', () => {
    const small = makeImageData(10, 10, () => 128);
    const result = imageDataAtSize(small, 64);
    expect(result).toBe(small);
    expect(result.width).toBe(10);
    expect(result.height).toBe(10);
  });

  it('returns same ImageData when dimensions equal maxSize', () => {
    const exact = makeImageData(64, 64, () => 0);
    const result = imageDataAtSize(exact, 64);
    expect(result).toBe(exact);
  });
});

describe('compareFrames', () => {
  it('returns 0 for exact match', () => {
    const a = makeImageData(8, 8, (i) => i % 256);
    const b = makeImageData(8, 8, (i) => i % 256);
    expect(compareFrames(a, b)).toBe(0);
  });

  it('returns 0 when comparing same reference', () => {
    const a = makeImageData(16, 16, () => 100);
    expect(compareFrames(a, a)).toBe(0);
  });

  it('returns positive value for different frames', () => {
    const a = makeImageData(8, 8, () => 0);
    const b = makeImageData(8, 8, () => 255);
    const diff = compareFrames(a, b);
    expect(diff).toBeGreaterThan(0);
  });

  it('returns lower value for more similar frames', () => {
    const ref = makeImageData(8, 8, (i) => (i % 4 === 0 ? 100 : 0));
    const same = makeImageData(8, 8, (i) => (i % 4 === 0 ? 100 : 0));
    const onePixelOff = makeImageData(8, 8, (i) =>
      i === 0 ? 99 : i % 4 === 0 ? 100 : 0
    );
    const veryDifferent = makeImageData(8, 8, () => 200);

    expect(compareFrames(ref, same)).toBe(0);
    const diffOne = compareFrames(ref, onePixelOff);
    const diffVery = compareFrames(ref, veryDifferent);
    expect(diffOne).toBeGreaterThan(0);
    expect(diffVery).toBeGreaterThan(0);
    expect(diffOne).toBeLessThan(diffVery);
  });

  it('returns Number.MAX_VALUE when dimensions differ after downscale', () => {
    const a = makeImageData(8, 16, () => 0);
    const b = makeImageData(16, 8, () => 0);
    expect(compareFrames(a, b)).toBe(Number.MAX_VALUE);
  });
});
