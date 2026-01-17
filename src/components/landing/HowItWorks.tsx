export default function HowItWorks() {
  const steps = [
    {
      number: 1,
      title: 'Upload Your Video',
      description: 'Upload your AI-generated character video. Supports MP4, WebM, and MOV formats up to 100MB.',
    },
    {
      number: 2,
      title: 'Select Loop Range',
      description: 'Define the perfect loop range for your animation cycle with frame-by-frame precision.',
    },
    {
      number: 3,
      title: 'Extract Frames',
      description: 'Our Canvas API extracts individual frames from your video with pixel-perfect quality.',
    },
    {
      number: 4,
      title: 'Remove Background',
      description: 'Use chroma key with adjustable threshold to remove backgrounds cleanly.',
    },
    {
      number: 5,
      title: 'Auto-Crop & Size',
      description: 'Automatically crop and normalize all frames to consistent dimensions.',
    },
    {
      number: 6,
      title: 'Clean Edges',
      description: 'Advanced halo removal post-processing for professional-looking sprites.',
    },
    {
      number: 7,
      title: 'Export',
      description: 'Download your sprite sheet, individual frames, and metadata - all in one ZIP file.',
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            7 Simple Steps to Perfect Sprites
          </h2>
          <p className="text-xl text-muted-foreground">
            A streamlined workflow designed for speed and precision
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="group relative"
            >
              <div className="flex gap-6 items-start">
                {/* Step Number */}
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold group-hover:scale-110 transition-transform">
                  {step.number}
                </div>

                {/* Step Content */}
                <div className="flex-1 pb-8">
                  <div className="bg-card border border-border rounded-lg p-6 group-hover:border-primary/50 group-hover:shadow-lg transition-all">
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              </div>

              {/* Connecting Line */}
              {index < steps.length - 1 && (
                <div className="absolute left-6 top-12 w-0.5 h-6 bg-border"></div>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="text-lg text-muted-foreground mb-6">
            All processing happens in your browser - fast, secure, and private
          </p>
          <a
            href="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition"
          >
            Get Started Free
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
