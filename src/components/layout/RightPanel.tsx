'use client';

import { useStore } from '@/store';
import { usePurchase } from '@/hooks/usePurchase';
import FrameGrid from '@/components/ui/FrameGrid';
import UpgradeButton from '@/components/billing/UpgradeButton';

export default function RightPanel() {
  const frames = useStore((state) => state.frames);
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
