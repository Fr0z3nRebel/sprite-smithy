import { describe, it, expect } from 'vitest';
import { generateHashSpriteSheetMetadata } from '../metadataGenerator';

describe('generateHashSpriteSheetMetadata', () => {
  it('produces frames keyed by frame_{index}.png', () => {
    const json = generateHashSpriteSheetMetadata({
      frame_width: 64,
      frame_height: 64,
      columns: 2,
      total_frames: 3,
      output_image_name: 'sprite-sheet.png',
    });
    const data = JSON.parse(json);
    expect(Object.keys(data.frames).sort()).toEqual([
      'frame_0.png',
      'frame_1.png',
      'frame_2.png',
    ]);
  });

  it('computes x,y from columns and frame dimensions', () => {
    const json = generateHashSpriteSheetMetadata({
      frame_width: 32,
      frame_height: 32,
      columns: 2,
      total_frames: 4,
      output_image_name: 'sheet.png',
    });
    const data = JSON.parse(json);
    expect(data.frames['frame_0.png'].frame).toEqual({ x: 0, y: 0, w: 32, h: 32 });
    expect(data.frames['frame_1.png'].frame).toEqual({ x: 32, y: 0, w: 32, h: 32 });
    expect(data.frames['frame_2.png'].frame).toEqual({ x: 0, y: 32, w: 32, h: 32 });
    expect(data.frames['frame_3.png'].frame).toEqual({ x: 32, y: 32, w: 32, h: 32 });
  });

  it('sets rotated false and trimmed false for every frame', () => {
    const json = generateHashSpriteSheetMetadata({
      frame_width: 16,
      frame_height: 16,
      columns: 1,
      total_frames: 2,
      output_image_name: 'out.png',
    });
    const data = JSON.parse(json);
    for (const key of Object.keys(data.frames)) {
      expect(data.frames[key].rotated).toBe(false);
      expect(data.frames[key].trimmed).toBe(false);
    }
  });

  it('includes spriteSourceSize and sourceSize per frame', () => {
    const json = generateHashSpriteSheetMetadata({
      frame_width: 48,
      frame_height: 48,
      columns: 1,
      total_frames: 1,
      output_image_name: 'single.png',
    });
    const data = JSON.parse(json);
    const frame = data.frames['frame_0.png'];
    expect(frame.spriteSourceSize).toEqual({ x: 0, y: 0, w: 48, h: 48 });
    expect(frame.sourceSize).toEqual({ w: 48, h: 48 });
  });

  it('meta contains image name, size from columns/rows, and version', () => {
    const json = generateHashSpriteSheetMetadata({
      frame_width: 64,
      frame_height: 64,
      columns: 3,
      total_frames: 7,
      output_image_name: 'sprite-sheet.png',
    });
    const data = JSON.parse(json);
    const rows = Math.ceil(7 / 3);
    expect(data.meta.image).toBe('sprite-sheet.png');
    expect(data.meta.size).toEqual({
      w: 3 * 64,
      h: rows * 64,
    });
    expect(typeof data.meta.version).toBe('string');
    expect(data.meta.version.length).toBeGreaterThan(0);
  });

  it('uses custom version when provided', () => {
    const json = generateHashSpriteSheetMetadata({
      frame_width: 16,
      frame_height: 16,
      columns: 1,
      total_frames: 1,
      output_image_name: 'x.png',
      version: '2.0',
    });
    const data = JSON.parse(json);
    expect(data.meta.version).toBe('2.0');
  });

  it('output is valid JSON and parses without error', () => {
    const json = generateHashSpriteSheetMetadata({
      frame_width: 128,
      frame_height: 128,
      columns: 4,
      total_frames: 10,
      output_image_name: 'sprite-sheet.webp',
    });
    expect(() => JSON.parse(json)).not.toThrow();
    const data = JSON.parse(json);
    expect(data.frames).toBeDefined();
    expect(data.meta).toBeDefined();
  });
});
