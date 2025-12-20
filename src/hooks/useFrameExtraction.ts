import { useState, useCallback } from 'react';
import { useStore } from '@/store';
import {
  extractFrames,
  generateThumbnails,
} from '@/lib/video/frameExtractor';

export function useFrameExtraction() {
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionProgress, setExtractionProgress] = useState(0);
  const [extractionError, setExtractionError] = useState<string | null>(null);

  const video = useStore((state) => state.video);
  const loop = useStore((state) => state.loop);
  const setRawFrames = useStore((state) => state.setRawFrames);
  const setThumbnails = useStore((state) => state.setThumbnails);
  const setProcessing = useStore((state) => state.setProcessing);
  const setProgress = useStore((state) => state.setProgress);
  const setError = useStore((state) => state.setError);

  const handleExtractFrames = useCallback(async () => {
    if (!video.file || !video.metadata) {
      setExtractionError('No video loaded');
      return false;
    }

    setIsExtracting(true);
    setExtractionProgress(0);
    setExtractionError(null);
    setProcessing(true);
    setError(null);

    try {
      // Extract frames
      const frames = await extractFrames({
        file: video.file,
        startFrame: loop.startFrame,
        endFrame: loop.endFrame,
        fps: video.metadata.fps,
        onProgress: (progress) => {
          setExtractionProgress(progress);
          setProgress(progress);
        },
      });

      // Generate thumbnails
      const thumbnails = generateThumbnails(frames);

      // Update store
      setRawFrames(frames);
      setThumbnails(thumbnails);

      setIsExtracting(false);
      setProcessing(false);
      setProgress(100);

      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to extract frames';
      setExtractionError(errorMessage);
      setError(errorMessage);
      setIsExtracting(false);
      setProcessing(false);
      return false;
    }
  }, [
    video.file,
    video.metadata,
    loop.startFrame,
    loop.endFrame,
    setRawFrames,
    setThumbnails,
    setProcessing,
    setProgress,
    setError,
  ]);

  return {
    handleExtractFrames,
    isExtracting,
    extractionProgress,
    extractionError,
  };
}
