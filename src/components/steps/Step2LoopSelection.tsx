'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { useStore } from '@/store';
import Slider from '@/components/ui/Slider';
import Button from '@/components/ui/Button';

export default function Step2LoopSelection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const animationRef = useRef<number | null>(null);

  const video = useStore((state) => state.video);
  const loop = useStore((state) => state.loop);
  const setLoopSelection = useStore((state) => state.setLoopSelection);
  const setCurrentStep = useStore((state) => state.setCurrentStep);

  const fps = video.metadata?.fps || 30;
  const totalFrames = video.metadata?.totalFrames || 0;
  const frameCount = loop.endFrame - loop.startFrame + 1;
  const duration = frameCount / fps;

  // Loop playback within selected range
  const updatePlayback = useCallback(() => {
    if (!videoRef.current || !video.metadata) return;

    const currentTime = videoRef.current.currentTime;
    const frame = Math.floor(currentTime * fps);
    setCurrentFrame(frame);

    const startTime = loop.startFrame / fps;
    const endTime = (loop.endFrame + 1) / fps;

    // Loop back to start if we've passed the end
    if (currentTime >= endTime) {
      videoRef.current.currentTime = startTime;
    }

    if (isPlaying) {
      animationRef.current = requestAnimationFrame(updatePlayback);
    }
  }, [fps, loop.startFrame, loop.endFrame, isPlaying, video.metadata]);

  useEffect(() => {
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(updatePlayback);
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, updatePlayback]);

  // Seek to start frame when loop selection changes
  useEffect(() => {
    if (videoRef.current && video.metadata) {
      const startTime = loop.startFrame / fps;
      videoRef.current.currentTime = startTime;
      setCurrentFrame(loop.startFrame);
    }
  }, [loop.startFrame, fps, video.metadata]);

  const handlePlayPause = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      // Ensure we start within the loop range
      const startTime = loop.startFrame / fps;
      const endTime = loop.endFrame / fps;
      if (
        videoRef.current.currentTime < startTime ||
        videoRef.current.currentTime > endTime
      ) {
        videoRef.current.currentTime = startTime;
      }
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleSeekFrame = (delta: number) => {
    if (!videoRef.current || !video.metadata) return;

    const newFrame = Math.max(
      loop.startFrame,
      Math.min(loop.endFrame, currentFrame + delta)
    );
    const newTime = newFrame / fps;
    videoRef.current.currentTime = newTime;
    setCurrentFrame(newFrame);
  };

  if (!video.metadata || !video.url) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Please upload a video first
        </p>
        <Button onClick={() => setCurrentStep(1)}>Back to Upload</Button>
      </div>
    );
  }

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
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-foreground">
          Loop Selection
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Select the frame range for your sprite animation
        </p>
      </div>

      {/* Video Player with Loop Preview */}
      <div className="w-full">
        <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            src={video.url}
            className="w-full h-full object-contain"
            muted
            playsInline
          />
          {/* Frame indicator overlay */}
          <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
            Frame {currentFrame} / {totalFrames - 1}
          </div>
        </div>

        {/* Playback Controls */}
        <div className="mt-4 flex items-center gap-2 justify-center">
          <button
            onClick={() => handleSeekFrame(-10)}
            className="px-3 py-2 bg-secondary hover:bg-secondary/80 rounded text-sm font-medium"
          >
            -10
          </button>
          <button
            onClick={() => handleSeekFrame(-1)}
            className="px-3 py-2 bg-secondary hover:bg-secondary/80 rounded text-sm font-medium"
          >
            -1
          </button>
          <button
            onClick={handlePlayPause}
            className="px-6 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded font-medium min-w-[100px]"
          >
            {isPlaying ? 'Pause' : 'Play Loop'}
          </button>
          <button
            onClick={() => handleSeekFrame(1)}
            className="px-3 py-2 bg-secondary hover:bg-secondary/80 rounded text-sm font-medium"
          >
            +1
          </button>
          <button
            onClick={() => handleSeekFrame(10)}
            className="px-3 py-2 bg-secondary hover:bg-secondary/80 rounded text-sm font-medium"
          >
            +10
          </button>
        </div>
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
      <div className="p-4 bg-accent/50 rounded-lg">
        <div className="grid grid-cols-3 gap-4 text-sm text-center">
          <div>
            <span className="text-muted-foreground block">Selected</span>
            <span className="font-medium text-foreground text-lg">{frameCount} frames</span>
          </div>
          <div>
            <span className="text-muted-foreground block">Duration</span>
            <span className="font-medium text-foreground text-lg">{duration.toFixed(2)}s</span>
          </div>
          <div>
            <span className="text-muted-foreground block">FPS</span>
            <span className="font-medium text-foreground text-lg">{fps}</span>
          </div>
        </div>
      </div>

      {/* Quick Presets */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-foreground">Quick Presets:</p>
        <div className="grid grid-cols-4 gap-2">
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
            First 5s
          </button>
          <button
            onClick={() =>
              setLoopSelection(Math.max(0, totalFrames - 150), totalFrames - 1)
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

      {/* Warnings */}
      {frameCount > 500 && frameCount <= 1000 && (
        <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
          <p className="text-sm text-orange-600 dark:text-orange-400">
            Warning: {frameCount} frames selected. Large frame counts may take
            longer to process.
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
      <div className="flex gap-3">
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
    </div>
  );
}
