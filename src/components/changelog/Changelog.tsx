'use client';

import { Newspaper } from 'lucide-react';
import { useStore } from '@/store';

interface Update {
  date: string;
  items: string[];
}

const updates: Update[] = [
  {
    date: 'February 17, 2026',
    items: [
      'Added animated GIF export and hash sprite sheet JSON for PixiJS/Phaser',
      'Released "Find End Frame" feature (step 2 magic wand)',
      'Added Getting Started guide at /guide and FAQ page with JSON-LD',
      'Fixed duration, presets, End Frame icon, and preview FPS timing in step 2',
      'Enhanced about imagery',
    ],
  },
  {
    date: 'February 16, 2026',
    items: [
      'Added docs and simplified landing icon',
    ],
  },
  {
    date: 'February 15, 2026',
    items: [
      'Added About page',
      'Made all commercial features available for free',
    ],
  },
  {
    date: 'January 17, 2026',
    items: [
      'Sprite Smithy is now completely free for all users!',
      'Watermarks removed, unlimited commercial use, and all features available at no cost',
    ],
  },
  {
    date: 'January 16, 2026',
    items: [
      'Added mobile responsive layout with bottom navigation',
      'Moved changelog to dedicated view; added help menu and improved nav',
      'Disabled pricing and billing',
    ],
  },
  {
    date: 'January 14, 2026',
    items: [
      'Hid user email from top-right menu for privacy',
    ],
  },
  {
    date: 'January 13, 2026',
    items: [
      'Fixed playback rate clamping and prevented play/pause conflicts',
      'Simplified halo remover preview to single image view',
      'Improved auto-crop preview and padding controls',
      'Added background preview toggle and latest updates box to left panel',
    ],
  },
  {
    date: 'December 23, 2025',
    items: [
      'Added frame skip and preview FPS controls to loop selection',
      'Added export limit modal, logo, favicon, and usage tracking for free tier',
      'Fixed Free Trial message for Pro and duplicate API calls',
    ],
  },
  {
    date: 'December 22, 2025',
    items: [
      'Launched SaaS: auth, payments, landing page, Privacy Policy, Terms of Service',
      'Enhanced billing page and fixed account settings and cookie chunking',
      'Replaced emoji logo with sprite-smithy-logo.webp',
    ],
  },
  {
    date: 'December 20, 2025',
    items: [
      'Added background toggle to halo remover preview',
      'Moved step controls to center panel',
      'Fixed frame count display on seek',
    ],
  },
  {
    date: 'December 19, 2025',
    items: [
      'Initial release',
    ],
  },
];

export default function Changelog() {
  const setShowChangelog = useStore((state) => state.setShowChangelog);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Newspaper className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Changelog</h1>
        </div>
        <p className="text-muted-foreground">
          Stay up to date with the latest features, improvements, and announcements.
        </p>
      </div>

      {/* Updates */}
      <div className="space-y-6">
        {updates.map((update, index) => (
          <div
            key={index}
            className="p-6 bg-accent/50 rounded-lg border border-border"
          >
            <div className="text-sm font-semibold text-foreground mb-3">
              {update.date}
            </div>
            <ul className="space-y-2">
              {update.items.map((item, itemIndex) => (
                <li
                  key={itemIndex}
                  className="text-sm text-muted-foreground flex items-center gap-2"
                >
                  <span className="text-primary">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Back button */}
      <div className="mt-8">
        <button
          onClick={() => setShowChangelog(false)}
          className="text-sm text-primary hover:underline"
        >
          ← Back to Tool
        </button>
      </div>
    </div>
  );
}
