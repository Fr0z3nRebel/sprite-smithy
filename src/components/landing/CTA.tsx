import Link from 'next/link';

export default function CTA() {
  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl bg-gradient-to-br from-primary to-primary/80 p-12 md:p-16 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
            </div>

            {/* Content */}
            <div className="relative text-center space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground">
                Ready to Create Perfect Sprites?
              </h2>
              <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
                Join game developers who are already using Sprite Smithy to transform their AI videos into production-ready sprite sheets.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-white text-primary hover:bg-white/90 border-white text-lg px-8 py-6 h-11"
                >
                  Start Free Trial
                </Link>
                <Link
                  href="#pricing"
                  className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-primary-foreground text-primary hover:bg-primary-foreground/90 text-lg px-8 py-6 h-11"
                >
                  View Pricing
                </Link>
              </div>

              <p className="text-sm text-primary-foreground/80 pt-4">
                No credit card required • 5 free videos/month • Upgrade anytime
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
