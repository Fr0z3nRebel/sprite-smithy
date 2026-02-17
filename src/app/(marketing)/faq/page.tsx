import type { Metadata } from 'next';
import { faqItems } from './faqItems';

const baseUrl =
  typeof process.env.NEXT_PUBLIC_APP_URL === 'string'
    ? process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '')
    : 'https://spritesmithy.com';

export const metadata: Metadata = {
  title: 'FAQ - Sprite Smithy',
  description:
    'Common questions about Sprite Smithy: pricing, security, supported video formats, export metadata, and how features like Halo Removal and Auto-Normalization work.',
};

function FAQPageJsonLd() {
  const faqPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    url: `${baseUrl}/faq`,
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(faqPageSchema),
      }}
    />
  );
}

export default function FAQPage() {
  const generalItems = faqItems.slice(0, 3);
  const technicalItems = faqItems.slice(3, 6);
  const toolItems = faqItems.slice(6, 9);

  return (
    <>
      <FAQPageJsonLd />
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <header className="mb-12">
            <h1 className="text-4xl font-bold mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-muted-foreground text-lg">
              Quick answers about pricing, security, formats, and how Sprite
              Smithy works.
            </p>
          </header>

          <section
            className="mb-12"
            aria-labelledby="general-questions"
          >
            <h2
              id="general-questions"
              className="text-2xl font-semibold mb-4 scroll-mt-8"
            >
              General Questions
            </h2>
            <ul className="list-none p-0 m-0 flex flex-col gap-4">
              {generalItems.map((item, i) => (
                <li key={item.question}>
                  <article
                    className="rounded-lg border border-border bg-muted/30 p-5"
                    aria-labelledby={`faq-general-${i}`}
                  >
                    <h3
                      id={`faq-general-${i}`}
                      className="text-lg font-semibold mb-2 text-foreground"
                    >
                      {item.question}
                    </h3>
                    <p className="mb-0 text-muted-foreground leading-relaxed">
                      {item.answer}
                    </p>
                  </article>
                </li>
              ))}
            </ul>
          </section>

          <section
            className="mb-12"
            aria-labelledby="technical-compatibility"
          >
            <h2
              id="technical-compatibility"
              className="text-2xl font-semibold mb-4 scroll-mt-8"
            >
              Technical & Compatibility
            </h2>
            <ul className="list-none p-0 m-0 flex flex-col gap-4">
              {technicalItems.map((item, i) => (
                <li key={item.question}>
                  <article
                    className="rounded-lg border border-border bg-muted/30 p-5"
                    aria-labelledby={`faq-technical-${i}`}
                  >
                    <h3
                      id={`faq-technical-${i}`}
                      className="text-lg font-semibold mb-2 text-foreground"
                    >
                      {item.question}
                    </h3>
                    <p className="mb-0 text-muted-foreground leading-relaxed">
                      {item.answer}
                    </p>
                  </article>
                </li>
              ))}
            </ul>
          </section>

          <section
            className="mb-8"
            aria-labelledby="using-the-tool"
          >
            <h2
              id="using-the-tool"
              className="text-2xl font-semibold mb-4 scroll-mt-8"
            >
              Using the Tool
            </h2>
            <ul className="list-none p-0 m-0 flex flex-col gap-4">
              {toolItems.map((item, i) => (
                <li key={item.question}>
                  <article
                    className="rounded-lg border border-border bg-muted/30 p-5"
                    aria-labelledby={`faq-tool-${i}`}
                  >
                    <h3
                      id={`faq-tool-${i}`}
                      className="text-lg font-semibold mb-2 text-foreground"
                    >
                      {item.question}
                    </h3>
                    <p className="mb-0 text-muted-foreground leading-relaxed">
                      {item.answer}
                    </p>
                  </article>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
    </>
  );
}
