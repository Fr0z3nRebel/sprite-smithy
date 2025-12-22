import Link from 'next/link';
import { Check } from 'lucide-react';

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-muted-foreground">
            Start free, upgrade when you're ready. No subscriptions, no hidden fees.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Tier */}
          <div className="relative rounded-2xl border-2 border-border p-8 bg-card">
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2">Free Trial</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold">$0</span>
                <span className="text-muted-foreground">forever</span>
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              {[
                '5 videos per month',
                'All core processing features',
                '7-step workflow',
                'Watermarked exports',
                'Browser-based processing',
                'No credit card required',
              ].map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-8 text-base w-full"
            >
              Start Free
            </Link>
          </div>

          {/* Pro Tier */}
          <div className="relative rounded-2xl border-2 border-primary p-8 bg-card shadow-xl">
            {/* Best Value Badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <div className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                Best Value
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2">Pro (Lifetime)</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold">$30</span>
                <span className="text-muted-foreground">one-time</span>
              </div>
              <p className="text-sm text-green-600 mt-2">
                ✓ Pay once, use forever
              </p>
            </div>

            <ul className="space-y-4 mb-8">
              {[
                'Unlimited videos',
                'No watermarks',
                'All core features',
                'Priority support',
                'Early access to new features',
                'Lifetime updates',
                'Commercial use license',
                'Cancel anytime (no recurring fees)',
              ].map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className={index < 2 ? 'font-semibold' : ''}>{feature}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 text-base w-full"
            >
              Upgrade to Pro
            </Link>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h3>
          <div className="space-y-6">
            <div className="border border-border rounded-lg p-6 bg-card">
              <h4 className="font-semibold mb-2">What happens after the free trial?</h4>
              <p className="text-muted-foreground">
                You can continue using the free tier indefinitely with watermarked exports and 5 videos/month limit. Upgrade to Pro anytime for unlimited access.
              </p>
            </div>
            <div className="border border-border rounded-lg p-6 bg-card">
              <h4 className="font-semibold mb-2">Is this a subscription?</h4>
              <p className="text-muted-foreground">
                No! The Pro tier is a one-time payment of $30 for lifetime access. No monthly fees, no recurring charges.
              </p>
            </div>
            <div className="border border-border rounded-lg p-6 bg-card">
              <h4 className="font-semibold mb-2">Can I use this for commercial projects?</h4>
              <p className="text-muted-foreground">
                Yes! The Pro tier includes a commercial use license. Create sprites for your games, client projects, or anything else.
              </p>
            </div>
            <div className="border border-border rounded-lg p-6 bg-card">
              <h4 className="font-semibold mb-2">Do I need to install anything?</h4>
              <p className="text-muted-foreground">
                No! Everything runs in your browser. Just sign up and start creating. Your videos never leave your computer.
              </p>
            </div>
          </div>
        </div>

        {/* Money Back Guarantee */}
        <div className="mt-12 max-w-2xl mx-auto">
          <div className="bg-primary/10 border border-primary/20 rounded-xl p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">7-Day Money Back Guarantee</h3>
            <p className="text-muted-foreground">
              Try Sprite Smithy Pro risk-free. If you're not satisfied within 7 days, we'll refund you in full. No questions asked.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
