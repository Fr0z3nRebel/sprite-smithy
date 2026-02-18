'use client';

import { useState, useEffect, useRef } from 'react';
import { useStore } from '@/store';
import { useExport } from '@/hooks/useExport';
import { createSpriteSheetPreview } from '@/lib/export/spriteSheet';
import Button from '@/components/ui/Button';

const GIF_PREVIEW_MIN_SIZE = 160;
const GIF_PREVIEW_MAX_SIZE = 320;

export default function Step7Export() {
  const frames = useStore((state) => state.frames);
  const exportSettings = useStore((state) => state.exportSettings);
  const setExportSettings = useStore((state) => state.setExportSettings);
  const setCurrentStep = useStore((state) => state.setCurrentStep);
  const isProcessing = useStore((state) => state.isProcessing);
  const progress = useStore((state) => state.progress);
  const video = useStore((state) => state.video);
  const previewFps = useStore((state) => state.previewFps);

  const {
    initiateExport,
    isExporting,
    exportError,
  } = useExport();

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [gifPreviewSize, setGifPreviewSize] = useState(GIF_PREVIEW_MIN_SIZE);
  const gifPreviewCanvasRef = useRef<HTMLCanvasElement>(null);
  const gifPreviewContainerRef = useRef<HTMLDivElement>(null);
  const gifFrameIndexRef = useRef(0);

  const hasFrames = frames.raw.length > 0;
  const framesToExport = frames.processed.length > 0 ? frames.processed : frames.raw;
  const gifFps = previewFps ?? video.metadata?.fps ?? 10;
  const gifFrameIntervalMs = 1000 / gifFps;

  // Size GIF preview to fit container height
  useEffect(() => {
    const el = gifPreviewContainerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const { height } = entries[0]?.contentRect ?? {};
      if (typeof height === 'number' && height > 0) {
        const size = Math.round(
          Math.max(
            GIF_PREVIEW_MIN_SIZE,
            Math.min(GIF_PREVIEW_MAX_SIZE, height - 56)
          )
        );
        setGifPreviewSize(size);
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Animated GIF demo: cycle frames at selected FPS
  useEffect(() => {
    if (framesToExport.length === 0 || !gifPreviewCanvasRef.current) return;
    const canvas = gifPreviewCanvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;
    const size = Math.min(gifPreviewSize, framesToExport[0].width);
    canvas.width = size;
    canvas.height = size;
    let rafId: number;
    let lastTime = 0;
    const drawFrame = (frameIndex: number) => {
      ctx.clearRect(0, 0, size, size);
      const frame = framesToExport[frameIndex];
      if (frame.width === size && frame.height === size) {
        ctx.putImageData(frame, 0, 0);
      } else {
        const tmp = document.createElement('canvas');
        tmp.width = frame.width;
        tmp.height = frame.height;
        const tctx = tmp.getContext('2d');
        if (tctx) {
          tctx.putImageData(frame, 0, 0);
          ctx.imageSmoothingEnabled = false;
          ctx.drawImage(tmp, 0, 0, frame.width, frame.height, 0, 0, size, size);
        }
      }
    };
    drawFrame(0);
    const draw = (time: number) => {
      rafId = requestAnimationFrame(draw);
      const elapsed = time - lastTime;
      if (elapsed >= gifFrameIntervalMs) {
        lastTime = time;
        gifFrameIndexRef.current =
          (gifFrameIndexRef.current + 1) % framesToExport.length;
        drawFrame(gifFrameIndexRef.current);
      }
    };
    rafId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafId);
  }, [framesToExport, gifFrameIntervalMs, gifPreviewSize]);

  // Generate preview
  useEffect(() => {
    if (framesToExport.length > 0) {
      try {
        const frameSize = framesToExport[0].width;
        const previewCanvas = createSpriteSheetPreview(
          framesToExport,
          frameSize,
          512
        );
        const url = previewCanvas.toDataURL('image/png');
        setPreviewUrl(url);
      } catch (error) {
        console.error('Failed to generate preview:', error);
      }
    }
  }, [framesToExport]);

  if (!hasFrames) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Please extract frames first
        </p>
      </div>
    );
  }

  const frameSize = framesToExport[0].width;
  const frameCount = framesToExport.length;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-foreground">
          Export Sprite Sheet
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Download your sprite sheet and individual frames
        </p>
      </div>

      {/* Preview */}
      {previewUrl && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-foreground">Preview</p>
          <div className="border border-border rounded-lg overflow-hidden bg-muted">
            <img
              src={previewUrl}
              alt="Sprite sheet preview"
              className="w-full"
              style={{ imageRendering: 'pixelated' }}
            />
          </div>
          <p className="text-xs text-muted-foreground text-center">
            {frameCount} frames at {frameSize}×{frameSize}px each
          </p>
        </div>
      )}

      {/* Export Options + GIF Demo */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr,auto] gap-6 items-stretch">
        <div className="space-y-4 min-h-0">
          <p className="text-sm font-medium text-foreground">Export Options</p>

          {/* Format Selection */}
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Format</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setExportSettings({ format: 'png' })}
                className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                  exportSettings.format === 'png'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary hover:bg-secondary/80'
                }`}
              >
                PNG (Recommended)
              </button>
              <button
                onClick={() => setExportSettings({ format: 'webp' })}
                className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                  exportSettings.format === 'webp'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary hover:bg-secondary/80'
                }`}
              >
                WebP (Smaller)
              </button>
            </div>
          </div>

          {/* Include Options */}
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={exportSettings.includeSpriteSheet}
                onChange={(e) =>
                  setExportSettings({ includeSpriteSheet: e.target.checked })
                }
                className="w-4 h-4"
                disabled
              />
              <span className="text-sm">
                Sprite Sheet (Always Included)
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={exportSettings.includeFrames}
                onChange={(e) =>
                  setExportSettings({ includeFrames: e.target.checked })
                }
                className="w-4 h-4"
              />
              <span className="text-sm">Individual Frames (ZIP)</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={exportSettings.includeMetadata}
                onChange={(e) =>
                  setExportSettings({ includeMetadata: e.target.checked })
                }
                className="w-4 h-4"
              />
              <span className="text-sm">
                Metadata JSON + README
              </span>
            </label>

            {exportSettings.includeMetadata && (
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={exportSettings.includeHashSpriteSheet ?? true}
                  onChange={(e) =>
                    setExportSettings({
                      includeHashSpriteSheet: e.target.checked,
                    })
                  }
                  className="w-4 h-4"
                />
                <span className="text-sm">
                  PixiJS/Phaser sprite-sheet.json
                </span>
              </label>
            )}

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={exportSettings.includeGif ?? false}
                onChange={(e) =>
                  setExportSettings({ includeGif: e.target.checked })
                }
                className="w-4 h-4"
              />
              <span className="text-sm">
                Animated GIF ({frameSize}×{frameSize}px)
              </span>
            </label>
          </div>
        </div>

        {/* Animated GIF demo */}
        <div
          ref={gifPreviewContainerRef}
          className="flex flex-col items-center gap-2 rounded-lg border border-border bg-muted/30 p-4 min-h-[200px] md:min-h-0 md:h-full"
        >
          <p className="text-sm font-medium text-foreground shrink-0">
            {exportSettings.includeGif ? 'GIF preview' : 'Animation preview'}
          </p>
          <p className="text-xs text-muted-foreground shrink-0">
            {gifFps} fps
          </p>
          <div className="flex-1 min-h-0 flex items-center justify-center w-full">
            <canvas
              ref={gifPreviewCanvasRef}
              className="rounded border border-border bg-muted shrink-0"
              style={{
                width: gifPreviewSize,
                height: gifPreviewSize,
                imageRendering: 'pixelated',
              }}
              width={Math.min(gifPreviewSize, frameSize)}
              height={Math.min(gifPreviewSize, frameSize)}
            />
          </div>
        </div>
      </div>

      {/* Export Summary */}
      <div className="p-4 bg-accent/50 rounded-lg space-y-2">
        <p className="text-sm font-medium text-foreground">Export Summary</p>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Frames:</span>
            <span className="font-medium">{frameCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Frame Size:</span>
            <span className="font-medium">{frameSize}×{frameSize}px</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Format:</span>
            <span className="font-medium">{exportSettings.format.toUpperCase()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Package:</span>
            <span className="font-medium">
              {exportSettings.includeFrames ||
              exportSettings.includeMetadata ||
              exportSettings.includeGif
                ? 'ZIP Archive'
                : 'Single File'}
            </span>
          </div>
          {exportSettings.includeGif && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Animated GIF:</span>
              <span className="font-medium">Included</span>
            </div>
          )}
        </div>
      </div>

      {/* Processing Progress */}
      {isExporting && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Exporting...</span>
            <span className="font-medium text-foreground">{progress}%</span>
          </div>
          <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Error Display */}
      {exportError && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive font-medium">{exportError}</p>
        </div>
      )}

      {/* Export Button */}
      <Button
        onClick={initiateExport}
        disabled={isExporting || isProcessing}
        className="w-full"
        size="lg"
      >
        {isExporting ? 'Exporting...' : 'Export Sprite Sheet'}
      </Button>

      {/* Navigation */}
      <Button
        onClick={() => setCurrentStep(1)}
        variant="outline"
        className="w-full"
        disabled={isExporting}
      >
        Start New Project
      </Button>

      {/* Info Box */}
      <div className="p-4 bg-muted/50 rounded-lg">
        <p className="text-xs text-muted-foreground">
          <strong>Tip:</strong> sprite-smithy.json contains your processing
          settings for reproducibility. sprite-sheet.json is hash-format
          metadata for PixiJS/Phaser.
        </p>
      </div>
    </div>
  );
}
