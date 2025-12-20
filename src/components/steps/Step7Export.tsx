'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/store';
import { useExport } from '@/hooks/useExport';
import { createSpriteSheetPreview } from '@/lib/export/spriteSheet';
import Button from '@/components/ui/Button';

export default function Step7Export() {
  const frames = useStore((state) => state.frames);
  const exportSettings = useStore((state) => state.exportSettings);
  const setExportSettings = useStore((state) => state.setExportSettings);
  const license = useStore((state) => state.license);
  const setCurrentStep = useStore((state) => state.setCurrentStep);
  const isProcessing = useStore((state) => state.isProcessing);
  const progress = useStore((state) => state.progress);

  const { handleExport, isExporting, exportError } = useExport();

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const hasFrames = frames.raw.length > 0;
  const framesToExport = frames.processed.length > 0 ? frames.processed : frames.raw;

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
        <Button onClick={() => setCurrentStep(3)}>
          Back to Frame Extraction
        </Button>
      </div>
    );
  }

  const frameSize = framesToExport[0].width;
  const frameCount = framesToExport.length;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground">Export</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Export your sprite sheet and frames
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

      {/* Export Options */}
      <div className="space-y-4">
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
        </div>
      </div>

      {/* License Status */}
      <div
        className={`p-4 rounded-lg border ${
          license.tier === 'paid'
            ? 'bg-green-500/10 border-green-500/20'
            : 'bg-orange-500/10 border-orange-500/20'
        }`}
      >
        <p className="text-sm font-medium">
          {license.tier === 'paid' ? 'Licensed Version' : 'Free Trial'}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {license.tier === 'paid'
            ? 'Exports will not include watermark'
            : 'Exports will include "Free Trial" watermark. Purchase a license to remove it.'}
        </p>
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
              {exportSettings.includeFrames || exportSettings.includeMetadata
                ? 'ZIP Archive'
                : 'Single File'}
            </span>
          </div>
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
          <p className="text-sm text-destructive">{exportError}</p>
        </div>
      )}

      {/* Export Button */}
      <Button
        onClick={handleExport}
        disabled={isExporting || isProcessing}
        className="w-full"
        size="lg"
      >
        {isExporting ? 'Exporting...' : 'Export Sprite Sheet'}
      </Button>

      {/* Navigation */}
      <div className="flex gap-2">
        <Button
          onClick={() => setCurrentStep(6)}
          variant="outline"
          disabled={isExporting}
        >
          Back
        </Button>
        <Button
          onClick={() => setCurrentStep(1)}
          variant="outline"
          className="flex-1"
          disabled={isExporting}
        >
          Start New Project
        </Button>
      </div>

      {/* Info Box */}
      <div className="p-4 bg-muted/50 rounded-lg">
        <p className="text-xs text-muted-foreground">
          <strong>Tip:</strong> The metadata.json file contains all your
          processing settings. You can use this to reproduce the same sprite
          sheet in the future or share your settings with others.
        </p>
      </div>
    </div>
  );
}
