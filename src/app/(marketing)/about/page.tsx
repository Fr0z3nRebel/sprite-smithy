import type { Metadata } from 'next';
import Image from 'next/image';

const baseUrl =
  typeof process.env.NEXT_PUBLIC_APP_URL === 'string'
    ? process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '')
    : 'https://spritesmithy.com';

export const metadata: Metadata = {
  title: 'About Sprite Smithy - The Story Behind the Tool',
  description:
    'Sprite Smithy was built by John Adams (Lefty Studios, Looxahoma, MS), a game developer using GDevelop. Learn why he built a free, privacy-first video-to-sprite tool with deterministic processing and chroma keying—no uploads, no account required.',
};

function AboutPageJsonLd() {
  const aboutPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About Sprite Smithy',
    description:
      'The story behind Sprite Smithy: a free, browser-based tool built by John Adams (Lefty Studios) for turning AI videos into sprite sheets. Privacy-first, deterministic processing, no account required.',
    url: `${baseUrl}/about`,
    mainEntity: {
      '@type': 'Person',
      name: 'John Adams',
      jobTitle: 'Game Developer',
      worksFor: { '@type': 'Organization', name: 'Lefty Studios' },
      address: { '@type': 'PostalAddress', addressLocality: 'Looxahoma', addressRegion: 'MS' },
      description: 'Game developer and creator of Sprite Smithy. Built this tool to solve the problem of turning AI-generated videos into usable sprite sheets without expensive software.',
    },
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Sprite Smithy',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web Browser',
    description:
      'Transform AI-generated character videos into perfectly aligned, loopable 2D sprite sheets. Uses deterministic image processing, chroma keying, and frame-perfect looping. All processing happens in the browser via the Canvas API—videos are never uploaded to a server.',
    url: baseUrl,
    author: {
      '@type': 'Person',
      name: 'John Adams',
      jobTitle: 'Game Developer',
      worksFor: { '@type': 'Organization', name: 'Lefty Studios' },
      address: { '@type': 'PostalAddress', addressLocality: 'Looxahoma', addressRegion: 'MS' },
      description: 'Game developer using GDevelop who built Sprite Smithy to automate sprite sheet creation from video.',
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: [
      'Deterministic frame extraction and alignment',
      'Chroma key / green screen removal',
      'Frame-perfect loop selection',
      'Browser-based processing (Canvas API)',
      'No server uploads—privacy-first',
      'Free, no account required',
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(aboutPageSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareSchema),
        }}
      />
    </>
  );
}

