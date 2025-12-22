'use client';

import { usePurchase } from '@/hooks/usePurchase';
import { useUser } from '@/hooks/useUser';
import UpgradeButton from '@/components/billing/UpgradeButton';
import TierBadge from '@/components/billing/TierBadge';

export default function BillingPage() {
  const { purchase, isPro } = usePurchase();
  const { profile } = useUser();

  return (
    <div className="min-h-screen bg-muted/20 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">Billing</h1>

        {/* Current Plan */}
        <div className="bg-card border border-border rounded-lg p-6 space-y-6 mb-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Current Plan</h2>
            <div className="flex items-center justify-between">
              <div>
                <TierBadge />
                <p className="text-sm text-muted-foreground mt-2">
                  {isPro ? 'Lifetime Pro Access' : 'Free Trial'}
                </p>
              </div>
              {!isPro && (
                <div className="max-w-xs">
                  <UpgradeButton />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Purchase Details */}
        {isPro && purchase && (
          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold">Purchase Details</h2>

            <div className="grid gap-4">
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Amount Paid</span>
                <span className="font-semibold">
                  ${(purchase.amount_paid / 100).toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Purchase Date</span>
                <span className="font-semibold">
                  {purchase.purchased_at
                    ? new Date(purchase.purchased_at).toLocaleDateString()
                    : 'N/A'}
                </span>
              </div>

              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Status</span>
                <span className="font-semibold text-green-600">Active</span>
              </div>
            </div>

            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mt-4">
              <p className="text-sm text-green-600">
                ✓ You have lifetime access to all Pro features. No recurring charges.
              </p>
            </div>
          </div>
        )}

        {/* Free Tier Info */}
        {!isPro && (
          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold">Free Tier Limits</h2>

            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-orange-500">•</span>
                <span>5 videos per month</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-orange-500">•</span>
                <span>Watermarked exports</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-orange-500">•</span>
                <span>All core features included</span>
              </li>
            </ul>

            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mt-4">
              <p className="text-sm">
                Upgrade to Pro for unlimited videos, no watermarks, and lifetime access for just $30 one-time.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
