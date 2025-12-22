'use client';

import { usePurchase } from '@/hooks/usePurchase';

export default function TierBadge() {
  const { tier, isPro } = usePurchase();

  return (
    <div
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
        isPro
          ? 'bg-primary text-primary-foreground'
          : 'bg-muted text-muted-foreground'
      }`}
    >
      {isPro ? '✨ Pro' : 'Free Trial'}
    </div>
  );
}
