'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full bg-card border border-destructive rounded-lg p-8 text-center">
        <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-10 h-10 text-destructive" />
        </div>

        <h1 className="text-3xl font-bold text-primary mb-3">Something went wrong</h1>

        <p className="text-muted-foreground mb-2">
          We encountered an unexpected error. This has been logged and we'll look into it.
        </p>

        {process.env.NODE_ENV === 'development' && error.message && (
          <div className="mt-4 p-3 bg-muted rounded-md text-left">
            <p className="text-xs font-mono text-destructive break-all">
              {error.message}
            </p>
          </div>
        )}

        <div className="flex gap-3 mt-6">
          <Button
            onClick={reset}
            variant="default"
            className="flex-1"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          <Link href="/dashboard" className="flex-1">
            <Button variant="outline" className="w-full">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
