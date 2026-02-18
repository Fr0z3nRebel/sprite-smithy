import { useState, useCallback } from 'react';
import { useStore } from '@/store';
import {
  createSpriteSheet,
  canvasToBlob,
  getSpriteSheetDimensions,
} from '@/lib/export/spriteSheet';
import {
  generateMetadata,
  generateHashSpriteSheetMetadata,
  generateReadme,
} from '@/lib/export/metadataGenerator';
import { encodeAnimatedGif } from '@/lib/export/animatedGif';

export function useExport() {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportError, setExportError] = useState<string | null>(null);

  const frames = useStore((state) => state.frames);
  const settings = useStore((state) => state.settings);
  const exportSettings = useStore((state) => state.exportSettings);
  const video = useStore((state) => state.video);
  const previewFps = useStore((state) => state.previewFps);
  const setProcessing = useStore((state) => state.setProcessing);
  const setProgress = useStore((state) => state.setProgress);
  const setError = useStore((state) => state.setError);

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

      setExportProgress(10);
      setProgress(10);

      const spriteSheetCanvas = createSpriteSheet(framesToExport, frameSize);

      setExportProgress(20);
      setProgress(20);

      const spriteSheetBlob = await canvasToBlob(
        spriteSheetCanvas,
        exportSettings.format
      );

      setExportProgress(30);
      setProgress(30);

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

      let hashSpriteSheetJson: string | null = null;
      if (exportSettings.includeMetadata && exportSettings.includeHashSpriteSheet) {
        const outputImageName = `sprite-sheet.${exportSettings.format}`;
        hashSpriteSheetJson = generateHashSpriteSheetMetadata({
          frame_width: frameSize,
          frame_height: frameSize,
          columns: dimensions.cols,
          total_frames: framesToExport.length,
          output_image_name: outputImageName,
        });
      }

      const readmeText = generateReadme(framesToExport.length, frameSize, dimensions);

      setExportProgress(40);
      setProgress(40);

      let gifBlob: Blob | null = null;
      if (exportSettings.includeGif) {
        const gifFps = previewFps ?? video.metadata?.fps ?? 10;
        gifBlob = await encodeAnimatedGif(
          framesToExport,
          gifFps,
          (p) => {
            setExportProgress(40 + Math.round(p * 0.2));
            setProgress(40 + Math.round(p * 0.2));
          }
        );
      }

      const useZip =
        exportSettings.includeFrames ||
        exportSettings.includeMetadata ||
        exportSettings.includeGif;

      let exportBlob: Blob;

      if (useZip) {
        const JSZip = (await import('jszip')).default;
        const zip = new JSZip();

        zip.file(`sprite-sheet.${exportSettings.format}`, spriteSheetBlob);

        if (exportSettings.includeGif && gifBlob) {
          zip.file('animated.gif', gifBlob);
        }

        if (exportSettings.includeMetadata) {
          zip.file('sprite-smithy.json', metadataJson);
          if (hashSpriteSheetJson) {
            zip.file('sprite-sheet.json', hashSpriteSheetJson);
          }
          zip.file('README.md', readmeText);
        }

        if (exportSettings.includeFrames) {
          const framesFolder = zip.folder('frames');
          if (framesFolder) {
            const progressStart = exportSettings.includeGif ? 60 : 60;
            const progressSpan = 40;
            for (let i = 0; i < framesToExport.length; i++) {
              const frame = framesToExport[i];

              const canvas = document.createElement('canvas');
              canvas.width = frameSize;
              canvas.height = frameSize;

              const ctx = canvas.getContext('2d', { willReadFrequently: true });
              if (!ctx) {
                throw new Error('Failed to get canvas context');
              }

              ctx.putImageData(frame, 0, 0);

              const blob = await new Promise<Blob>((resolve, reject) => {
                canvas.toBlob(
                  (b) => {
                    if (b) resolve(b);
                    else reject(new Error('Failed to create blob'));
                  },
                  exportSettings.format === 'png' ? 'image/png' : 'image/webp'
                );
              });

              const filename = `frame-${(i + 1).toString().padStart(4, '0')}.${exportSettings.format}`;
              framesFolder.file(filename, blob);

              const progress = Math.round(
                progressStart + ((i + 1) / framesToExport.length) * progressSpan
              );
              setExportProgress(progress);
              setProgress(progress);
            }
          }
        }

        exportBlob = await zip.generateAsync({ type: 'blob' });
      } else {
        exportBlob = spriteSheetBlob;
      }

      setExportProgress(100);
      setProgress(100);

      const url = URL.createObjectURL(exportBlob);
      const link = document.createElement('a');
      link.href = url;

      const filename =
        exportSettings.includeFrames ||
        exportSettings.includeMetadata ||
        exportSettings.includeGif
          ? 'sprite-smithy-export.zip'
          : `sprite-sheet.${exportSettings.format}`;

      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setIsExporting(false);
      setProcessing(false);

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
    video.metadata,
    previewFps,
    setProcessing,
    setProgress,
    setError,
  ]);

  const initiateExport = useCallback(async () => {
    return await performExport();
  }, [performExport]);

  return {
    initiateExport,
    isExporting,
    exportProgress,
    exportError,
  };
}
