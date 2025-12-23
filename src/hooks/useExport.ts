import { useState, useCallback } from 'react';
import { useStore } from '@/store';
import {
  createSpriteSheet,
  canvasToBlob,
  getSpriteSheetDimensions,
} from '@/lib/export/spriteSheet';
import { createExportPackage } from '@/lib/export/zipExporter';
import { generateMetadata, generateReadme } from '@/lib/export/metadataGenerator';
import { applyWatermarkToSpriteSheet } from '@/lib/export/watermark';
import { usePurchase } from './usePurchase';

export function useExport() {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportError, setExportError] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const frames = useStore((state) => state.frames);
  const settings = useStore((state) => state.settings);
  const exportSettings = useStore((state) => state.exportSettings);
  const tier = useStore((state) => state.tier);
  const video = useStore((state) => state.video);
  const setProcessing = useStore((state) => state.setProcessing);
  const setProgress = useStore((state) => state.setProgress);
  const setError = useStore((state) => state.setError);
  const usage = useStore((state) => state.usage);
  const setUsage = useStore((state) => state.setUsage);
  const setUsageError = useStore((state) => state.setUsageError);

  const { isPro } = usePurchase();

  const hasReachedLimit = usage?.has_reached_limit ?? false;

  // Internal function that performs the actual export
  const performExport = useCallback(async () => {
    const framesToExport =
      frames.processed.length > 0 ? frames.processed : frames.raw;

    if (framesToExport.length === 0) {
      setExportError('No frames to export');
      return false;
    }

    setIsExporting(true);
    setExportProgress(0);
    setExportError(null);
    setProcessing(true);
    setError(null);

    try {
      const frameSize = framesToExport[0].width;

      // Step 1: Create sprite sheet (20%)
      setExportProgress(10);
      setProgress(10);

      const spriteSheetCanvas = createSpriteSheet(framesToExport, frameSize);

      // Apply watermark if free tier
      if (tier === 'free') {
        await applyWatermarkToSpriteSheet(spriteSheetCanvas);
      }

      setExportProgress(20);
      setProgress(20);

      // Step 2: Convert sprite sheet to blob (30%)
      const spriteSheetBlob = await canvasToBlob(
        spriteSheetCanvas,
        exportSettings.format
      );

      setExportProgress(30);
      setProgress(30);

      // Step 3: Generate metadata (40%)
      const dimensions = getSpriteSheetDimensions(
        framesToExport.length,
        frameSize
      );

      const metadataJson = generateMetadata(
        framesToExport,
        settings,
        video.metadata,
        { cols: dimensions.cols, rows: dimensions.rows }
      );

      const readmeText = generateReadme(framesToExport.length, frameSize, dimensions);

      setExportProgress(40);
      setProgress(40);

      // Step 4: Create export package (60-100%)
      let exportBlob: Blob;

      if (exportSettings.includeFrames || exportSettings.includeMetadata) {
        // Create complete ZIP package
        const JSZip = (await import('jszip')).default;
        const zip = new JSZip();

        // Add sprite sheet
        zip.file(`sprite-sheet.${exportSettings.format}`, spriteSheetBlob);

        // Add metadata
        if (exportSettings.includeMetadata) {
          zip.file('metadata.json', metadataJson);
          zip.file('README.md', readmeText);
        }

        // Add individual frames
        if (exportSettings.includeFrames) {
          const framesFolder = zip.folder('frames');
          if (framesFolder) {
            for (let i = 0; i < framesToExport.length; i++) {
              const frame = framesToExport[i];

              // Create canvas for this frame
              const canvas = document.createElement('canvas');
              canvas.width = frameSize;
              canvas.height = frameSize;

              const ctx = canvas.getContext('2d', { willReadFrequently: true });
              if (!ctx) {
                throw new Error('Failed to get canvas context');
              }

              ctx.putImageData(frame, 0, 0);

              // Apply watermark to frame if free tier
              if (tier === 'free') {
                const watermarkCtx = canvas.getContext('2d', { willReadFrequently: true });
                if (watermarkCtx) {
                  const fontSize = Math.max(8, Math.floor(frameSize / 16));
                  watermarkCtx.font = `${fontSize}px Arial`;
                  watermarkCtx.fillStyle = 'rgba(255, 255, 255, 0.5)';
                  watermarkCtx.textAlign = 'right';
                  watermarkCtx.textBaseline = 'bottom';
                  watermarkCtx.fillText('Trial', frameSize - 2, frameSize - 2);
                }
              }

              // Convert to blob
              const blob = await new Promise<Blob>((resolve, reject) => {
                canvas.toBlob(
                  (blob) => {
                    if (blob) {
                      resolve(blob);
                    } else {
                      reject(new Error('Failed to create blob'));
                    }
                  },
                  exportSettings.format === 'png' ? 'image/png' : 'image/webp'
                );
              });

              // Add to frames folder
              const filename = `frame-${(i + 1).toString().padStart(4, '0')}.${exportSettings.format}`;
              framesFolder.file(filename, blob);

              // Update progress (60-100%)
              const progress = Math.round(60 + ((i + 1) / framesToExport.length) * 40);
              setExportProgress(progress);
              setProgress(progress);
            }
          }
        }

        // Generate ZIP file
        exportBlob = await zip.generateAsync({ type: 'blob' });
      } else {
        // Just export sprite sheet
        exportBlob = spriteSheetBlob;
      }

      setExportProgress(100);
      setProgress(100);

      // Trigger download
      const url = URL.createObjectURL(exportBlob);
      const link = document.createElement('a');
      link.href = url;

      const filename = exportSettings.includeFrames || exportSettings.includeMetadata
        ? 'sprite-smithy-export.zip'
        : `sprite-sheet.${exportSettings.format}`;

      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setIsExporting(false);
      setProcessing(false);

      // Increment usage for free users after successful export
      if (!isPro && usage) {
        try {
          const response = await fetch('/api/usage/increment', {
            method: 'POST',
          });

          if (!response.ok) {
            throw new Error('Failed to increment usage');
          }

          const data = await response.json();

          // Update store state
          setUsage({
            ...usage,
            video_count: data.video_count,
            has_reached_limit: data.has_reached_limit,
          });
        } catch (error) {
          console.error('Failed to increment usage:', error);
          setUsageError(error instanceof Error ? error.message : 'Failed to increment usage');
          // Don't fail the export, just log the error
        }
      }

      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to export';
      setExportError(errorMessage);
      setError(errorMessage);
      setIsExporting(false);
      setProcessing(false);
      return false;
    }
  }, [
    frames.processed,
    frames.raw,
    settings,
    exportSettings,
    tier,
    video.metadata,
    setProcessing,
    setProgress,
    setError,
    isPro,
    usage,
    setUsage,
    setUsageError,
  ]);

  // Function to initiate export (called by UI)
  const initiateExport = useCallback(async () => {
    // Check if free user has reached limit
    if (!isPro && hasReachedLimit) {
      setExportError('You have reached your monthly export limit. Please upgrade to Pro.');
      return false;
    }

    // Show confirmation modal for free users
    if (!isPro) {
      setShowConfirmModal(true);
      return false; // Don't export yet, wait for confirmation
    }

    // Pro users can export directly
    return await performExport();
  }, [isPro, hasReachedLimit, performExport]);

  // Function called when user confirms in modal
  const confirmExport = useCallback(async () => {
    setShowConfirmModal(false);
    return await performExport();
  }, [performExport]);

  // Function called when user cancels
  const cancelExport = useCallback(() => {
    setShowConfirmModal(false);
  }, []);

  return {
    initiateExport,
    confirmExport,
    cancelExport,
    showConfirmModal,
    usage,
    isExporting,
    exportProgress,
    exportError,
  };
}
