import { useState, useCallback } from 'react';
import { useStore } from '@/store';
import { removeHaloBatch } from '@/lib/processing/haloRemoval';
import { generateThumbnails } from '@/lib/video/frameExtractor';

export function useHaloRemoval() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingError, setProcessingError] = useState<string | null>(null);

  const frames = useStore((state) => state.frames);
  const settings = useStore((state) => state.settings);
  const setProcessedFrames = useStore((state) => state.setProcessedFrames);
  const setThumbnails = useStore((state) => state.setThumbnails);
  const setProcessingState = useStore((state) => state.setProcessing);
  const setProgress = useStore((state) => state.setProgress);
  const setError = useStore((state) => state.setError);

  const handleApplyHaloRemoval = useCallback(async () => {
    const framesToUse =
      frames.processed.length > 0 ? frames.processed : frames.raw;

    if (framesToUse.length === 0) {
      setProcessingError('No frames to process');
      return false;
    }

    setIsProcessing(true);
    setProcessingProgress(0);
    setProcessingError(null);
    setProcessingState(true);
    setError(null);

    try {
      // Apply halo removal to all frames
      const processedFrames = await removeHaloBatch(
        framesToUse,
        settings.haloRemoval.strength,
        (progress) => {
          setProcessingProgress(progress);
          setProgress(progress);
        }
      );

      // Generate new thumbnails
      const newThumbnails = generateThumbnails(processedFrames);

      // Update store
      setProcessedFrames(processedFrames);
      setThumbnails(newThumbnails);

      setIsProcessing(false);
      setProcessingState(false);
      setProgress(100);

      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to apply halo removal';
      setProcessingError(errorMessage);
      setError(errorMessage);
      setIsProcessing(false);
      setProcessingState(false);
      return false;
    }
  }, [
    frames.processed,
    frames.raw,
    settings.haloRemoval,
    setProcessedFrames,
    setThumbnails,
    setProcessingState,
    setProgress,
    setError,
  ]);

  return {
    handleApplyHaloRemoval,
    isProcessing,
    processingProgress,
    processingError,
  };
}
