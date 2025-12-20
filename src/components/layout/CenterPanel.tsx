'use client';

import { useStore } from '@/store';
import VideoPlayer from '@/components/ui/VideoPlayer';

export default function CenterPanel() {
  const currentStep = useStore((state) => state.currentStep);
  const videoUrl = useStore((state) => state.video.url);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-muted/20">
      <div className="w-full max-w-4xl">
        <h2 className="text-xl font-semibold text-foreground mb-4 text-center">
          {!videoUrl ? 'Upload a Video to Begin' : 'Video Preview'}
        </h2>

        <VideoPlayer showControls={!!videoUrl} />

        <p className="text-sm text-muted-foreground mt-4 text-center">
          Step {currentStep} of 7
        </p>
      </div>
    </div>
  );
}
