import Link from 'next/link';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4 py-24 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            All Features Free - No Credit Card Required
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            Transform AI Videos into
            <span className="block bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Perfect Sprite Sheets
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Deterministic processing. Zero guesswork. Built for game developers who need pixel-perfect results.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 text-lg"
            >
              Get Started Free
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="#how-it-works"
              className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-8 text-lg"
            >
              See How It Works
            </Link>
          </div>

          {/* Social Proof */}
          <div className="pt-8 flex flex-col items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <Image
                    key={i}
                    src={`/assets/testimonial-pic${i}.jpeg`}
                    alt={`Testimonial ${i}`}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full border-2 border-background object-cover"
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                Join game developers already using Sprite Smithy
              </span>
            </div>
            <div className="flex items-center gap-1 text-yellow-500">
              {[1, 2, 3, 4, 5].map((i) => (
                <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="ml-2 text-sm text-muted-foreground">4.9/5 from users</span>
            </div>
          </div>
        </div>

        {/* Hero Image/Screenshot */}
        <div className="mt-16 max-w-5xl mx-auto">
          <div className="relative rounded-xl border border-border shadow-2xl overflow-hidden bg-muted/20">
            {/* Mobile Screenshot - visible on small/medium screens */}
            <div className="block md:hidden">
              <Image
                src="/assets/landing-screenshot-mobile.png"
                alt="Sprite Smithy Tool Screenshot - Mobile"
                width={800}
                height={600}
                className="w-full h-auto"
                priority
              />
            </div>
            {/* Desktop Screenshot - visible on large screens */}
            <div className="hidden md:block">
              <Image
                src="/assets/landing-screenshot-desktop.png"
                alt="Sprite Smithy Tool Screenshot - Desktop"
                width={1920}
                height={1080}
                className="w-full h-auto"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      {/* Background Decoration */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
    </section>
  );
}
