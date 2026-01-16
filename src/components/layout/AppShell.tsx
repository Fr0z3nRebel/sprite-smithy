'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp, LayoutGrid } from 'lucide-react';
import LeftPanel from './LeftPanel';
import CenterPanel from './CenterPanel';
import RightPanel from './RightPanel';
import MobileNav from './MobileNav';
import MobileHeader from './MobileHeader';
import Sheet from '@/components/ui/Sheet';
import UserMenu from '@/components/auth/UserMenu';
import TierBadge from '@/components/billing/TierBadge';
import { useUsage } from '@/hooks/useUsage';
import { useAuth } from '@/hooks/useAuth';
import { useStore } from '@/store';

export default function AppShell() {
  // Initialize usage data once at app level
  useUsage();
  const { user } = useAuth();
  const frames = useStore((state) => state.frames);
  // Start with top bar visible, then auto-hide after a delay for logged-in users
  const [isTopBarVisible, setIsTopBarVisible] = useState(true);
  const [isMobileFramesOpen, setIsMobileFramesOpen] = useState(false);
  const topBarRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only apply auto-hide when user is logged in
    if (!user) {
      setIsTopBarVisible(true);
      return;
    }

    // Auto-hide after initial display for logged-in users
    const initialHideTimeout = setTimeout(() => {
      setIsTopBarVisible(false);
    }, 2000); // Show for 2 seconds initially, then hide

    const handleMouseMove = (e: MouseEvent) => {
      // Show top bar when mouse is within 80px of the top
      if (e.clientY <= 80) {
        setIsTopBarVisible(true);
        // Clear any pending hide timeout
        if (hideTimeoutRef.current) {
          clearTimeout(hideTimeoutRef.current);
          hideTimeoutRef.current = null;
        }
      } else {
        // Hide top bar after a short delay when mouse moves away
        if (hideTimeoutRef.current) {
          clearTimeout(hideTimeoutRef.current);
        }
        hideTimeoutRef.current = setTimeout(() => {
          setIsTopBarVisible(false);
        }, 500);
      }
    };

    // Also show when hovering over the top bar itself or the arrow
    const handleShowBar = () => {
      setIsTopBarVisible(true);
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
    };

    const handleHideBar = () => {
      hideTimeoutRef.current = setTimeout(() => {
        setIsTopBarVisible(false);
      }, 500);
    };

    window.addEventListener('mousemove', handleMouseMove);
    const topBarElement = topBarRef.current;
    const arrowElement = arrowRef.current;
    if (topBarElement) {
      topBarElement.addEventListener('mouseenter', handleShowBar);
      topBarElement.addEventListener('mouseleave', handleHideBar);
    }
    if (arrowElement) {
      arrowElement.addEventListener('mouseenter', handleShowBar);
    }

    return () => {
      clearTimeout(initialHideTimeout);
      window.removeEventListener('mousemove', handleMouseMove);
      if (topBarElement) {
        topBarElement.removeEventListener('mouseenter', handleShowBar);
        topBarElement.removeEventListener('mouseleave', handleHideBar);
      }
      if (arrowElement) {
        arrowElement.removeEventListener('mouseenter', handleShowBar);
      }
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, [user]);

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
        <div className="flex-1 flex flex-col overflow-hidden bg-muted/20 relative">
          {/* MobileHeader - mobile only */}
          <div className="lg:hidden">
            <MobileHeader onFramesClick={() => setIsMobileFramesOpen(true)} />
          </div>

          {/* Top bar with user menu and tier badge - floating on top (desktop only) */}
          <div
            ref={topBarRef}
            className={`hidden lg:flex absolute top-0 left-0 right-0 items-center justify-between px-6 py-3 border-b border-border bg-background z-10 transition-transform duration-300 ease-in-out ${
              user && !isTopBarVisible
                ? '-translate-y-full pointer-events-none'
                : 'translate-y-0'
            }`}
          >
            <TierBadge />
            <UserMenu />
            
            {/* Tab indicator - moves with the top bar */}
            {user && (
              <div
                ref={arrowRef}
                className="absolute bottom-0 right-12 translate-y-full cursor-pointer"
              >
                <div className="flex items-center justify-center px-4 py-2 bg-background border-l border-r border-b border-border rounded-b-lg shadow-sm hover:bg-muted/50 transition-colors">
                  {isTopBarVisible ? (
                    <ChevronUp className="w-6 h-6 text-muted-foreground hover:text-foreground transition-colors" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-muted-foreground hover:text-foreground transition-colors" />
                  )}
                </div>
              </div>
            )}
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
