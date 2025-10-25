'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, Sparkles } from 'lucide-react';

const LOADING_MESSAGES = [
  'Analyzing your career goals...',
  'Researching Kansas programs...',
  'Finding training opportunities...',
  'Analyzing job market data...',
  'Creating your personalized plan...',
  'Adding Kansas-specific resources...',
];

function GeneratingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [messageIndex, setMessageIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Rotate through loading messages
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const conversationId = searchParams.get('conversationId');

    if (!conversationId) {
      setError('No conversation ID provided. Please start a conversation first.');
      return;
    }

    // Start plan generation
    const generatePlan = async () => {
      try {
        const response = await fetch('/api/plan/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ conversationId }),
        });

        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to generate plan');
        }

        const { planId, isDemo } = data;

        // Redirect to plan view (or demo if generation failed)
        if (isDemo || planId === 'demo') {
          router.push('/plan/demo');
        } else {
          router.push(`/plan/${planId}`);
        }
      } catch (err) {
        console.error('Plan generation error:', err);
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      }
    };

    generatePlan();
  }, [router, searchParams]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="max-w-md w-full bg-card border border-destructive rounded-lg p-6 text-center">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <h1 className="text-2xl font-bold text-primary mb-2">Generation Failed</h1>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <div className="max-w-md w-full text-center">
        {/* Animated Icon */}
        <div className="relative w-32 h-32 mx-auto mb-8">
          <div className="absolute inset-0 bg-accent/20 rounded-full animate-ping" />
          <div className="relative w-32 h-32 bg-accent rounded-full flex items-center justify-center">
            <Sparkles className="w-16 h-16 text-accent-foreground animate-pulse" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-primary mb-4">
          Creating Your Career Plan
        </h1>

        {/* Loading Message */}
        <div className="min-h-[60px] flex items-center justify-center mb-6">
          <p className="text-lg text-muted-foreground animate-fade-in">
            {LOADING_MESSAGES[messageIndex]}
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-accent" />
          <span className="text-sm text-muted-foreground">
            This may take a minute...
          </span>
        </div>

        {/* Info */}
        <div className="mt-8 p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            We're using AI to research Kansas-specific training programs, job opportunities,
            and create a personalized roadmap for your career transition.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function GeneratingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted p-4">
          <div className="max-w-md w-full text-center">
            <div className="relative w-32 h-32 mx-auto mb-8">
              <div className="relative w-32 h-32 bg-accent rounded-full flex items-center justify-center">
                <Sparkles className="w-16 h-16 text-accent-foreground animate-pulse" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-primary mb-4">
              Creating Your Career Plan
            </h1>
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-accent" />
              <span className="text-sm text-muted-foreground">
                Loading...
              </span>
            </div>
          </div>
        </div>
      }
    >
      <GeneratingContent />
    </Suspense>
  );
}
