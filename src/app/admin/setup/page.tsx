'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';

export default function AdminSetupPage() {
  const router = useRouter();
  const supabase = createClient();
  const [isAlreadyCompleted, setIsAlreadyCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    secret: '',
  });

  useEffect(() => {
    // Check if setup is already completed
    const checkSetupStatus = async () => {
      const { data } = await supabase
        .from('admin_setup')
        .select('is_completed')
        .single();

      if (data?.is_completed) {
        setIsAlreadyCompleted(true);
      }
      setIsLoading(false);
    };

    checkSetupStatus();
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/admin/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create admin account');
      }

      setSuccess(true);

      // Auto-login after 2 seconds
      setTimeout(async () => {
        await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        router.push('/app/tool');
        router.refresh();
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (isAlreadyCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/20">
        <div className="max-w-md w-full p-8 bg-background border border-border rounded-lg text-center space-y-4">
          <h1 className="text-2xl font-bold text-destructive">Setup Already Completed</h1>
          <p className="text-muted-foreground">
            The admin account has already been created. This setup page can only be used once.
          </p>
          <Button
            onClick={() => router.push('/')}
            variant="outline"
          >
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/20">
        <div className="max-w-md w-full p-8 bg-background border border-border rounded-lg text-center space-y-4">
          <div className="text-6xl">✅</div>
          <h1 className="text-2xl font-bold">Admin Account Created!</h1>
          <p className="text-muted-foreground">
            Your admin account has been successfully created with Pro tier access.
            Redirecting to the tool...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20">
      <div className="max-w-md w-full p-8 bg-background border border-border rounded-lg">
        <div className="text-center space-y-2 mb-6">
          <h1 className="text-3xl font-bold">Admin Setup</h1>
          <p className="text-muted-foreground">
            Create the first admin account with Pro tier access
          </p>
          <p className="text-xs text-destructive">
            ⚠️ This page can only be used once
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium mb-2">
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              required
              className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
              minLength={6}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label htmlFor="secret" className="block text-sm font-medium mb-2">
              Setup Secret Token
            </label>
            <input
              id="secret"
              type="password"
              value={formData.secret}
              onChange={(e) =>
                setFormData({ ...formData, secret: e.target.value })
              }
              required
              className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter ADMIN_SETUP_SECRET from .env"
            />
            <p className="text-xs text-muted-foreground mt-1">
              This is the ADMIN_SETUP_SECRET value from your .env.local file
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? 'Creating Admin Account...' : 'Create Admin Account'}
          </Button>
        </form>
      </div>
    </div>
  );
}
