'use client';

import { useState, useRef } from 'react';
import { Newspaper, HelpCircle } from 'lucide-react';
import LeftPanel from './LeftPanel';
import CenterPanel from './CenterPanel';
import RightPanel from './RightPanel';
import MobileNav from './MobileNav';
import MobileHeader from './MobileHeader';
import Sheet from '@/components/ui/Sheet';
import UserMenu from '@/components/auth/UserMenu';
import { useUsage } from '@/hooks/useUsage';
import { useStore } from '@/store';

function ChangelogButton() {
  const showChangelog = useStore((state) => state.showChangelog);
  const setShowChangelog = useStore((state) => state.setShowChangelog);

  return (
    <button
      onClick={() => setShowChangelog(!showChangelog)}
      className={`p-2 rounded-lg hover:bg-muted/50 transition-colors ${
        showChangelog ? 'bg-muted' : ''
      }`}
      aria-label="Changelog"
    >
      <Newspaper className="w-5 h-5 text-foreground" />
    </button>
  );
}

export default function AppShell() {
  // Initialize usage data once at app level
  useUsage();
  const [isMobileFramesOpen, setIsMobileFramesOpen] = useState(false);
  const [isHelpMenuOpen, setIsHelpMenuOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <div className="flex h-screen overflow-hidden bg-background">
        {/* Left Panel - Controls (desktop only) */}
        <div className="hidden lg:block w-80 border-r border-border overflow-y-auto">
          <LeftPanel 
            onStepChange={() => {
              scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </div>

        {/* Center Panel - Preview */}
        <div className="flex-1 flex flex-col overflow-hidden bg-muted/20">
          {/* MobileHeader - mobile only */}
          <div className="lg:hidden">
            <MobileHeader onFramesClick={() => setIsMobileFramesOpen(true)} />
          </div>

          {/* Top bar with user menu and changelog button (desktop only) */}
          <div className="hidden lg:flex items-center justify-between px-6 py-3 border-b border-border bg-background">
            <ChangelogButton />
            <div className="flex items-center -space-x-1">
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
                        <a
                          href="/#features"
                          className="block px-4 py-2 text-sm hover:bg-muted/50 transition"
                          onClick={() => setIsHelpMenuOpen(false)}
                        >
                          Features
                        </a>
                        <a
                          href="/#how-it-works"
                          className="block px-4 py-2 text-sm hover:bg-muted/50 transition"
                          onClick={() => setIsHelpMenuOpen(false)}
                        >
                          How It Works
                        </a>
                      </div>
                    </div>
                  </>
                )}
              </div>
              <UserMenu />
            </div>
          </div>

          {/* Content with bottom padding for mobile nav */}
          <div ref={scrollContainerRef} className="flex-1 overflow-y-auto pb-20 lg:pb-0">
            <CenterPanel />
          </div>

          {/* MobileNav - mobile only */}
          <MobileNav 
            className="lg:hidden" 
            onStepChange={() => {
              scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </div>

        {/* Right Panel - Frame Grid & Export (desktop only) */}
        <div className="hidden lg:block w-96 border-l border-border overflow-y-auto">
          <RightPanel />
        </div>
      </div>

      {/* Mobile Frames Sheet */}
      <Sheet
        isOpen={isMobileFramesOpen}
        onClose={() => setIsMobileFramesOpen(false)}
        title="Frames"
        height="half"
      >
        <RightPanel />
      </Sheet>
    </>
  );
}
