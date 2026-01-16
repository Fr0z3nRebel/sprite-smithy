'use client';

import Image from 'next/image';
import { LayoutGrid } from 'lucide-react';
import { useStore } from '@/store';
import UserMenu from '@/components/auth/UserMenu';

interface MobileHeaderProps {
  onFramesClick?: () => void;
}

export default function MobileHeader({ onFramesClick }: MobileHeaderProps) {
  const frames = useStore((state) => state.frames);

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-background z-10">
      {/* Logo + Step Name */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="h-6 w-6 flex-shrink-0 flex items-center justify-center">
          <Image
            src="/assets/sprite-smithy-logo.webp"
            alt="Sprite Smithy Logo"
            width={24}
            height={24}
            className="object-contain h-full w-full"
          />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-semibold text-foreground truncate">
            Sprite Smithy
          </h2>
        </div>
      </div>

      {/* Frames Button + Tier Badge + User Menu */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {frames.raw.length > 0 && onFramesClick && (
          <button
            onClick={onFramesClick}
            className="relative p-2 rounded-lg hover:bg-muted/50 transition-colors"
            aria-label="View frames"
          >
            <LayoutGrid className="w-5 h-5 text-foreground" />
            {frames.raw.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground rounded-full text-[10px] font-semibold flex items-center justify-center">
                {frames.raw.length}
              </span>
            )}
          </button>
        )}
        <UserMenu />
      </div>
    </div>
  );
}
