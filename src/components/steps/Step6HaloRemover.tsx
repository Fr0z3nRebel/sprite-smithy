'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/store';
import { useHaloRemoval } from '@/hooks/useHaloRemoval';
import { previewHaloRemoval, analyzeHaloImpact } from '@/lib/processing/haloRemoval';
import Slider from '@/components/ui/Slider';
import Button from '@/components/ui/Button';
import CanvasPreview, { BackgroundType } from '@/components/ui/CanvasPreview';

export default function Step6HaloRemover() {
  const frames = useStore((state) => state.frames);
  const settings = useStore((state) => state.settings);
  const setHaloRemovalSettings = useStore((state) => state.setHaloRemovalSettings);
  const setCurrentStep = useStore((state) => state.setCurrentStep);
  const isProcessing = useStore((state) => state.isProcessing);
  const progress = useStore((state) => state.progress);

  const { handleApplyHaloRemoval, processingError } = useHaloRemoval();

  const [previewFrame, setPreviewFrame] = useState<ImageData | null>(null);
  const [processedPreview, setProcessedPreview] = useState<ImageData | null>(null);
  const [previewBackground, setPreviewBackground] = useState<BackgroundType>('checkerboard');
  const [haloImpact, setHaloImpact] = useState<{
    edgePixels: number;
    totalOpaquePixels: number;
    percentageAffected: number;
  } | null>(null);

  const hasFrames = frames.raw.length > 0;
  const framesToUse = frames.processed.length > 0 ? frames.processed : frames.raw;
  const hasProcessedHalo = frames.processed.length > 0 && settings.haloRemoval.strength > 0;

  // Set initial preview frame
  useEffect(() => {
    if (framesToUse.length > 0 && !previewFrame) {
      const middleIndex = Math.floor(framesToUse.length / 2);
      setPreviewFrame(framesToUse[middleIndex]);
    }
  }, [framesToUse, previewFrame]);

  // Update preview when settings change
  useEffect(() => {
    if (previewFrame) {
      const processed = previewHaloRemoval(
        previewFrame,
        settings.haloRemoval.strength
      );
      setProcessedPreview(processed);

      // Analyze impact
      const impact = analyzeHaloImpact(previewFrame);
      setHaloImpact(impact);
    }
  }, [previewFrame, settings.haloRemoval.strength]);

  const handleApply = async () => {
    const success = await handleApplyHaloRemoval();
    if (success) {
      setCurrentStep(7);
    }
  };

  const handleSkip = () => {
    // Skip halo removal and go to export
    setCurrentStep(7);
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

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-foreground">
          Halo Remover
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Remove color bleeding artifacts from edges
        </p>
      </div>

      {/* Info Box */}
      <div className="p-4 bg-muted/50 rounded-lg">
        <p className="text-xs text-muted-foreground">
          <strong>What are halos?</strong> Color bleeding artifacts that appear
          at the edges where the background was removed. This tool removes them
          by eroding edge pixels.
        </p>
      </div>

      {/* Strength Slider */}
      <Slider
        label="Strength (Pixels to Erode)"
        value={settings.haloRemoval.strength}
        min={0}
        max={5}
        step={1}
        onChange={(value) => setHaloRemovalSettings({ strength: value })}
        valueFormatter={(v) => `${v} ${v === 1 ? 'pixel' : 'pixels'}`}
      />

      {/* Impact Analysis */}
      {haloImpact && settings.haloRemoval.strength > 0 && (
        <div className="p-4 bg-accent/50 rounded-lg space-y-2">
          <p className="text-sm font-medium text-foreground">Impact Analysis</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-muted-foreground">Edge Pixels:</span>
              <span className="ml-2 font-medium">{haloImpact.edgePixels}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Will Remove:</span>
              <span className="ml-2 font-medium">
                ~{haloImpact.edgePixels * settings.haloRemoval.strength} pixels
              </span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            This will affect approximately {haloImpact.percentageAffected}% of
            edge pixels per iteration.
          </p>
        </div>
      )}

      {/* Preview */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-foreground">Preview</p>
          {/* Background Toggle */}
          <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
            <button
              onClick={() => setPreviewBackground('checkerboard')}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                previewBackground === 'checkerboard'
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-secondary/80'
              }`}
              title="Checkerboard background"
            >
              ▦
            </button>
            <button
              onClick={() => setPreviewBackground('dark')}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                previewBackground === 'dark'
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-secondary/80'
              }`}
              title="Dark background"
            >
              ◼
            </button>
            <button
              onClick={() => setPreviewBackground('light')}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                previewBackground === 'light'
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-secondary/80'
              }`}
              title="Light background"
            >
              ◻
            </button>
          </div>
        </div>
        <div className="flex justify-center">
          <CanvasPreview
            imageData={processedPreview}
            width={Math.min(settings.sizing.targetSize, 512)}
            height={Math.min(settings.sizing.targetSize, 512)}
            showGrid={true}
            backgroundColor={previewBackground}
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
            <span className="text-muted-foreground">
              Removing halos...
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
      {hasProcessedHalo && !isProcessing && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
          <p className="text-sm text-green-600 dark:text-green-400">
            Successfully removed halos from {frames.processed.length} frames!
          </p>
        </div>
      )}

      {/* Warning for strength 0 */}
      {settings.haloRemoval.strength === 0 && (
        <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
          <p className="text-sm text-orange-600 dark:text-orange-400">
            Strength is set to 0. No halo removal will be applied. You can skip
            this step if you don't have halo artifacts.
          </p>
        </div>
      )}

      {/* Tip Box */}
      <div className="p-4 bg-muted/50 rounded-lg">
        <p className="text-xs text-muted-foreground">
          <strong>Tip:</strong> Start with strength 1-2. Higher values remove
          more edge pixels but may make sprites look thinner. Preview different
          frames to ensure the effect looks good across your animation.
        </p>
      </div>

      {/* Apply Button */}
      {!hasProcessedHalo && settings.haloRemoval.strength > 0 && (
        <Button
          onClick={handleApply}
          disabled={isProcessing}
          className="w-full"
          size="lg"
        >
          {isProcessing ? 'Processing...' : 'Apply Halo Removal'}
        </Button>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-2">
        <Button
          onClick={() => setCurrentStep(5)}
          variant="outline"
          disabled={isProcessing}
        >
          Back
        </Button>

        {/* Skip button if strength is 0 */}
        {settings.haloRemoval.strength === 0 && (
          <Button
            onClick={handleSkip}
            className="flex-1"
            size="lg"
            disabled={isProcessing}
          >
            Skip to Export
          </Button>
        )}

        {/* Continue button if processed */}
        {(hasProcessedHalo || settings.haloRemoval.strength === 0) && (
          <Button
            onClick={() => setCurrentStep(7)}
            className="flex-1"
            size="lg"
            disabled={isProcessing}
          >
            Continue to Export
          </Button>
        )}
      </div>

      {/* Re-process Option */}
      {hasProcessedHalo && !isProcessing && (
        <div className="pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground mb-3">
            Need to adjust strength?
          </p>
          <Button onClick={handleApply} variant="outline" className="w-full">
            Re-process with New Settings
          </Button>
        </div>
      )}
    </div>
  );
}
