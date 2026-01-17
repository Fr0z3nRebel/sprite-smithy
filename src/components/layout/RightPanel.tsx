'use client';

import { useStore } from '@/store';
import FrameGrid from '@/components/ui/FrameGrid';

export default function RightPanel() {
  const frames = useStore((state) => state.frames);

  return (
    <div className="p-6 flex flex-col h-full">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground">Frames</h2>
        <p className="text-sm text-muted-foreground mt-1">
          {frames.raw.length > 0
            ? `${frames.raw.length} frames extracted`
            : 'No frames yet'}
        </p>
      </div>

      {/* Frame Grid */}
      <div className="mb-6 flex-1 overflow-y-auto">
        <FrameGrid thumbnails={frames.thumbnails} maxVisible={12} />
      </div>
    </div>
  );
}