export default function AboutPage() {
  return (
    <>
      <AboutPageJsonLd />
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="prose prose-slate dark:prose-invert max-w-none">
          {/* Hero */}
          <header className="mb-16">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              The Story Behind Sprite Smithy
            </h1>
            <p className="text-xl text-muted-foreground">
              Why John Adams (Lefty Studios) built a free, privacy-first tool to
              turn videos into sprite sheets—and why it works the way it does.
            </p>
          </header>

          {/* Section 1: The GDevelop Struggle */}
          <section className="mb-14" aria-labelledby="gdevelop-struggle">
            <h2
              id="gdevelop-struggle"
              className="text-2xl font-semibold mb-4 scroll-mt-8"
            >
              The GDevelop Struggle
            </h2>
            <p className="mb-4">
              I built Sprite Smithy because I&apos;m a game developer—and I use{' '}
              <strong>GDevelop</strong>. Like a lot of indie devs, I wanted to
              turn AI-generated character videos into usable sprite sheets
              without paying for expensive, bloated software. The options were
              either subscription tools that felt like overkill, or manual
              frame-by-frame work in an image editor. Neither fit: I needed
              something fast, deterministic, and tuned for the kind of
              sprite-smithing that actually matters in a game engine.
            </p>
            <p className="mb-4">
              The frustration was real: wanting to go from &quot;video of a
              character&quot; to &quot;clean sprite sheet I can drop into
              GDevelop&quot; without guesswork, watermarks, or a credit card.
              So I built the tool I wished existed.
            </p>
          </section>

          {/* Section 2: Building a Better Anvil */}
          <section className="mb-14" aria-labelledby="building-anvil">
            <h2
              id="building-anvil"
              className="text-2xl font-semibold mb-4 scroll-mt-8"
            >
              Building a Better Anvil
            </h2>
            <p className="mb-4">
              The &quot;smithing&quot; of a sprite isn&apos;t just cropping
              frames. It&apos;s about <strong>deterministic processing</strong>:
              same video in, same sprite sheet out, every time. No random
              compression or alignment drift. You need{' '}
              <strong>chroma keying</strong> that actually removes green screen
              (or whatever background you used) without leaving halos or
              inconsistent edges. And you need <strong>frame-perfect looping</strong>{' '}
              so the first and last frame line up—otherwise your run or idle
              animation stutters in-engine.
            </p>
            <p className="mb-4">
              I used my dev experience to automate the tedious parts: alignment,
              background removal, halo cleanup, and loop selection. The result is
              a workflow that respects what game devs actually need: predictable
              output, control over the loop range, and exports that drop straight
              into a project.
            </p>
          </section>

          {/* Section 3: Our Philosophy */}
          <section className="mb-14" aria-labelledby="our-philosophy">
            <h2
              id="our-philosophy"
              className="text-2xl font-semibold mb-4 scroll-mt-8"
            >
              Our Philosophy
            </h2>
            <p className="mb-4">
              <strong>Free.</strong> No tiers, no paywall, no &quot;export
              limit.&quot; If you find it useful, use it.
            </p>
            <p className="mb-4">
              <strong>Browser-based.</strong> You don&apos;t install anything.
              Open the tool, load your video, and go.
            </p>
            <p className="mb-4">
              <strong>Privacy-first.</strong> This is non-negotiable. All
              processing happens in your browser using the{' '}
              <strong>Canvas API</strong>. Your videos are never uploaded to our
              servers—or anyone else&apos;s. What runs on your machine stays on
              your machine. We don&apos;t store your footage, and you don&apos;t
              need an account to use the tool.
            </p>
            <p className="mb-4">
              No corporate speak, no upsells. Just a tool built by someone who
              had the same problem you might have—and who wanted to fix it for
              the community. That&apos;s me, John Adams, from Looxahoma, MS, and
              my company Lefty Studios.
            </p>
          </section>

          {/* Developer Note / Signature */}
          <section
            className="mt-16 pt-10 border-t border-border"
            aria-labelledby="developer-note"
          >
            <h2
              id="developer-note"
              className="text-xl font-semibold mb-4 scroll-mt-8 text-muted-foreground"
            >
              A Note from the Developer
            </h2>
            <div className="flex flex-col sm:flex-row gap-6 items-stretch">
              <figure className="shrink-0 w-48 sm:w-56 relative min-h-[140px] sm:min-h-0">
                <Image
                  src="/assets/MeGDev.png"
                  alt="John Adams, Lefty Studios"
                  fill
                  sizes="(max-width: 640px) 224px, 14rem"
                  className="rounded-lg object-cover border border-border"
                />
                <figcaption className="sr-only">John Adams, Lefty Studios</figcaption>
              </figure>
              <div className="rounded-lg bg-muted/30 border border-border p-6 text-muted-foreground flex-1 min-w-0">
                <p className="mb-4">
                  Sprite Smithy exists because the gap between &quot;I have a
                  video&quot; and &quot;I have a sprite sheet&quot; was too big
                  for most of us. If this tool saves you an hour of manual work
                  or helps you ship something you&apos;re proud of, that&apos;s
                  the goal. Feedback and ideas are always welcome—reach out
                  through the site if you want to say hi or suggest an
                  improvement.
                </p>
                <p className="mb-0 font-medium text-foreground">
                  — John Adams
                  <span className="block text-sm font-normal text-muted-foreground mt-1">
                    Lefty Studios · Looxahoma, MS
                  </span>
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
