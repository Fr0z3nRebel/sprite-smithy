/** @type {import('next').NextConfig} */
const nextConfig = {
  // Satisfy Next.js 16 when using Turbopack (dev default) with existing webpack config
  turbopack: {},
  webpack: (config, { isServer }) => {
    // Required for @ffmpeg/ffmpeg to work properly
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      crypto: false,
    };

    // Add support for Web Workers
    config.module.rules.push({
      test: /\.worker\.(js|ts)$/,
      use: { loader: 'worker-loader' },
    });

    // Exclude Remotion files from Next.js bundling
    // Remotion is a separate tool and should not be bundled with Next.js
    const { IgnorePlugin } = require('webpack');
    config.plugins.push(
      new IgnorePlugin({
        resourceRegExp: /^remotion/,
      })
    );

    return config;
  },
  // Required for ffmpeg.wasm - SharedArrayBuffer support
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
