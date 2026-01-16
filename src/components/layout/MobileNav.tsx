'use client';

import { useStore } from '@/store';
import {
  Upload,
  RefreshCcw,
  LayoutGrid,
  Eraser,
  Crop,
  Circle,
  Download,
} from 'lucide-react';

const steps = [
  { id: 1, name: 'Upload Video', icon: Upload },
  { id: 2, name: 'Loop Selection', icon: RefreshCcw },
  { id: 3, name: 'Frame Extraction', icon: LayoutGrid },
  { id: 4, name: 'Background Removal', icon: Eraser },
  { id: 5, name: 'Auto-Crop', icon: Crop },
  { id: 6, name: 'Halo Remover', icon: Circle },
  { id: 7, name: 'Export', icon: Download },
] as const;

interface MobileNavProps {
  className?: string;
  onStepChange?: () => void;
}

export default function MobileNav({ className, onStepChange }: MobileNavProps) {
  const currentStep = useStore((state) => state.currentStep);
  const setCurrentStep = useStore((state) => state.setCurrentStep);
  const videoUrl = useStore((state) => state.video.url);
  const frames = useStore((state) => state.frames);

  // Determine which steps are accessible based on progress
  const isStepAccessible = (stepId: number) => {
    if (stepId === 1) return true;
    if (stepId === 2) return !!videoUrl;
    if (stepId >= 3 && stepId <= 7) return !!videoUrl;
    return false;
  };

  // Determine if step is complete
  const isStepComplete = (stepId: number) => {
    if (stepId === 1) return !!videoUrl;
    if (stepId === 2) return !!videoUrl;
    if (stepId === 3) return frames.raw.length > 0;
    if (stepId === 4) return frames.processed.length > 0;
    if (stepId === 5) return frames.processed.length > 0;
    if (stepId === 6) return frames.processed.length > 0;
    return false;
  };

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 bg-background border-t border-border z-40 safe-area-inset-bottom ${className || ''}`}
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0)' }}
    >
      <div className="flex items-center justify-around px-2 py-2">
        {steps.map((step) => {
          const accessible = isStepAccessible(step.id);
          const complete = isStepComplete(step.id);
          const isActive = currentStep === step.id;
          const Icon = step.icon;

          return (
            <button
              key={step.id}
              onClick={() => {
                if (accessible) {
                  setCurrentStep(step.id);
                  onStepChange?.();
                }
              }}
              disabled={!accessible}
              className={`flex flex-col items-center justify-center gap-1 px-2 py-2 rounded-lg transition-colors min-w-[50px] ${
                isActive
                  ? 'text-primary'
                  : accessible
                  ? 'text-foreground'
                  : 'text-muted-foreground/50'
              } ${!accessible ? 'cursor-not-allowed' : ''}`}
              aria-label={step.name}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 ${
                    isActive ? 'text-primary' : ''
                  }`}
                />
                {complete && !isActive && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full" />
                )}
              </div>
              <span
                className={`text-[10px] font-medium ${
                  isActive ? 'text-primary' : ''
                }`}
              >
                {step.id}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
