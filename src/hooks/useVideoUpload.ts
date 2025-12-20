import { useState, useCallback } from 'react';
import { useStore } from '@/store';
import { validateVideoFile } from '@/utils/file';
import { extractVideoMetadata } from '@/lib/video/videoInfo';

export function useVideoUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const setVideoFile = useStore((state) => state.setVideoFile);
  const setVideoMetadata = useStore((state) => state.setVideoMetadata);
  const setError = useStore((state) => state.setError);

  const handleUpload = useCallback(
    async (file: File) => {
      setIsUploading(true);
      setUploadError(null);
      setError(null);

      try {
        // Validate file
        const validation = validateVideoFile(file);
        if (!validation.valid) {
          throw new Error(validation.error);
        }

        // Set video file (this creates object URL)
        setVideoFile(file);

        // Extract metadata
        const metadata = await extractVideoMetadata(file);
        setVideoMetadata(metadata);

        setIsUploading(false);
        return true;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to upload video';
        setUploadError(errorMessage);
        setError(errorMessage);
        setIsUploading(false);
        return false;
      }
    },
    [setVideoFile, setVideoMetadata, setError]
  );

  return {
    handleUpload,
    isUploading,
    uploadError,
  };
}
