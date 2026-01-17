'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function BillingPage() {
  const router = useRouter();

  useEffect(() => {
    // Temporarily disabled - redirect to tool
    router.push('/app/tool');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header with back button */}
        <div className="mb-8">
          <Link
            href="/app/tool"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Tool</span>
          </Link>
          <h1 className="text-4xl font-bold mb-2">Billing & Subscription</h1>
          <p className="text-muted-foreground">
            This page is temporarily disabled. All features are currently free.
          </p>
        </div>
      </div>
    </div>
  );
}
