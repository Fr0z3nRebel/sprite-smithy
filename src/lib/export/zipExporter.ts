import JSZip from 'jszip';

/**
 * Export individual frames as a ZIP archive
 */
export async function exportFramesAsZip(
  frames: ImageData[],
  frameSize: number,
  format: 'png' | 'webp' = 'png',
  onProgress?: (progress: number) => void
): Promise<Blob> {
  const zip = new JSZip();

  for (let i = 0; i < frames.length; i++) {
    const frame = frames[i];

    // Create canvas for this frame
    const canvas = document.createElement('canvas');
    canvas.width = frameSize;
    canvas.height = frameSize;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }

    ctx.putImageData(frame, 0, 0);

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
        format === 'png' ? 'image/png' : 'image/webp'
      );
    });

    // Add to ZIP with padded filename
    const filename = `frame-${(i + 1).toString().padStart(4, '0')}.${format}`;
    zip.file(filename, blob);

    // Update progress
    if (onProgress) {
      const progress = Math.round(((i + 1) / frames.length) * 100);
      onProgress(progress);
    }
  }

  // Generate ZIP file
  return zip.generateAsync({ type: 'blob' });
}

/**
 * Create a complete export package with sprite sheet, frames, and metadata
 */
export async function createExportPackage(
  frames: ImageData[],
  frameSize: number,
  spriteSheetBlob: Blob,
  metadataJson: string,
  options: {
    includeFrames: boolean;
    includeMetadata: boolean;
    format: 'png' | 'webp';
  },
  onProgress?: (progress: number) => void
): Promise<Blob> {
  const zip = new JSZip();

  // Add sprite sheet
  zip.file(`sprite-sheet.${options.format}`, spriteSheetBlob);

  // Add metadata if requested
  if (options.includeMetadata) {
    zip.file('metadata.json', metadataJson);
  }

  // Add individual frames if requested
  if (options.includeFrames) {
    const framesFolder = zip.folder('frames');
    if (!framesFolder) {
      throw new Error('Failed to create frames folder');
    }

    for (let i = 0; i < frames.length; i++) {
      const frame = frames[i];

      // Create canvas for this frame
      const canvas = document.createElement('canvas');
      canvas.width = frameSize;
      canvas.height = frameSize;

      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) {
        throw new Error('Failed to get canvas context');
      }

      ctx.putImageData(frame, 0, 0);

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
          options.format === 'png' ? 'image/png' : 'image/webp'
        );
      });

      // Add to frames folder
      const filename = `frame-${(i + 1).toString().padStart(4, '0')}.${options.format}`;
      framesFolder.file(filename, blob);

      // Update progress
      if (onProgress) {
        const progress = Math.round(((i + 1) / frames.length) * 50 + 50);
        onProgress(progress);
      }
    }
  }

  // Generate ZIP file
  return zip.generateAsync({ type: 'blob' });
}
