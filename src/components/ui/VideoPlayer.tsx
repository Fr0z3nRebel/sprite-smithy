'use client';

import { useRef, useEffect, useState } from 'react';
import { useStore } from '@/store';

interface VideoPlayerProps {
  showControls?: boolean;
  currentTime?: number;
  onTimeUpdate?: (time: number) => void;
}

export default function VideoPlayer({
  showControls = true,
  currentTime,
  onTimeUpdate,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);

  const videoUrl = useStore((state) => state.video.url);
  const loop = useStore((state) => state.loop);
  const metadata = useStore((state) => state.video.metadata);

  // Sync external currentTime to video
  useEffect(() => {
    if (videoRef.current && currentTime !== undefined) {
      videoRef.current.currentTime = currentTime;
      setVideoCurrentTime(currentTime);
    }
  }, [currentTime]);

  // Handle time updates
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const time = videoRef.current.currentTime;
      setVideoCurrentTime(time);
      if (onTimeUpdate) {
        onTimeUpdate(time);
      }
    }
  };

  const handlePlayPause = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (delta: number) => {
    if (!videoRef.current || !metadata) return;

    const frameDuration = 1 / metadata.fps;
    const newTime = videoRef.current.currentTime + delta * frameDuration;
    const clampedTime = Math.max(
      0,
      Math.min(newTime, videoRef.current.duration)
    );
    videoRef.current.currentTime = clampedTime;
    setVideoCurrentTime(clampedTime);
  };

  if (!videoUrl) {
    return (
      <div className="w-full aspect-video bg-muted rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground">No video loaded</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full h-full object-contain"
          onTimeUpdate={handleTimeUpdate}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      </div>

      {showControls && (
        <div className="mt-4 flex items-center gap-2 justify-center">
          <button
            onClick={() => handleSeek(-10)}
            className="px-3 py-2 bg-secondary hover:bg-secondary/80 rounded text-sm font-medium"
            disabled={!metadata}
          >
            -10 Frames
          </button>
          <button
            onClick={() => handleSeek(-1)}
            className="px-3 py-2 bg-secondary hover:bg-secondary/80 rounded text-sm font-medium"
            disabled={!metadata}
          >
            -1 Frame
          </button>
          <button
            onClick={handlePlayPause}
            className="px-6 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded font-medium"
          >
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <button
            onClick={() => handleSeek(1)}
            className="px-3 py-2 bg-secondary hover:bg-secondary/80 rounded text-sm font-medium"
            disabled={!metadata}
          >
            +1 Frame
          </button>
          <button
            onClick={() => handleSeek(10)}
            className="px-3 py-2 bg-secondary hover:bg-secondary/80 rounded text-sm font-medium"
            disabled={!metadata}
          >
            +10 Frames
          </button>
        </div>
      )}

      {metadata && (
        <div className="mt-2 text-center text-sm text-muted-foreground">
          Frame:{' '}
          {Math.floor((videoCurrentTime || 0) * metadata.fps)} /{' '}
          {metadata.totalFrames}
        </div>
      )}
    </div>
  );
}
