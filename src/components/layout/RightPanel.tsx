'use client';

import { useStore } from '@/store';
import FrameGrid from '@/components/ui/FrameGrid';

export default function RightPanel() {
  const frames = useStore((state) => state.frames);
  const license = useStore((state) => state.license);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground">Frames</h2>
        <p className="text-sm text-muted-foreground mt-1">
          {frames.raw.length > 0
            ? `${frames.raw.length} frames extracted`
            : 'No frames yet'}
        </p>
      </div>

      {/* Frame Grid */}
      <div className="mb-6">
        <FrameGrid thumbnails={frames.thumbnails} maxVisible={12} />
      </div>

      {/* License Status */}
      <div className="mt-auto pt-6 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">License:</span>
          <span
            className={`text-sm font-medium ${
              license.tier === 'paid' ? 'text-green-600' : 'text-orange-600'
            }`}
          >
            {license.tier === 'paid' ? 'Licensed' : 'Free Trial'}
          </span>
        </div>
        {license.tier === 'free' && (
          <p className="text-xs text-muted-foreground mt-2">
            Exports will include watermark
          </p>
        )}
      </div>
    </div>
  );
}
