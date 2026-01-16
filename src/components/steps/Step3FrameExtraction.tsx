'use client';

import { useStore } from '@/store';
import { useFrameExtraction } from '@/hooks/useFrameExtraction';
import Button from '@/components/ui/Button';
import FrameGrid from '@/components/ui/FrameGrid';

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
      </div>
    );
  }

  const totalFrameCount = loop.endFrame - loop.startFrame + 1;
  const exportedFrameCount = Math.ceil(totalFrameCount / loop.frameSkip);
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
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-foreground">
          Frame Extraction
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Extract individual frames from your selected video range
        </p>
      </div>

      {/* Extraction Info */}
      <div className="p-4 bg-accent/50 rounded-lg">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-center">
          <div>
            <span className="text-muted-foreground block">Range</span>
            <span className="font-medium text-foreground">
              {loop.startFrame} - {loop.endFrame}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground block">Frames</span>
            <span className="font-medium text-foreground">
              {exportedFrameCount}
              {loop.frameSkip > 1 && (
                <span className="text-xs text-muted-foreground ml-1">
                  (of {totalFrameCount})
                </span>
              )}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground block">FPS</span>
            <span className="font-medium text-foreground">
              {video.metadata.fps}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground block">Size</span>
            <span className="font-medium text-foreground">
              {video.metadata.width} × {video.metadata.height}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {isExtracting && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Extracting frames...</span>
            <span className="font-medium text-foreground">{progress}%</span>
          </div>
          <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
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

      {/* Frame Preview Grid */}
      {hasExtractedFrames && !isExtracting && (
        <div className="space-y-4">
          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
            <p className="text-sm text-green-600 dark:text-green-400 text-center">
              ✓ Successfully extracted {frames.raw.length} frames!
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-foreground mb-3">
              Extracted Frames Preview:
            </p>
            <FrameGrid thumbnails={frames.thumbnails} maxVisible={24} />
          </div>
        </div>
      )}

      {/* Extraction Button */}
      {!hasExtractedFrames && !isExtracting && (
        <Button
          onClick={handleExtract}
          disabled={isExtracting || isProcessing}
          className="w-full"
          size="lg"
        >
          Extract Frames
        </Button>
      )}

      {/* Navigation Buttons */}
      {hasExtractedFrames && (
        <Button
          onClick={() => setCurrentStep(4)}
          className="w-full"
          size="lg"
          disabled={isExtracting}
        >
          Continue to Background Removal
        </Button>
      )}

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
          <strong>Note:</strong> Frame extraction processes your video entirely
          in your browser using the Canvas API. No data is sent to any server.
        </p>
      </div>
    </div>
  );
}
