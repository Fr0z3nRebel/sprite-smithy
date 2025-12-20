'use client';

import { useStore } from '@/store';
import Step1Upload from '@/components/steps/Step1Upload';
import Step2LoopSelection from '@/components/steps/Step2LoopSelection';
import Step3FrameExtraction from '@/components/steps/Step3FrameExtraction';
import Step4BackgroundRemoval from '@/components/steps/Step4BackgroundRemoval';
import Step5AutoCrop from '@/components/steps/Step5AutoCrop';
import Step6HaloRemover from '@/components/steps/Step6HaloRemover';
import Step7Export from '@/components/steps/Step7Export';

export default function LeftPanel() {
  const currentStep = useStore((state) => state.currentStep);
  const setCurrentStep = useStore((state) => state.setCurrentStep);

  const steps = [
    { id: 1, name: 'Upload Video' },
    { id: 2, name: 'Loop Selection' },
    { id: 3, name: 'Frame Extraction' },
    { id: 4, name: 'Background Removal' },
    { id: 5, name: 'Auto-Crop & Sizing' },
    { id: 6, name: 'Halo Remover' },
    { id: 7, name: 'Export' },
  ] as const;

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Sprite Smithy</h1>
        <p className="text-sm text-muted-foreground mt-1">
          AI Video to Sprite Sheet Converter
        </p>
      </div>

      {/* Workflow Steps */}
      <nav className="space-y-1">
        {steps.map((step) => (
          <button
            key={step.id}
            onClick={() => setCurrentStep(step.id)}
            className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
              currentStep === step.id
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-accent text-foreground'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                  currentStep === step.id
                    ? 'bg-primary-foreground text-primary'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {step.id}
              </div>
              <span className="text-sm font-medium">{step.name}</span>
            </div>
          </button>
        ))}
      </nav>

      {/* Step Content */}
      <div className="mt-8">
        {currentStep === 1 && <Step1Upload />}
        {currentStep === 2 && <Step2LoopSelection />}
        {currentStep === 3 && <Step3FrameExtraction />}
        {currentStep === 4 && <Step4BackgroundRemoval />}
        {currentStep === 5 && <Step5AutoCrop />}
        {currentStep === 6 && <Step6HaloRemover />}
        {currentStep === 7 && <Step7Export />}
      </div>
    </div>
  );
}
