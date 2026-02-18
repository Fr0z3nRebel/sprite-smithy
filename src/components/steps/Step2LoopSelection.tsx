'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { useStore } from '@/store';
import Slider from '@/components/ui/Slider';
import Button from '@/components/ui/Button';
import { getFrameAtFrameIndex } from '@/lib/video/videoInfo';
import { compareFrames } from '@/lib/video/frameComparison';
import { Search } from 'lucide-react';

export default function Step2LoopSelection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isFindingEndFrame, setIsFindingEndFrame] = useState(false);
  const [findEndMessage, setFindEndMessage] = useState<string | null>(null);
  const animationRef = useRef<number | null>(null);
  const frameSkipTimerRef = useRef<number | null>(null);
  const playPromiseRef = useRef<Promise<void> | null>(null);

  const video = useStore((state) => state.video);
  const loop = useStore((state) => state.loop);
  const previewFps = useStore((state) => state.previewFps);
  const setLoopSelection = useStore((state) => state.setLoopSelection);
  const setFrameSkip = useStore((state) => state.setFrameSkip);
  const setPreviewFps = useStore((state) => state.setPreviewFps);
  const setCurrentStep = useStore((state) => state.setCurrentStep);

  const fps = video.metadata?.fps || 30;
  const displayFps = previewFps ?? fps; // Use preview FPS if set, otherwise use actual FPS
  const totalFrames = video.metadata?.totalFrames || 0;
  const frameCount = loop.endFrame - loop.startFrame + 1;
  const duration = frameCount / fps;
  
  // Calculate actual frames that will be exported based on skip value
  const exportedFrameCount = Math.ceil(frameCount / loop.frameSkip);

  // Frame-by-frame advance for frame skip preview
  const advanceFrameSkip = useCallback(() => {
    if (!videoRef.current || !video.metadata || !isPlaying) return;

    const videoEl = videoRef.current;
    const currentFrameNum = Math.floor(videoEl.currentTime * fps);
    const frameOffset = currentFrameNum - loop.startFrame;
    
    // Calculate next valid frame
    const nextValidOffset = frameOffset + loop.frameSkip;
    const nextValidFrame = loop.startFrame + nextValidOffset;
    
    if (nextValidFrame <= loop.endFrame) {
      const nextValidTime = nextValidFrame / fps;
      videoEl.currentTime = nextValidTime;
      setCurrentFrame(nextValidFrame);

      // Time per exported frame at preview FPS (each displayed frame = 1/displayFps s)
      const timePerExportedFrame = 1 / displayFps;
      frameSkipTimerRef.current = window.setTimeout(
        advanceFrameSkip,
        timePerExportedFrame * 1000
      );
    } else {
      // Loop back to start
      const startTime = loop.startFrame / fps;
      videoEl.currentTime = startTime;
      setCurrentFrame(loop.startFrame);
      const timePerExportedFrame = 1 / displayFps;
      frameSkipTimerRef.current = window.setTimeout(
        advanceFrameSkip,
        timePerExportedFrame * 1000
      );
    }
  }, [fps, displayFps, loop.startFrame, loop.endFrame, loop.frameSkip, isPlaying, video.metadata]);

  // Loop playback within selected range
  const updatePlayback = useCallback(() => {
    if (!videoRef.current || !video.metadata) return;

    const videoEl = videoRef.current;
    const currentTime = videoEl.currentTime;
    const frame = Math.floor(currentTime * fps);
    setCurrentFrame(frame);

    const startTime = loop.startFrame / fps;
    const endTime = (loop.endFrame + 1) / fps;

    // Loop back to start if we've passed the end
    if (currentTime >= endTime) {
      videoEl.currentTime = startTime;
      setCurrentFrame(loop.startFrame);
    }

    // Ensure video keeps playing if it should be playing (only in normal playback mode)
    if (isPlaying && loop.frameSkip === 1 && videoEl.paused && videoEl.readyState >= 2) {
      if (!playPromiseRef.current) {
        const playPromise = videoEl.play();
        playPromiseRef.current = playPromise;
        playPromise.catch(() => {}).finally(() => {
          if (playPromiseRef.current === playPromise) playPromiseRef.current = null;
        });
      }
    }

    if (isPlaying) {
      animationRef.current = requestAnimationFrame(updatePlayback);
    }
  }, [fps, loop.startFrame, loop.endFrame, loop.frameSkip, isPlaying, video.metadata]);

  // Update video playback rate when preview FPS changes
  useEffect(() => {
    if (videoRef.current) {
      if (loop.frameSkip === 1) {
        // Only adjust playback rate for normal playback (not frame skip mode)
        // Clamp playback rate to supported range (0.25 to 4.0)
        const playbackRate = Math.max(0.25, Math.min(4.0, displayFps / fps));
        videoRef.current.playbackRate = playbackRate;
      } else {
        // Reset playback rate in frame skip mode (we control timing manually)
        videoRef.current.playbackRate = 1;
      }
    }
  }, [displayFps, fps, loop.frameSkip]);

  useEffect(() => {
    // Clean up any existing timers/animations
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    if (frameSkipTimerRef.current) {
      clearTimeout(frameSkipTimerRef.current);
      frameSkipTimerRef.current = null;
    }

    if (isPlaying) {
      if (loop.frameSkip > 1) {
        // Use frame-by-frame advance for frame skip preview
        const videoEl = videoRef.current;
        if (videoEl && video.metadata) {
          // Cancel any pending play operations
          if (playPromiseRef.current) {
            playPromiseRef.current.catch(() => {});
            playPromiseRef.current = null;
          }
          // Pause the video and use manual frame advance
          videoEl.pause();
          // Start from current position or start frame
          const currentFrameNum = Math.floor(videoEl.currentTime * fps);
          const frameOffset = currentFrameNum - loop.startFrame;
          const nearestValidOffset = Math.floor(frameOffset / loop.frameSkip) * loop.frameSkip;
          const startFrame = loop.startFrame + nearestValidOffset;
          const startTime = startFrame / fps;
          videoEl.currentTime = startTime;
          setCurrentFrame(startFrame);

          // Time per exported frame at preview FPS
          const timePerExportedFrame = 1 / displayFps;
          frameSkipTimerRef.current = window.setTimeout(
            advanceFrameSkip,
            timePerExportedFrame * 1000
          );
        }
      } else {
        // Normal continuous playback
        const videoEl = videoRef.current;
        if (videoEl && videoEl.paused) {
          // Cancel any pending play operations before starting a new one
          if (playPromiseRef.current) {
            playPromiseRef.current.catch(() => {});
          }
          const playPromise = videoEl.play();
          playPromiseRef.current = playPromise;
          playPromise.catch(() => {
            // Ignore autoplay errors
          }).finally(() => {
            // Clear the promise ref once it resolves/rejects
            if (playPromiseRef.current === playPromise) {
              playPromiseRef.current = null;
            }
          });
        }
        animationRef.current = requestAnimationFrame(updatePlayback);
      }
    } else {
      // Not playing - cancel any pending play operations
      if (playPromiseRef.current) {
        playPromiseRef.current.catch(() => {});
        playPromiseRef.current = null;
      }
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      if (frameSkipTimerRef.current) {
        clearTimeout(frameSkipTimerRef.current);
        frameSkipTimerRef.current = null;
      }
    };
  }, [isPlaying, updatePlayback, advanceFrameSkip, loop.frameSkip, fps, video.metadata, displayFps]);

  // Seek to start frame when video first loads (only if not playing)
  useEffect(() => {
    if (videoRef.current && video.metadata && !isPlaying) {
      // Only seek on initial load, not when sliders change (handlers do that)
      const startTime = loop.startFrame / fps;
      const currentTime = videoRef.current.currentTime;
      // Only seek if we're not already at a valid frame in the range
      if (currentTime < loop.startFrame / fps || currentTime > (loop.endFrame + 1) / fps) {
        videoRef.current.currentTime = startTime;
        setCurrentFrame(loop.startFrame);
      }
    }
    // Only run when video metadata changes, not when loop selection changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [video.metadata, fps]);

  // Jump to nearest valid frame when frame skip changes
  useEffect(() => {
    if (videoRef.current && video.metadata) {
      const currentFrame = Math.floor(videoRef.current.currentTime * fps);
      
      if (currentFrame >= loop.startFrame && currentFrame <= loop.endFrame) {
        // Calculate the nearest valid frame based on skip
        const frameOffset = currentFrame - loop.startFrame;
        const nearestValidOffset = Math.floor(frameOffset / loop.frameSkip) * loop.frameSkip;
        const nearestValidFrame = loop.startFrame + nearestValidOffset;
        
        // Ensure we don't exceed endFrame
        const validFrame = Math.min(nearestValidFrame, loop.endFrame);
        const validTime = validFrame / fps;
        
        videoRef.current.currentTime = validTime;
        setCurrentFrame(validFrame);
      }
    }
  }, [loop.frameSkip, fps, video.metadata, loop.startFrame, loop.endFrame]);

  // Seek to start frame when video becomes available (but don't auto-play)
  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl || !video.metadata || !video.url) return;

    const seekToStart = () => {
      const startTime = loop.startFrame / fps;
      videoEl.currentTime = startTime;
      setCurrentFrame(loop.startFrame);
    };

    // Wait for video to be ready
    if (videoEl.readyState >= 2) {
      // Video is already loaded
      seekToStart();
    } else {
      // Wait for video to load
      const handleCanPlay = () => {
        seekToStart();
        videoEl.removeEventListener('canplay', handleCanPlay);
      };
      videoEl.addEventListener('canplay', handleCanPlay);
      return () => {
        videoEl.removeEventListener('canplay', handleCanPlay);
      };
    }
  }, [video.url, video.metadata, loop.startFrame, fps]); // Run when video becomes available

  // Handle video ended event to restart loop
  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl || !video.metadata) return;

    const handleEnded = () => {
      if (isPlaying && loop.frameSkip === 1) {
        const startTime = loop.startFrame / fps;
        videoEl.currentTime = startTime;
        // Cancel any pending play operations
        if (playPromiseRef.current) {
          playPromiseRef.current.catch(() => {});
        }
        const playPromise = videoEl.play();
        playPromiseRef.current = playPromise;
        playPromise.catch(() => {
          // Ignore autoplay errors
        }).finally(() => {
          if (playPromiseRef.current === playPromise) {
            playPromiseRef.current = null;
          }
        });
      }
    };

    videoEl.addEventListener('ended', handleEnded);
    return () => {
      videoEl.removeEventListener('ended', handleEnded);
    };
  }, [isPlaying, loop.startFrame, fps, video.metadata]);

  // Keep video playing if it pauses unexpectedly (but should be playing)
  // Only for normal playback mode (frameSkip === 1), not frame skip mode
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isPlaying || loop.frameSkip > 1) return;

    const checkPlaying = () => {
      if (
        isPlaying &&
        loop.frameSkip === 1 &&
        video.paused &&
        video.readyState >= 2
      ) {
        // Only call play if there's no pending play operation
        if (!playPromiseRef.current) {
          const playPromise = video.play();
          playPromiseRef.current = playPromise;
          playPromise.catch(() => {
            // Ignore autoplay errors
          }).finally(() => {
            if (playPromiseRef.current === playPromise) {
              playPromiseRef.current = null;
            }
          });
        }
      }
    };

    const interval = setInterval(checkPlaying, 100);
    return () => clearInterval(interval);
  }, [isPlaying, loop.frameSkip]);

  const handlePlayPause = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      // Cancel any pending play operations before pausing
      if (playPromiseRef.current) {
        playPromiseRef.current.catch(() => {});
        playPromiseRef.current = null;
      }
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
      // Cancel any pending play operations
      if (playPromiseRef.current) {
        playPromiseRef.current.catch(() => {});
      }
      const playPromise = videoRef.current.play();
      playPromiseRef.current = playPromise;
      playPromise.catch(() => {
        // Ignore autoplay errors
      }).finally(() => {
        if (playPromiseRef.current === playPromise) {
          playPromiseRef.current = null;
        }
      });
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
      </div>
    );
  }

  const handleStartChange = (value: number) => {
    const newStart = Math.min(value, loop.endFrame - 1);
    setLoopSelection(newStart, loop.endFrame);
    // Seek to the selected start frame (always, even if playing)
    if (videoRef.current && video.metadata) {
      const frameTime = newStart / fps;
      videoRef.current.currentTime = frameTime;
      setCurrentFrame(newStart);
    }
  };

  const handleEndChange = (value: number) => {
    const newEnd = Math.max(value, loop.startFrame + 1);
    setLoopSelection(loop.startFrame, newEnd);
    // Seek to the selected end frame (always, even if playing)
    if (videoRef.current && video.metadata) {
      const frameTime = newEnd / fps;
      videoRef.current.currentTime = frameTime;
      setCurrentFrame(newEnd);
    }
  };

  const handleFrameSkipChange = (value: number) => {
    setFrameSkip(value);
  };

  const handlePreviewFpsChange = (value: number) => {
    setPreviewFps(value);
  };

  const handleFindEndFrame = useCallback(async () => {
    const videoEl = videoRef.current;
    if (!videoEl || !video.metadata) return;

    setFindEndMessage(null);

    const minGap = 6;
    if (loop.startFrame + minGap > totalFrames - 1) {
      setFindEndMessage('Need at least 6 frames after start');
      return;
    }

    setIsFindingEndFrame(true);
    const wasPlaying = !videoEl.paused;
    try {
      videoEl.pause();

      const reference = await getFrameAtFrameIndex(
        videoEl,
        loop.startFrame,
        fps
      );

      const firstCandidate = loop.startFrame + minGap;
      const lastCandidate = totalFrames - 1;
      const compareOpts = { useLuminance: true };
      const goodEnoughThreshold = 2;

      const search = async (
        from: number,
        to: number,
        step: number,
        maxSize: number,
        earlyExit: boolean
      ): Promise<{ bestFrame: number; bestDiff: number }> => {
        let bestFrame = from;
        let bestDiff = Infinity;
        const opts = { ...compareOpts, maxSize };
        const BATCH_SIZE = 15;
        let count = 0;
        for (let i = from; i <= to; i += step) {
          const frame = await getFrameAtFrameIndex(videoEl, i, fps);
          const diff = compareFrames(reference, frame, opts);
          if (diff === 0) {
            return { bestFrame: i, bestDiff: 0 };
          }
          if (diff < bestDiff) {
            bestDiff = diff;
            bestFrame = i;
          }
          if (earlyExit && diff < goodEnoughThreshold) break;
          count++;
          if (count % BATCH_SIZE === 0) {
            await new Promise((r) => setTimeout(r, 0));
          }
        }
        return { bestFrame, bestDiff };
      };

      const coarseStep = Math.max(1, Math.floor((lastCandidate - firstCandidate) / 100));
      const { bestFrame: coarseBest, bestDiff } = await search(
        firstCandidate,
        lastCandidate,
        coarseStep,
        32,
        true
      );

      if (bestDiff === 0) {
        const endFrame = Math.max(loop.startFrame + minGap, coarseBest - 1);
        setLoopSelection(loop.startFrame, endFrame);
        videoEl.currentTime = endFrame / fps;
        setCurrentFrame(endFrame);
      } else {
        const margin = Math.max(coarseStep * 2, 10);
        const fineFrom = Math.max(firstCandidate, coarseBest - margin);
        const fineTo = Math.min(lastCandidate, coarseBest + margin);
        const { bestFrame: bestFrameFine } = await search(
          fineFrom,
          fineTo,
          1,
          64,
          false
        );
        const endFrame = Math.max(
          loop.startFrame + minGap,
          bestFrameFine - 1
        );
        setLoopSelection(loop.startFrame, endFrame);
        videoEl.currentTime = endFrame / fps;
        setCurrentFrame(endFrame);
      }
    } finally {
      if (wasPlaying) {
        videoEl.play().catch(() => {});
      }
      setIsFindingEndFrame(false);
    }
  }, [fps, loop.startFrame, totalFrames, setLoopSelection]);

  // Reset preview FPS and find-end message when video changes
  useEffect(() => {
    setPreviewFps(null);
    setFindEndMessage(null);
  }, [video.url]);

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

        <div className="flex flex-col gap-2">
          <Slider
            label={
              <span className="inline-flex items-center gap-1.5">
                End Frame
                <button
                  type="button"
                  onClick={handleFindEndFrame}
                  disabled={
                    isFindingEndFrame ||
                    loop.startFrame + 6 > totalFrames - 1
                  }
                  aria-label="Find end frame that matches start frame"
                  aria-busy={isFindingEndFrame}
                  className="inline-flex items-center justify-center rounded p-0.5 text-muted-foreground hover:text-foreground hover:bg-accent disabled:opacity-50 disabled:pointer-events-none"
                >
                  <Search
                    className="h-[1em] w-[1em] text-sm"
                    aria-hidden
                  />
                </button>
              </span>
            }
            value={loop.endFrame}
            min={0}
            max={totalFrames - 1}
            step={1}
            onChange={handleEndChange}
            valueFormatter={(v) => `Frame ${v}`}
            disabled={isFindingEndFrame}
          />
          {findEndMessage && (
            <p className="text-sm text-muted-foreground">{findEndMessage}</p>
          )}
        </div>

        <Slider
          label="Frame Skip"
          value={loop.frameSkip}
          min={1}
          max={Math.max(1, frameCount)}
          step={1}
          onChange={handleFrameSkipChange}
          valueFormatter={(v) => v === 1 ? 'Every frame' : `Every ${v} frames`}
        />

        <Slider
          label="Preview FPS"
          value={displayFps}
          min={1}
          max={120}
          step={1}
          onChange={handlePreviewFpsChange}
          valueFormatter={(v) => `${v} fps`}
        />
      </div>

      {/* Selection Info */}
      <div className="p-4 bg-accent/50 rounded-lg">
        <div className="grid grid-cols-4 gap-4 text-sm text-center">
          <div>
            <span className="text-muted-foreground block">Selected</span>
            <span className="font-medium text-foreground text-lg">{frameCount} frames</span>
          </div>
          <div>
            <span className="text-muted-foreground block">Exported</span>
            <span className="font-medium text-foreground text-lg">{exportedFrameCount} frames</span>
          </div>
          <div>
            <span className="text-muted-foreground block">Duration</span>
            <span className="font-medium text-foreground text-lg">{duration.toFixed(2)}s</span>
          </div>
          <div>
            <span className="text-muted-foreground block">FPS</span>
            <span className="font-medium text-foreground text-lg">
              {displayFps}
              {previewFps !== null && previewFps !== fps && (
                <span className="text-xs text-muted-foreground ml-1">
                  (orig: {fps})
                </span>
              )}
            </span>
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
      {exportedFrameCount > 500 && exportedFrameCount <= 1000 && (
        <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
          <p className="text-sm text-orange-600 dark:text-orange-400">
            Warning: {exportedFrameCount} frames will be exported. Large frame counts may take
            longer to process.
          </p>
        </div>
      )}

      {exportedFrameCount > 1000 && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive">
            Error: Maximum 1000 frames allowed. Please reduce your selection or increase frame skip.
          </p>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={() => setCurrentStep(3)}
          className="flex-1"
          size="lg"
          disabled={exportedFrameCount > 1000}
        >
          Continue to Frame Extraction
        </Button>
      </div>
    </div>
  );
}
