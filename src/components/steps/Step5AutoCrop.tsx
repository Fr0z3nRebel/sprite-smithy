'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/store';
import { useAutoCrop } from '@/hooks/useAutoCrop';
import { previewNormalization, calculateNormalizedDimensions } from '@/lib/processing/normalize';
import { FRAME_SIZE_PRESETS } from '@/utils/constants';
import Slider from '@/components/ui/Slider';
import Button from '@/components/ui/Button';
import CanvasPreview from '@/components/ui/CanvasPreview';

export default function Step5AutoCrop() {
  const frames = useStore((state) => state.frames);
  const settings = useStore((state) => state.settings);
  const setSizingSettings = useStore((state) => state.setSizingSettings);
  const setCurrentStep = useStore((state) => state.setCurrentStep);
  const isProcessing = useStore((state) => state.isProcessing);
  const progress = useStore((state) => state.progress);

  const {
    handleApplyNormalization,
    processingError,
    globalBox,
    calculateGlobalBox,
  } = useAutoCrop();

  const [previewFrame, setPreviewFrame] = useState<ImageData | null>(null);
  const [normalizedPreview, setNormalizedPreview] = useState<ImageData | null>(null);

  const hasFrames = frames.raw.length > 0;
  const framesToUse = frames.processed.length > 0 ? frames.processed : frames.raw;
  const hasNormalizedFrames = frames.processed.length > 0 &&
    frames.processed[0]?.width === settings.sizing.targetSize;

  // Calculate global box on mount
  useEffect(() => {
    if (framesToUse.length > 0 && !globalBox) {
      calculateGlobalBox();
    }
  }, [framesToUse.length, globalBox, calculateGlobalBox]);

  // Set initial preview frame
  useEffect(() => {
    if (framesToUse.length > 0 && !previewFrame) {
      const middleIndex = Math.floor(framesToUse.length / 2);
      setPreviewFrame(framesToUse[middleIndex]);
    }
  }, [framesToUse, previewFrame]);

  // Update preview when settings change
  useEffect(() => {
    if (previewFrame && globalBox) {
      const normalized = previewNormalization(
        previewFrame,
        globalBox,
        settings.sizing
      );
      setNormalizedPreview(normalized);
    }
  }, [previewFrame, globalBox, settings.sizing]);

  const handleApply = async () => {
    const success = await handleApplyNormalization();
    if (success) {
      setCurrentStep(6);
    }
  };

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

  // Calculate dimensions for display
  const dimensions = globalBox
    ? calculateNormalizedDimensions(
        globalBox,
        settings.sizing.targetSize,
        settings.sizing.paddingReduction
      )
    : null;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground">
          Auto-Crop & Sizing
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Normalize frame dimensions
        </p>
      </div>

      {/* Bounding Box Info */}
      {globalBox && (
        <div className="p-4 bg-accent/50 rounded-lg space-y-2">
          <p className="text-sm font-medium text-foreground">
            Detected Bounds
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-muted-foreground">Width:</span>
              <span className="ml-2 font-medium">{globalBox.width}px</span>
            </div>
            <div>
              <span className="text-muted-foreground">Height:</span>
              <span className="ml-2 font-medium">{globalBox.height}px</span>
            </div>
          </div>
        </div>
      )}

      {/* Size Presets */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-foreground">Target Size</p>
        <div className="grid grid-cols-4 gap-2">
          {FRAME_SIZE_PRESETS.map((size) => (
            <button
              key={size}
              onClick={() => setSizingSettings({ targetSize: size })}
              className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                settings.sizing.targetSize === size
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary hover:bg-secondary/80'
              }`}
            >
              {size}×{size}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Size Slider */}
      <Slider
        label="Custom Size"
        value={settings.sizing.targetSize}
        min={16}
        max={512}
        step={8}
        onChange={(value) => setSizingSettings({ targetSize: value })}
        valueFormatter={(v) => `${v}×${v}px`}
      />

      {/* Padding Reduction */}
      <Slider
        label="Padding Reduction"
        value={settings.sizing.paddingReduction}
        min={0}
        max={50}
        step={1}
        onChange={(value) => setSizingSettings({ paddingReduction: value })}
        valueFormatter={(v) => `${v}%`}
      />

      {/* Anchor Alignment */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-foreground">Alignment</p>
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: 'center-bottom', label: 'Bottom' },
            { value: 'center', label: 'Center' },
            { value: 'top-left', label: 'Top-Left' },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() =>
                setSizingSettings({
                  anchor: option.value as 'center-bottom' | 'center' | 'top-left',
                })
              }
              className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                settings.sizing.anchor === option.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary hover:bg-secondary/80'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Dimensions Display */}
      {dimensions && (
        <div className="p-4 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground mb-2">
            <strong>Output Dimensions:</strong>
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-muted-foreground">Canvas:</span>
              <span className="ml-2 font-medium">
                {settings.sizing.targetSize}×{settings.sizing.targetSize}px
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Scale:</span>
              <span className="ml-2 font-medium">
                {(dimensions.scale * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Preview */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-foreground">Preview</p>
        <div className="grid grid-cols-2 gap-4">
          <CanvasPreview
            imageData={previewFrame}
            width={150}
            height={150}
            showGrid={true}
            label="Before"
          />
          <CanvasPreview
            imageData={normalizedPreview}
            width={150}
            height={150}
            showGrid={true}
            label="After"
          />
        </div>
      </div>

      {/* Frame Selector for Preview */}
      {framesToUse.length > 1 && (
        <Slider
          label="Preview Frame"
          value={
            previewFrame
              ? framesToUse.findIndex((f) => f === previewFrame)
              : 0
          }
          min={0}
          max={framesToUse.length - 1}
          step={1}
          onChange={(index) => setPreviewFrame(framesToUse[index])}
          valueFormatter={(v) => `Frame ${v + 1}`}
        />
      )}

      {/* Processing Progress */}
      {isProcessing && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Normalizing frames...</span>
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
      {processingError && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive">{processingError}</p>
        </div>
      )}

      {/* Success Message */}
      {hasNormalizedFrames && !isProcessing && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
          <p className="text-sm text-green-600 dark:text-green-400">
            Successfully normalized {frames.processed.length} frames to{' '}
            {settings.sizing.targetSize}×{settings.sizing.targetSize}px!
          </p>
        </div>
      )}

      {/* Info Box */}
      <div className="p-4 bg-muted/50 rounded-lg">
        <p className="text-xs text-muted-foreground">
          <strong>Tip:</strong> Bottom alignment keeps character feet grounded
          across all frames. Use padding reduction to remove extra space from
          AI-generated videos.
        </p>
      </div>

      {/* Apply Button */}
      {!hasNormalizedFrames && (
        <Button
          onClick={handleApply}
          disabled={isProcessing}
          className="w-full"
          size="lg"
        >
          {isProcessing ? 'Processing...' : 'Apply Normalization'}
        </Button>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-2">
        <Button
          onClick={() => setCurrentStep(4)}
          variant="outline"
          disabled={isProcessing}
        >
          Back
        </Button>
        {hasNormalizedFrames && (
          <Button
            onClick={() => setCurrentStep(6)}
            className="flex-1"
            size="lg"
            disabled={isProcessing}
          >
            Continue to Halo Removal
          </Button>
        )}
      </div>

      {/* Re-process Option */}
      {hasNormalizedFrames && !isProcessing && (
        <div className="pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground mb-3">
            Need to adjust settings?
          </p>
          <Button onClick={handleApply} variant="outline" className="w-full">
            Re-normalize with New Settings
          </Button>
        </div>
      )}
    </div>
  );
}
