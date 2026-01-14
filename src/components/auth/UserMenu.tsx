'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUser } from '@/hooks/useUser';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function UserMenu() {
  const { user, signOut } = useAuth();
  const { profile } = useUser();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted/50 transition"
      >
        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
          {profile?.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
        </div>
        <div className="text-left hidden md:block">
          <p className="text-sm font-medium">{profile?.full_name || 'User'}</p>
        </div>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-56 bg-background border border-border rounded-lg shadow-lg z-20 overflow-hidden">
            <div className="p-3 border-b border-border">
              <p className="text-sm font-medium">{profile?.full_name || 'User'}</p>
            </div>
            <div className="py-1">
              <Link
                href="/app/settings/account"
                className="block px-4 py-2 text-sm hover:bg-muted/50 transition"
                onClick={() => setIsOpen(false)}
              >
                Account Settings
              </Link>
              <Link
                href="/app/settings/billing"
                className="block px-4 py-2 text-sm hover:bg-muted/50 transition"
                onClick={() => setIsOpen(false)}
              >
                Billing
              </Link>
            </div>
            <div className="border-t border-border py-1">
              <button
                onClick={handleSignOut}
                className="w-full text-left px-4 py-2 text-sm text-destructive hover:bg-muted/50 transition"
              >
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
