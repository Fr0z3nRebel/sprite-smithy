'use client';

import LeftPanel from './LeftPanel';
import CenterPanel from './CenterPanel';
import RightPanel from './RightPanel';

export default function AppShell() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Left Panel - Controls */}
      <div className="w-80 border-r border-border overflow-y-auto">
        <LeftPanel />
      </div>

      {/* Center Panel - Preview */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <CenterPanel />
      </div>

      {/* Right Panel - Frame Grid & Export */}
      <div className="w-96 border-l border-border overflow-y-auto">
        <RightPanel />
      </div>
    </div>
  );
}
