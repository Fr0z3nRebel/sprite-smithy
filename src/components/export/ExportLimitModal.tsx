'use client';

import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { UsageStatus } from '@/types/usage';
import { useState } from 'react';

interface ExportLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  usage: UsageStatus;
}

export default function ExportLimitModal({
  isOpen,
  onClose,
  usage,
}: ExportLimitModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const handleUpgrade = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Monthly Export Limit Reached">
      <div className="space-y-4">
        {/* Warning Message */}
        <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
          <p className="text-sm font-medium text-orange-500">
            You've reached your monthly export limit of {usage.limit} videos.
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Your limit will reset on {formatDate(usage.next_reset_date)}.
          </p>
        </div>

        {/* Upsell Content */}
        <div className="space-y-3">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Upgrade to Pro for Unlimited Exports
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-0.5">✓</span>
                <span>Unlimited Video Exports</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-0.5">✓</span>
                <span>Commercial Use License</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-0.5">✓</span>
                <span>Lifetime Access - One-Time Payment</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-0.5">✓</span>
                <span>Early Access to New Features</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-0.5">✓</span>
                <span>7-Day Money Back Guarantee</span>
              </li>
            </ul>
          </div>

          <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-2xl font-bold text-foreground">$30</span>
              <span className="text-sm text-muted-foreground">one-time</span>
            </div>
            <p className="text-xs text-muted-foreground">
              No subscriptions, no recurring fees
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 mt-6">
          <Button
            onClick={handleUpgrade}
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? 'Processing...' : 'Upgrade Now'}
          </Button>
          {error && (
            <p className="text-xs text-destructive text-center">{error}</p>
          )}
          <Button variant="outline" onClick={onClose} className="w-full">
            Maybe Later
          </Button>
        </div>
      </div>
    </Modal>
  );
}

