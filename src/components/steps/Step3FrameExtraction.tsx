'use client';

import { useStore } from '@/store';
import { useFrameExtraction } from '@/hooks/useFrameExtraction';
import Button from '@/components/ui/Button';

export default function Step3FrameExtraction() {
  const video = useStore((state) => state.video);
  const loop = useStore((state) => state.loop);
  const frames = useStore((state) => state.frames);
  const isProcessing = useStore((state) => state.isProcessing);
  const progress = useStore((state) => state.progress);
  const setCurrentStep = useStore((state) => state.setCurrentStep);

  const { handleExtractFrames, isExtracting, extractionError } =
    useFrameExtraction();

  if (!video.metadata) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Please upload a video first
        </p>
        <Button onClick={() => setCurrentStep(1)}>Back to Upload</Button>
      </div>
    );
  }

  const frameCount = loop.endFrame - loop.startFrame + 1;
  const hasExtractedFrames = frames.raw.length > 0;

  const handleExtract = async () => {
    const success = await handleExtractFrames();
    if (success) {
      // Auto-advance to next step
      setCurrentStep(4);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground">
          Frame Extraction
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Extract frames from your video
        </p>
      </div>

      {/* Extraction Info */}
      <div className="p-4 bg-accent/50 rounded-lg space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Frame Range:</span>
          <span className="font-medium text-foreground">
            {loop.startFrame} - {loop.endFrame}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Total Frames:</span>
          <span className="font-medium text-foreground">{frameCount}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">FPS:</span>
          <span className="font-medium text-foreground">
            {video.metadata.fps}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Dimensions:</span>
          <span className="font-medium text-foreground">
            {video.metadata.width} × {video.metadata.height}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      {isExtracting && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Extracting frames...</span>
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
      {extractionError && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive">{extractionError}</p>
        </div>
      )}

      {/* Success Message */}
      {hasExtractedFrames && !isExtracting && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
          <p className="text-sm text-green-600 dark:text-green-400">
            Successfully extracted {frames.raw.length} frames!
          </p>
        </div>
      )}

      {/* Extraction Button */}
      {!hasExtractedFrames && (
        <Button
          onClick={handleExtract}
          disabled={isExtracting || isProcessing}
          className="w-full"
          size="lg"
        >
          {isExtracting ? 'Extracting Frames...' : 'Extract Frames'}
        </Button>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-2">
        <Button
          onClick={() => setCurrentStep(2)}
          variant="outline"
          disabled={isExtracting}
        >
          Back
        </Button>
        {hasExtractedFrames && (
          <Button
            onClick={() => setCurrentStep(4)}
            className="flex-1"
            size="lg"
            disabled={isExtracting}
          >
            Continue to Background Removal
          </Button>
        )}
      </div>

      {/* Re-extract Option */}
      {hasExtractedFrames && !isExtracting && (
        <div className="pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground mb-3">
            Need to re-extract with different settings?
          </p>
          <Button onClick={handleExtract} variant="outline" className="w-full">
            Re-extract Frames
          </Button>
        </div>
      )}

      {/* Info Box */}
      <div className="p-4 bg-muted/50 rounded-lg">
        <p className="text-xs text-muted-foreground">
          <strong>Note:</strong> Frame extraction uses FFmpeg.wasm to process
          your video entirely in your browser. No data is sent to any server.
          The first extraction may take a moment as we load the necessary
          libraries.
        </p>
      </div>
    </div>
  );
}
