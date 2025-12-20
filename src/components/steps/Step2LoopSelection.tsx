'use client';

import { useStore } from '@/store';
import Slider from '@/components/ui/Slider';
import Button from '@/components/ui/Button';

export default function Step2LoopSelection() {
  const video = useStore((state) => state.video);
  const loop = useStore((state) => state.loop);
  const setLoopSelection = useStore((state) => state.setLoopSelection);
  const setCurrentStep = useStore((state) => state.setCurrentStep);

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

  const { totalFrames, fps } = video.metadata;
  const frameCount = loop.endFrame - loop.startFrame + 1;
  const duration = frameCount / fps;

  const handleStartChange = (value: number) => {
    const newStart = Math.min(value, loop.endFrame - 1);
    setLoopSelection(newStart, loop.endFrame);
  };

  const handleEndChange = (value: number) => {
    const newEnd = Math.max(value, loop.startFrame + 1);
    setLoopSelection(loop.startFrame, newEnd);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground">
          Loop Selection
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Select the frame range for your loop
        </p>
      </div>

      {/* Frame Range Sliders */}
      <div className="space-y-4">
        <Slider
          label="Start Frame"
          value={loop.startFrame}
          min={0}
          max={totalFrames - 1}
          step={1}
          onChange={handleStartChange}
          valueFormatter={(v) => `Frame ${v}`}
        />

        <Slider
          label="End Frame"
          value={loop.endFrame}
          min={0}
          max={totalFrames - 1}
          step={1}
          onChange={handleEndChange}
          valueFormatter={(v) => `Frame ${v}`}
        />
      </div>

      {/* Selection Info */}
      <div className="p-4 bg-accent/50 rounded-lg space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Selected Frames:</span>
          <span className="font-medium text-foreground">{frameCount}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Duration:</span>
          <span className="font-medium text-foreground">
            {duration.toFixed(2)}s
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">FPS:</span>
          <span className="font-medium text-foreground">{fps}</span>
        </div>
      </div>

      {/* Warning for large frame counts */}
      {frameCount > 500 && (
        <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
          <p className="text-sm text-orange-600 dark:text-orange-400">
            Warning: {frameCount} frames selected. Large frame counts may take
            longer to process and use more memory.
          </p>
        </div>
      )}

      {frameCount > 1000 && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive">
            Error: Maximum 1000 frames allowed. Please reduce your selection.
          </p>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-2">
        <Button onClick={() => setCurrentStep(1)} variant="outline">
          Back
        </Button>
        <Button
          onClick={() => setCurrentStep(3)}
          className="flex-1"
          size="lg"
          disabled={frameCount > 1000}
        >
          Continue to Frame Extraction
        </Button>
      </div>

      {/* Quick Presets */}
      <div className="pt-4 border-t border-border">
        <p className="text-sm font-medium text-foreground mb-3">
          Quick Presets:
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setLoopSelection(0, totalFrames - 1)}
            className="px-3 py-2 bg-secondary hover:bg-secondary/80 rounded text-sm"
          >
            Full Video
          </button>
          <button
            onClick={() => setLoopSelection(0, Math.min(149, totalFrames - 1))}
            className="px-3 py-2 bg-secondary hover:bg-secondary/80 rounded text-sm"
          >
            First 5s (150f @ 30fps)
          </button>
          <button
            onClick={() =>
              setLoopSelection(
                Math.max(0, totalFrames - 150),
                totalFrames - 1
              )
            }
            className="px-3 py-2 bg-secondary hover:bg-secondary/80 rounded text-sm"
          >
            Last 5s
          </button>
          <button
            onClick={() => {
              const mid = Math.floor(totalFrames / 2);
              setLoopSelection(
                Math.max(0, mid - 75),
                Math.min(mid + 74, totalFrames - 1)
              );
            }}
            className="px-3 py-2 bg-secondary hover:bg-secondary/80 rounded text-sm"
          >
            Middle 5s
          </button>
        </div>
      </div>
    </div>
  );
}
