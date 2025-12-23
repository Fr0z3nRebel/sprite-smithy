'use client';

import Link from 'next/link';
import { ArrowLeft, Check, Sparkles, Zap, Shield, Infinity } from 'lucide-react';
import { usePurchase } from '@/hooks/usePurchase';
import { useUser } from '@/hooks/useUser';
import UpgradeButton from '@/components/billing/UpgradeButton';
import TierBadge from '@/components/billing/TierBadge';
import Button from '@/components/ui/Button';

export default function BillingPage() {
  const { purchase, isPro } = usePurchase();
  const { profile } = useUser();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header with back button */}
        <div className="mb-8">
          <Link
            href="/app/tool"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Tool</span>
          </Link>
          <h1 className="text-4xl font-bold mb-2">Billing & Subscription</h1>
          <p className="text-muted-foreground">
            Manage your plan and unlock the full power of Sprite Smithy
          </p>
        </div>

        {/* Current Plan Card */}
        <div className="bg-card border-2 border-border rounded-2xl p-8 space-y-6 mb-8 shadow-lg">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Current Plan</h2>
              <TierBadge />
              <p className="text-muted-foreground">
                {isPro ? 'You have lifetime access to all Pro features' : 'You\'re on the free trial'}
              </p>
            </div>
            {!isPro && (
              <div className="text-right">
                <div className="text-3xl font-bold mb-1">$0</div>
                <div className="text-sm text-muted-foreground">Free Trial</div>
              </div>
            )}
          </div>

          {isPro && purchase && (
            <div className="pt-6 border-t border-border">
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Amount Paid</div>
                  <div className="text-xl font-bold">
                    ${(purchase.amount_paid / 100).toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Purchase Date</div>
                  <div className="text-xl font-bold">
                    {purchase.purchased_at
                      ? new Date(purchase.purchased_at).toLocaleDateString()
                      : 'N/A'}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Status</div>
                  <div className="text-xl font-bold text-green-600 flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Active
                  </div>
                </div>
              </div>

              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6 mt-6">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-green-600 mb-1">
                      Lifetime Pro Access Active
                    </p>
                    <p className="text-sm text-muted-foreground">
                      You have lifetime access to all Pro features. No recurring charges, no expiration date.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Upgrade Section - Only show for free users */}
        {!isPro && (
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Free Tier Details */}
            <div className="bg-card border border-border rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-4">Free Trial Includes</h3>
              <ul className="space-y-3 mb-6">
                {[
                  '5 videos per month',
                  'All core processing features',
                  '7-step workflow',
                  'Watermarked exports',
                  'Browser-based processing',
                ].map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pro Tier - Compelling Upgrade Card */}
            <div className="relative bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary rounded-2xl p-8 shadow-xl">
              {/* Best Value Badge */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <div className="bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Best Value
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">Pro (Lifetime)</h3>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-5xl font-bold">$30</span>
                  <span className="text-muted-foreground">one-time</span>
                </div>
                <p className="text-sm text-green-600 font-medium flex items-center gap-1">
                  <Infinity className="w-4 h-4" />
                  Pay once, use forever
                </p>
              </div>

              <ul className="space-y-3 mb-6">
                {[
                  { text: 'Unlimited videos', highlight: true },
                  { text: 'No watermarks', highlight: true },
                  { text: 'All core features', highlight: false },
                  { text: 'Priority support', highlight: false },
                  { text: 'Early access to new features', highlight: false },
                  { text: 'Lifetime updates', highlight: false },
                  { text: 'Commercial use license', highlight: false },
                ].map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${feature.highlight ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className={`text-sm ${feature.highlight ? 'font-semibold' : ''}`}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              <UpgradeButton />
            </div>
          </div>
        )}

        {/* Upgrade CTA for Free Users */}
        {!isPro && (
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border-2 border-primary/20 rounded-2xl p-8 text-center">
            <div className="max-w-2xl mx-auto">
              <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-3">
                Ready to unlock unlimited potential?
              </h3>
              <p className="text-muted-foreground mb-6">
                Upgrade to Pro for just $30 one-time and get lifetime access to unlimited videos, 
                watermark-free exports, and all future features. No subscriptions, no recurring fees.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <UpgradeButton />
                <Link href="/app/tool">
                  <Button variant="outline" size="lg">
                    Continue with Free Trial
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* FAQ Section */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold mb-6">Frequently Asked Questions</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-xl p-6">
              <h4 className="font-semibold mb-2">Is this a subscription?</h4>
              <p className="text-sm text-muted-foreground">
                No! The Pro tier is a one-time payment of $30 for lifetime access. No monthly fees, no recurring charges.
              </p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6">
              <h4 className="font-semibold mb-2">Can I use this for commercial projects?</h4>
              <p className="text-sm text-muted-foreground">
                Yes! The Pro tier includes a commercial use license. Create sprites for your games, client projects, or anything else.
              </p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6">
              <h4 className="font-semibold mb-2">What happens after the free trial?</h4>
              <p className="text-sm text-muted-foreground">
                You can continue using the free tier indefinitely with watermarked exports and 5 videos/month limit. Upgrade to Pro anytime for unlimited access.
              </p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6">
              <h4 className="font-semibold mb-2">Do I get updates?</h4>
              <p className="text-sm text-muted-foreground">
                Yes! All Pro users receive lifetime updates and early access to new features at no additional cost.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
