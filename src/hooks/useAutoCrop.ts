import { useState, useCallback, useMemo } from 'react';
import { useStore } from '@/store';
import { getGlobalBoundingBox } from '@/lib/processing/boundingBox';
import { normalizeFrames } from '@/lib/processing/normalize';
import { generateThumbnails } from '@/lib/video/frameExtractor';
import { BoundingBox } from '@/types/frame';

export function useAutoCrop() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingError, setProcessingError] = useState<string | null>(null);
  const [globalBox, setGlobalBox] = useState<BoundingBox | null>(null);

  const frames = useStore((state) => state.frames);
  const settings = useStore((state) => state.settings);
  const setProcessedFrames = useStore((state) => state.setProcessedFrames);
  const setThumbnails = useStore((state) => state.setThumbnails);
  const setProcessingState = useStore((state) => state.setProcessing);
  const setProgress = useStore((state) => state.setProgress);
  const setError = useStore((state) => state.setError);

  // Calculate global bounding box when frames change
  const calculateGlobalBox = useCallback(() => {
    const framesToUse =
      frames.processed.length > 0 ? frames.processed : frames.raw;

    if (framesToUse.length === 0) {
      return null;
    }

    const box = getGlobalBoundingBox(framesToUse);
    setGlobalBox(box);
    return box;
  }, [frames.processed, frames.raw]);

  // Memoize global box calculation
  useMemo(() => {
    if (!globalBox) {
      calculateGlobalBox();
    }
  }, [globalBox, calculateGlobalBox]);

  const handleApplyNormalization = useCallback(async () => {
    const framesToUse =
      frames.processed.length > 0 ? frames.processed : frames.raw;

    if (framesToUse.length === 0) {
      setProcessingError('No frames to process');
      return false;
    }

    // Calculate global bounding box if not already done
    const box = globalBox || calculateGlobalBox();
    if (!box) {
      setProcessingError('Failed to calculate bounding box');
      return false;
    }

    setIsProcessing(true);
    setProcessingProgress(0);
    setProcessingError(null);
    setProcessingState(true);
    setError(null);

    try {
      // Normalize all frames
      const normalizedFrames = await normalizeFrames(
        framesToUse,
        box,
        settings.sizing,
        (progress) => {
          setProcessingProgress(progress);
          setProgress(progress);
        }
      );

      // Generate new thumbnails
      const newThumbnails = generateThumbnails(normalizedFrames);

      // Update store
      setProcessedFrames(normalizedFrames);
      setThumbnails(newThumbnails);

      setIsProcessing(false);
      setProcessingState(false);
      setProgress(100);

      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to normalize frames';
      setProcessingError(errorMessage);
      setError(errorMessage);
      setIsProcessing(false);
      setProcessingState(false);
      return false;
    }
  }, [
    frames.processed,
    frames.raw,
    globalBox,
    calculateGlobalBox,
    settings.sizing,
    setProcessedFrames,
    setThumbnails,
    setProcessingState,
    setProgress,
    setError,
  ]);

  return {
    handleApplyNormalization,
    isProcessing,
    processingProgress,
    processingError,
    globalBox,
    calculateGlobalBox,
  };
}
