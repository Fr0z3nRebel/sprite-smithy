'use client';

import LeftPanel from './LeftPanel';
import CenterPanel from './CenterPanel';
import RightPanel from './RightPanel';
import UserMenu from '@/components/auth/UserMenu';
import TierBadge from '@/components/billing/TierBadge';
import { useUsage } from '@/hooks/useUsage';

export default function AppShell() {
  // Initialize usage data once at app level
  useUsage();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Left Panel - Controls */}
      <div className="w-80 border-r border-border overflow-y-auto">
        <LeftPanel />
      </div>

      {/* Center Panel - Preview */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar with user menu and tier badge */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-background">
          <TierBadge />
          <UserMenu />
        </div>
        <CenterPanel />
      </div>

      {/* Right Panel - Frame Grid & Export */}
      <div className="w-96 border-l border-border overflow-y-auto">
        <RightPanel />
      </div>
    </div>
  );
}
