'use client';

import { useRef, useState, DragEvent, ChangeEvent } from 'react';
import { useStore } from '@/store';
import { useVideoUpload } from '@/hooks/useVideoUpload';
import { formatFileSize, formatDuration } from '@/utils/file';
import { SUPPORTED_VIDEO_EXTENSIONS } from '@/utils/constants';
import Button from '@/components/ui/Button';
import VideoPlayer from '@/components/ui/VideoPlayer';

export default function Step1Upload() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const video = useStore((state) => state.video);
  const setCurrentStep = useStore((state) => state.setCurrentStep);

  const { handleUpload, isUploading, uploadError } = useVideoUpload();

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const success = await handleUpload(files[0]);
      if (success) {
        // Auto-advance to next step
        setCurrentStep(2);
      }
    }
  };

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const success = await handleUpload(files[0]);
      if (success) {
        setCurrentStep(2);
      }
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  // If video is uploaded, show video preview with metadata
  if (video.file && video.metadata && video.url) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-foreground">
            Video Uploaded Successfully
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Review your video and continue to the next step
          </p>
        </div>

        {/* Video Player */}
        <VideoPlayer showControls={true} />

        {/* Video Metadata */}
        <div className="p-4 bg-accent/50 rounded-lg space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {video.file.name}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatFileSize(video.file.size)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div>
              <span className="text-muted-foreground">Duration:</span>
              <span className="ml-2 font-medium text-foreground">
                {formatDuration(video.metadata.duration)}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">FPS:</span>
              <span className="ml-2 font-medium text-foreground">
                {video.metadata.fps}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Dimensions:</span>
              <span className="ml-2 font-medium text-foreground">
                {video.metadata.width} × {video.metadata.height}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Total Frames:</span>
              <span className="ml-2 font-medium text-foreground">
                {video.metadata.totalFrames}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            onClick={handleBrowseClick}
            variant="outline"
          >
            Upload Different Video
          </Button>
          <Button
            onClick={() => setCurrentStep(2)}
            className="flex-1"
            size="lg"
          >
            Continue to Loop Selection
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept={SUPPORTED_VIDEO_EXTENSIONS.join(',')}
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    );
  }

  // No video uploaded - show upload interface
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-foreground">
          Upload Your Video
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Upload an AI-generated character video to begin
        </p>
      </div>

      {/* Drag and Drop Area */}
      <label
        htmlFor="video-upload-input"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-lg p-12 text-center cursor-pointer
          transition-colors relative z-10 block
          ${
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50 hover:bg-accent/50'
          }
        `}
      >
        <input
          id="video-upload-input"
          ref={fileInputRef}
          type="file"
          accept={SUPPORTED_VIDEO_EXTENSIONS.join(',')}
          onChange={handleFileSelect}
          className="hidden"
        />

        {isUploading ? (
          <div className="space-y-2">
            <div className="text-lg font-medium text-foreground">
              Loading video...
            </div>
            <div className="text-sm text-muted-foreground">
              Please wait while we process your video
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>

            <div>
              <p className="text-xl font-medium text-foreground">
                Drop your video here
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                or click to browse
              </p>
            </div>

            <div className="text-sm text-muted-foreground">
              Supports MP4, WebM, MOV • Max 100MB • Max 10 seconds
            </div>
          </div>
        )}
      </label>

      {/* Error Display */}
      {uploadError && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive">{uploadError}</p>
        </div>
      )}
    </div>
  );
}
