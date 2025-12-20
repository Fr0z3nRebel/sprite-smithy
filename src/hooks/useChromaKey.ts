import { useState, useCallback } from 'react';
import { useStore } from '@/store';
import { applyChromaKeyBatch } from '@/lib/processing/chromaKey';
import { generateThumbnails } from '@/lib/video/frameExtractor';

export function useChromaKey() {
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

  const handleApplyChromaKey = useCallback(async () => {
    if (frames.raw.length === 0) {
      setProcessingError('No frames to process');
      return false;
    }

    setIsProcessing(true);
    setProcessingProgress(0);
    setProcessingError(null);
    setProcessingState(true);
    setError(null);

    try {
      // Apply chroma key to all frames
      const processedFrames = await applyChromaKeyBatch(
        frames.raw,
        settings.chromaKey.color,
        settings.chromaKey.threshold,
        settings.chromaKey.feathering,
        (progress) => {
          setProcessingProgress(progress);
          setProgress(progress);
        }
      );

      // Generate new thumbnails from processed frames
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
          : 'Failed to apply chroma key';
      setProcessingError(errorMessage);
      setError(errorMessage);
      setIsProcessing(false);
      setProcessingState(false);
      return false;
    }
  }, [
    frames.raw,
    settings.chromaKey,
    setProcessedFrames,
    setThumbnails,
    setProcessingState,
    setProgress,
    setError,
  ]);

  return {
    handleApplyChromaKey,
    isProcessing,
    processingProgress,
    processingError,
  };
}
