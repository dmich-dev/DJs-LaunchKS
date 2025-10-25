'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface GeneratePlanCTAProps {
  conversationId: string;
}

export function GeneratePlanCTA({ conversationId }: GeneratePlanCTAProps) {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);

    // Redirect immediately to generating page
    router.push('/plan/generating');

    // Start generation in background
    try {
      const response = await fetch('/api/plan/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId }),
      });

      if (!response.ok) {
        throw new Error('Failed to start plan generation');
      }

      const { planId } = await response.json();

      // Redirect to plan view
      router.push(`/plan/${planId}`);
    } catch (error) {
      console.error('Plan generation error:', error);
      // User is already on generating page, error will be handled there
    }
  };

  return (
    <div className="border-t bg-accent/10 p-4">
      <div className="max-w-2xl mx-auto text-center space-y-3">
        <p className="text-sm text-muted-foreground">
          I have enough information to create your personalized career plan!
        </p>
        <Button
          onClick={handleGenerate}
          disabled={isGenerating}
          size="lg"
          className="w-full max-w-md"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          {isGenerating ? 'Starting...' : 'Generate My Plan'}
        </Button>
      </div>
    </div>
  );
}
