import { Wand2, Crop, Eraser, RotateCw, Download, Eye } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: Wand2,
      title: 'Chroma Key Background Removal',
      description: 'AI-powered color keying with precision threshold controls. Remove backgrounds with surgical accuracy.',
    },
    {
      icon: Crop,
      title: 'Auto-Crop & Normalize',
      description: 'Consistent sprite sizing across all frames. Automatic bounding box detection and normalization.',
    },
    {
      icon: Eraser,
      title: 'Halo Removal',
      description: 'Clean edge artifacts with advanced post-processing. Get professional-looking sprites every time.',
    },
    {
      icon: RotateCw,
      title: 'Perfect Loop Detection',
      description: 'Frame-perfect animation cycles. Select the exact range for seamless sprite animations.',
    },
    {
      icon: Download,
      title: 'Batch Export',
      description: 'Export sprite sheets, PNG sequences, and metadata. Complete package ready for your game engine.',
    },
    {
      icon: Eye,
      title: 'Real-Time Preview',
      description: 'See changes instantly as you adjust settings. Preview every step before exporting.',
    },
  ];

  return (
    <section id="features" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Everything You Need for Perfect Sprites
          </h2>
          <p className="text-xl text-muted-foreground">
            Professional-grade tools designed specifically for game developers
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative p-6 rounded-xl border border-border hover:border-primary/50 transition-all hover:shadow-lg bg-card"
              >
                <div className="mb-4 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>

        {/* Additional Features List */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-4">
            {[
              'Private and secure browser-based processing',
              'Support for MP4, WebM, and MOV formats',
              'Customizable sprite sheet layouts',
              'Export metadata for easy integration',
              'Frame-by-frame control and preview',
              'No installation required - works in any modern browser',
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
