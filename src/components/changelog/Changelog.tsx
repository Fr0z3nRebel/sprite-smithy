'use client';

import { Newspaper } from 'lucide-react';
import { useStore } from '@/store';

interface Update {
  date: string;
  items: string[];
}

const updates: Update[] = [
  {
    date: 'January 17, 2026',
    items: [
      'Sprite Smithy is now completely free for all users! No watermarks, unlimited commercial use, and all features available at no cost',
    ],
  },
  {
    date: 'January 16, 2026',
    items: [
      'Added mobile responsive layout with bottom navigation for better mobile experience',
      'Moved changelog to dedicated view accessible from top navigation',
    ],
  },
  {
    date: 'January 14, 2026',
    items: [
      'Added auto-hide top bar with tab indicator for cleaner interface',
      'Improved privacy by hiding user email from top-right menu',
    ],
  },
  {
    date: 'January 13, 2026',
    items: [
      'Fixed playback rate clamping and prevented play/pause conflicts',
      'Simplified halo remover preview to single image view',
      'Improved auto-crop preview and padding controls',
      'Added background preview toggle to background removal step',
    ],
  },
  {
    date: 'December 23, 2025',
    items: [
      'Fixed Free Trial message display for Pro users in export',
      'Added frame skip and preview FPS controls to loop selection',
      'Fixed duplicate API calls in purchase and user data fetching',
      'Added export limit modal with Pro upsell for free tier users',
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
                  className="text-sm text-muted-foreground flex items-start gap-2"
                >
                  <span className="text-primary mt-1">•</span>
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
