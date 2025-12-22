'use client';

import { useRouter } from 'next/navigation';
import { useOnboarding } from '@/hooks/useOnboarding';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/ui/Button';
import { useEffect } from 'react';

export default function OnboardingPage() {
  const router = useRouter();
  const { isLoading } = useAuth();
  const { hasCompletedOnboarding, completeOnboarding } = useOnboarding();

  // Redirect if already completed onboarding
  useEffect(() => {
    if (!isLoading && hasCompletedOnboarding) {
      router.push('/app/tool');
    }
  }, [isLoading, hasCompletedOnboarding, router]);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/20">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const handleComplete = async () => {
    await completeOnboarding();
    router.push('/app/tool');
  };

  const handleSkip = async () => {
    await completeOnboarding();
    router.push('/app/tool');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20">
      <div className="max-w-3xl w-full p-8 mx-4">
        <div className="bg-background border border-border rounded-lg p-8 space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">Welcome to Sprite Smithy!</h1>
            <p className="text-xl text-muted-foreground">
              Let's get you started with transforming your AI videos into perfect sprite sheets
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">How It Works - 7 Simple Steps:</h2>

            <div className="grid gap-4">
              <div className="flex gap-4 p-4 bg-muted/20 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold">Upload Video</h3>
                  <p className="text-sm text-muted-foreground">
                    Upload your AI-generated character video (MP4, WebM, or MOV)
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-4 bg-muted/20 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold">Loop Selection</h3>
                  <p className="text-sm text-muted-foreground">
                    Define the perfect loop range for your animation cycle
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-4 bg-muted/20 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold">Frame Extraction</h3>
                  <p className="text-sm text-muted-foreground">
                    Extract individual frames from your video
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-4 bg-muted/20 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                  4
                </div>
                <div>
                  <h3 className="font-semibold">Background Removal</h3>
                  <p className="text-sm text-muted-foreground">
                    Use chroma key to remove backgrounds with precision controls
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-4 bg-muted/20 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                  5
                </div>
                <div>
                  <h3 className="font-semibold">Auto-Crop & Sizing</h3>
                  <p className="text-sm text-muted-foreground">
                    Automatically crop and normalize sprite sizes for consistency
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-4 bg-muted/20 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                  6
                </div>
                <div>
                  <h3 className="font-semibold">Halo Removal</h3>
                  <p className="text-sm text-muted-foreground">
                    Clean up edge artifacts for professional-looking sprites
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-4 bg-muted/20 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                  7
                </div>
                <div>
                  <h3 className="font-semibold">Export</h3>
                  <p className="text-sm text-muted-foreground">
                    Download your sprite sheet, individual frames, and metadata
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-6 space-y-4">
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
              <p className="text-sm">
                <strong>💡 Pro Tip:</strong> All processing happens in your browser - your videos never leave your computer!
              </p>
            </div>
          </div>

          <div className="flex gap-4 justify-center pt-4">
            <Button
              variant="outline"
              onClick={handleSkip}
            >
              Skip Tutorial
            </Button>
            <Button
              onClick={handleComplete}
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
