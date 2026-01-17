'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import { useStore } from '@/store';
import UserMenu from '@/components/auth/UserMenu';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const session = useStore((state) => state.session);
  const isAuthenticated = !!session;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition">
            <div className="w-10 h-10 flex items-center justify-center">
              <Image
                src="/assets/sprite-smithy-logo.webp"
                alt="Sprite Smithy Logo"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            <span className="text-xl font-bold">Sprite Smithy</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="#features"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition"
            >
              How It Works
            </Link>
          </nav>

          {/* CTA Buttons / User Menu */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 text-sm"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 text-sm"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Buttons */}
          <div className="md:hidden flex items-center -space-x-1">
            <div className="relative">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="flex items-center px-3 py-2 rounded-lg hover:bg-muted/50 transition"
                aria-label="Toggle menu"
              >
                <HelpCircle className="w-8 h-8" />
              </button>
              {isMobileMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsMobileMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-background border border-border rounded-lg shadow-lg z-20 overflow-hidden">
                    <div className="py-1">
                      <Link
                        href="#features"
                        className="block px-4 py-2 text-sm hover:bg-muted/50 transition"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Features
                      </Link>
                      <Link
                        href="#how-it-works"
                        className="block px-4 py-2 text-sm hover:bg-muted/50 transition"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        How It Works
                      </Link>
                    </div>
                    {!isAuthenticated && (
                      <div className="border-t border-border py-1">
                        <Link
                          href="/login"
                          className="block px-4 py-2 text-sm hover:bg-muted/50 transition"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Login
                        </Link>
                        <Link
                          href="/signup"
                          className="block px-4 py-2 text-sm hover:bg-muted/50 transition"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Get Started
                        </Link>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
            {isAuthenticated && <UserMenu />}
          </div>
        </div>
      </div>
    </header>
  );
}
