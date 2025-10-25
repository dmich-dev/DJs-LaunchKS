'use client';

import { useSession } from '@/lib/auth/client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Protects client components - redirects to login if not authenticated
 */
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.push('/login');
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-zinc-900 dark:border-zinc-800 dark:border-t-zinc-100" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return <>{children}</>;
}

/**
 * Redirects to appropriate page if already authenticated
 * - If no profile: redirect to /onboarding
 * - If has profile: redirect to /dashboard
 */
export function GuestRoute({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && session) {
      // Check if user has completed onboarding
      fetch('/api/profile')
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            router.push('/dashboard');
          } else {
            router.push('/onboarding');
          }
        })
        .catch(() => {
          // If profile fetch fails, assume needs onboarding
          router.push('/onboarding');
        });
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-zinc-900 dark:border-zinc-800 dark:border-t-zinc-100" />
      </div>
    );
  }

  if (session) {
    return null;
  }

  return <>{children}</>;
}
