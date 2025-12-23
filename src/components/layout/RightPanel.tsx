'use client';

import { useStore } from '@/store';
import { usePurchase } from '@/hooks/usePurchase';
import FrameGrid from '@/components/ui/FrameGrid';
import UpgradeButton from '@/components/billing/UpgradeButton';

export default function RightPanel() {
  const frames = useStore((state) => state.frames);
  const usage = useStore((state) => state.usage);
  const usageLoading = useStore((state) => state.usageLoading);
  const { tier, isPro } = usePurchase();

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

      {/* Tier Status & Upgrade */}
      <div className="mt-auto pt-6 border-t border-border space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Tier:</span>
          <span
            className={`text-sm font-medium ${
              isPro ? 'text-green-600' : 'text-orange-600'
            }`}
          >
            {isPro ? '✨ Pro' : 'Free Trial'}
          </span>
        </div>

        {/* Usage Display for Free Users */}
        {!isPro && usage && !usageLoading && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Usage:</span>
              <span className="text-sm font-medium">
                {usage.video_count}/{usage.limit} videos
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  usage.video_count >= usage.limit
                    ? 'bg-destructive'
                    : 'bg-orange-500'
                }`}
                style={{
                  width: `${(usage.video_count / usage.limit) * 100}%`,
                }}
              />
            </div>

            <p className="text-xs text-muted-foreground">
              Resets on{' '}
              {new Intl.DateTimeFormat('en-US', {
                month: 'short',
                day: 'numeric',
              }).format(usage.next_reset_date)}
            </p>
          </div>
        )}

        {!isPro && (
          <>
            <p className="text-xs text-muted-foreground">
              Exports will include watermark. Upgrade for unlimited access.
            </p>
            <UpgradeButton />
          </>
        )}

        {isPro && (
          <p className="text-xs text-green-600">
            ✓ Unlimited videos, no watermarks
          </p>
        )}
      </div>
    </div>
  );
}
