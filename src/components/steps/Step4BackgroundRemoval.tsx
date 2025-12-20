'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/store';
import { useChromaKey } from '@/hooks/useChromaKey';
import { previewChromaKey, detectBackgroundColor } from '@/lib/processing/chromaKey';
import ColorPicker from '@/components/ui/ColorPicker';
import Slider from '@/components/ui/Slider';
import Button from '@/components/ui/Button';
import CanvasPreview from '@/components/ui/CanvasPreview';

export default function Step4BackgroundRemoval() {
  const frames = useStore((state) => state.frames);
  const settings = useStore((state) => state.settings);
  const setChromaKeySettings = useStore((state) => state.setChromaKeySettings);
  const setCurrentStep = useStore((state) => state.setCurrentStep);
  const isProcessing = useStore((state) => state.isProcessing);
  const progress = useStore((state) => state.progress);

  const { handleApplyChromaKey, processingError } = useChromaKey();

  const [previewFrame, setPreviewFrame] = useState<ImageData | null>(null);
  const [processedPreview, setProcessedPreview] = useState<ImageData | null>(null);

  const hasFrames = frames.raw.length > 0;
  const hasProcessedFrames = frames.processed.length > 0;

  // Set initial preview frame
  useEffect(() => {
    if (frames.raw.length > 0 && !previewFrame) {
      const middleIndex = Math.floor(frames.raw.length / 2);
      setPreviewFrame(frames.raw[middleIndex]);
    }
  }, [frames.raw, previewFrame]);

  // Update preview when settings change
  useEffect(() => {
    if (previewFrame) {
      const processed = previewChromaKey(
        previewFrame,
        settings.chromaKey.color,
        settings.chromaKey.threshold,
        settings.chromaKey.feathering
      );
      setProcessedPreview(processed);
    }
  }, [previewFrame, settings.chromaKey]);

  const handleAutoDetect = () => {
    if (previewFrame) {
      const detectedColor = detectBackgroundColor(previewFrame);
      setChromaKeySettings({ color: detectedColor });
    }
  };

  const handleApply = async () => {
    const success = await handleApplyChromaKey();
    if (success) {
      setCurrentStep(5);
    }
  };

  if (!hasFrames) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Please extract frames first
        </p>
        <Button onClick={() => setCurrentStep(3)}>Back to Frame Extraction</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-foreground">
          Background Removal
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Remove background using chroma key
        </p>
      </div>

      {/* Color Picker */}
      <ColorPicker
        color={settings.chromaKey.color}
        onChange={(color) => setChromaKeySettings({ color })}
        label="Chroma Key Color"
        showPresets={true}
      />

      {/* Auto-Detect Button */}
      <Button onClick={handleAutoDetect} variant="outline" className="w-full">
        Auto-Detect Background Color
      </Button>

      {/* Threshold Slider */}
      <Slider
        label="Threshold"
        value={settings.chromaKey.threshold}
        min={0}
        max={1}
        step={0.01}
        onChange={(value) => setChromaKeySettings({ threshold: value })}
        valueFormatter={(v) => v.toFixed(2)}
      />

      {/* Feathering Slider */}
      <Slider
        label="Feathering (Soft Edge)"
        value={settings.chromaKey.feathering}
        min={0}
        max={0.5}
        step={0.01}
        onChange={(value) => setChromaKeySettings({ feathering: value })}
        valueFormatter={(v) => v.toFixed(2)}
      />

      {/* Preview */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-foreground text-center">Preview</p>
        <div className="grid grid-cols-2 gap-6">
          <CanvasPreview
            imageData={previewFrame}
            width={250}
            height={250}
            showGrid={false}
            label="Before"
          />
          <CanvasPreview
            imageData={processedPreview}
            width={250}
            height={250}
            showGrid={true}
            label="After"
          />
        </div>
      </div>

      {/* Frame Selector for Preview */}
      {frames.raw.length > 1 && (
        <Slider
          label="Preview Frame"
          value={
            previewFrame
              ? frames.raw.findIndex((f) => f === previewFrame)
              : 0
          }
          min={0}
          max={frames.raw.length - 1}
          step={1}
          onChange={(index) => setPreviewFrame(frames.raw[index])}
          valueFormatter={(v) => `Frame ${v + 1}`}
        />
      )}

      {/* Processing Progress */}
      {isProcessing && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Applying chroma key...
            </span>
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
      {hasProcessedFrames && !isProcessing && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
          <p className="text-sm text-green-600 dark:text-green-400">
            Successfully processed {frames.processed.length} frames!
          </p>
        </div>
      )}

      {/* Info Box */}
      <div className="p-4 bg-muted/50 rounded-lg">
        <p className="text-xs text-muted-foreground">
          <strong>Tip:</strong> Adjust the threshold to control how much of the
          background is removed. Use feathering to create softer edges.
          The algorithm is deterministic - same settings always produce identical results.
        </p>
      </div>

      {/* Apply Button */}
      {!hasProcessedFrames && (
        <Button
          onClick={handleApply}
          disabled={isProcessing}
          className="w-full"
          size="lg"
        >
          {isProcessing ? 'Processing...' : 'Apply to All Frames'}
        </Button>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-2">
        <Button
          onClick={() => setCurrentStep(3)}
          variant="outline"
          disabled={isProcessing}
        >
          Back
        </Button>
        {hasProcessedFrames && (
          <Button
            onClick={() => setCurrentStep(5)}
            className="flex-1"
            size="lg"
            disabled={isProcessing}
          >
            Continue to Auto-Crop
          </Button>
        )}
      </div>

      {/* Re-process Option */}
      {hasProcessedFrames && !isProcessing && (
        <div className="pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground mb-3">
            Need to adjust settings?
          </p>
          <Button onClick={handleApply} variant="outline" className="w-full">
            Re-process with New Settings
          </Button>
        </div>
      )}
    </div>
  );
}
