import { SUPPORTED_VIDEO_FORMATS, MAX_VIDEO_SIZE } from './constants';

export function validateVideoFile(file: File): {
  valid: boolean;
  error?: string;
} {
  // Check file type
  if (!SUPPORTED_VIDEO_FORMATS.includes(file.type)) {
    return {
      valid: false,
      error: `Unsupported file format. Please upload MP4, WebM, or MOV files.`,
    };
  }

  // Check file size
  if (file.size > MAX_VIDEO_SIZE) {
    const maxSizeMB = Math.round(MAX_VIDEO_SIZE / (1024 * 1024));
    return {
      valid: false,
      error: `File too large. Maximum size is ${maxSizeMB}MB.`,
    };
  }

  return { valid: true };
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
