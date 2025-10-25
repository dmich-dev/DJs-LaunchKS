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

    // Redirect immediately to generating page with conversationId
    router.push(`/plan/generating?conversationId=${conversationId}`);
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
