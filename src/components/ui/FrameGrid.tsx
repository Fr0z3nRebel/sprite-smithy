'use client';

import { useState } from 'react';

interface FrameGridProps {
  thumbnails: string[];
  maxVisible?: number;
}

export default function FrameGrid({
  thumbnails,
  maxVisible = 12,
}: FrameGridProps) {
  const [showAll, setShowAll] = useState(false);

  const visibleThumbnails = showAll
    ? thumbnails
    : thumbnails.slice(0, maxVisible);
  const hasMore = thumbnails.length > maxVisible;

  if (thumbnails.length === 0) {
    return (
      <div className="grid grid-cols-3 gap-2">
        {[...Array(9)].map((_, i) => (
          <div
            key={i}
            className="aspect-square bg-muted rounded border border-border flex items-center justify-center"
          >
            <span className="text-xs text-muted-foreground">{i + 1}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        {visibleThumbnails.map((thumbnail, index) => (
          <div
            key={index}
            className="aspect-square bg-muted rounded border border-border overflow-hidden group cursor-pointer hover:border-primary transition-colors"
            title={`Frame ${index + 1}`}
          >
            <img
              src={thumbnail}
              alt={`Frame ${index + 1}`}
              className="w-full h-full object-contain group-hover:scale-110 transition-transform"
            />
          </div>
        ))}
      </div>

      {hasMore && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full py-2 text-sm text-primary hover:text-primary/80 font-medium"
        >
          {showAll
            ? 'Show Less'
            : `Show All (${thumbnails.length - maxVisible} more)`}
        </button>
      )}
    </div>
  );
}
