'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { LayoutGrid, HelpCircle } from 'lucide-react';
import { useStore } from '@/store';
import UserMenu from '@/components/auth/UserMenu';

interface MobileHeaderProps {
  onFramesClick?: () => void;
}

export default function MobileHeader({ onFramesClick }: MobileHeaderProps) {
  const frames = useStore((state) => state.frames);
  const session = useStore((state) => state.session);
  const isAuthenticated = !!session;
  const [isHelpMenuOpen, setIsHelpMenuOpen] = useState(false);

  return (
    <div className="flex items-center justify-between px-4 h-16 border-b border-border bg-background z-10">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition flex-1 min-w-0">
        <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center">
          <Image
            src="/assets/sprite-smithy-logo.webp"
            alt="Sprite Smithy Logo"
            width={40}
            height={40}
            className="object-contain"
          />
        </div>
        <span className="text-xl font-bold text-foreground truncate">Sprite Smithy</span>
      </Link>

      {/* Frames Button + Help Button + User Menu */}
      <div className="flex items-center -space-x-1 flex-shrink-0">
        {frames.raw.length > 0 && onFramesClick && (
          <button
            onClick={onFramesClick}
            className="flex items-center px-3 py-2 rounded-lg hover:bg-muted/50 transition"
            aria-label="View frames"
          >
            <LayoutGrid className="w-8 h-8 text-foreground" />
          </button>
        )}
        <div className="relative">
          <button
            onClick={() => setIsHelpMenuOpen(!isHelpMenuOpen)}
            className="flex items-center px-3 py-2 rounded-lg hover:bg-muted/50 transition"
            aria-label="Help"
          >
            <HelpCircle className="w-8 h-8 text-foreground" />
          </button>
          {isHelpMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsHelpMenuOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-56 bg-background border border-border rounded-lg shadow-lg z-20 overflow-hidden">
                <div className="py-1">
                  <Link
                    href="/#features"
                    className="block px-4 py-2 text-sm hover:bg-muted/50 transition"
                    onClick={() => setIsHelpMenuOpen(false)}
                  >
                    Features
                  </Link>
                  <Link
                    href="/#how-it-works"
                    className="block px-4 py-2 text-sm hover:bg-muted/50 transition"
                    onClick={() => setIsHelpMenuOpen(false)}
                  >
                    How It Works
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
        <UserMenu />
      </div>
    </div>
  );
}
