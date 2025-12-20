'use client';

import { useStore } from '@/store';
import Step1Upload from '@/components/steps/Step1Upload';
import Step2LoopSelection from '@/components/steps/Step2LoopSelection';
import Step3FrameExtraction from '@/components/steps/Step3FrameExtraction';
import Step4BackgroundRemoval from '@/components/steps/Step4BackgroundRemoval';
import Step5AutoCrop from '@/components/steps/Step5AutoCrop';
import Step6HaloRemover from '@/components/steps/Step6HaloRemover';
import Step7Export from '@/components/steps/Step7Export';

export default function CenterPanel() {
  const currentStep = useStore((state) => state.currentStep);

  return (
    <div className="flex-1 flex flex-col overflow-y-auto p-8 bg-muted/20">
      <div className="w-full max-w-4xl mx-auto">
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
