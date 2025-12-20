'use client';

import { useStore } from '@/store';

export default function LeftPanel() {
  const currentStep = useStore((state) => state.currentStep);
  const setCurrentStep = useStore((state) => state.setCurrentStep);
  const videoUrl = useStore((state) => state.video.url);
  const frames = useStore((state) => state.frames);

  const steps = [
    { id: 1, name: 'Upload Video' },
    { id: 2, name: 'Loop Selection' },
    { id: 3, name: 'Frame Extraction' },
    { id: 4, name: 'Background Removal' },
    { id: 5, name: 'Auto-Crop & Sizing' },
    { id: 6, name: 'Halo Remover' },
    { id: 7, name: 'Export' },
  ] as const;

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
    <div className="p-6 h-full flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Sprite Smithy</h1>
        <p className="text-sm text-muted-foreground mt-1">
          AI Video to Sprite Sheet Converter
        </p>
      </div>

      {/* Workflow Steps */}
      <nav className="space-y-1 flex-1">
        {steps.map((step) => {
          const accessible = isStepAccessible(step.id);
          const complete = isStepComplete(step.id);

          return (
            <button
              key={step.id}
              onClick={() => accessible && setCurrentStep(step.id)}
              disabled={!accessible}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                currentStep === step.id
                  ? 'bg-primary text-primary-foreground'
                  : accessible
                  ? 'hover:bg-accent text-foreground'
                  : 'text-muted-foreground/50 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                    currentStep === step.id
                      ? 'bg-primary-foreground text-primary'
                      : complete
                      ? 'bg-green-500 text-white'
                      : accessible
                      ? 'bg-muted text-muted-foreground'
                      : 'bg-muted/50 text-muted-foreground/50'
                  }`}
                >
                  {complete && currentStep !== step.id ? '✓' : step.id}
                </div>
                <span className="text-sm font-medium">{step.name}</span>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Progress indicator */}
      <div className="pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">
          Step {currentStep} of 7
        </p>
      </div>
    </div>
  );
}
