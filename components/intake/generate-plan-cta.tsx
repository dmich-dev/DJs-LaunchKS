'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

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
    <div className="border-t border-[#FFC107]/30 bg-gradient-to-r from-[#FFF9E6] to-[#FFFBF0] p-6 animate-in slide-in-from-bottom duration-500">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white border-2 border-[#FFC107] rounded-2xl p-6 shadow-lg">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#FFC107] to-[#FFD54F] rounded-2xl shadow-md mb-2">
              <Sparkles className="w-8 h-8 text-[#223344]" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#223344] mb-2">
                Ready to Create Your Plan! ✈️
              </h3>
              <p className="text-sm text-gray-600 max-w-lg mx-auto">
                I have enough information to create your personalized career transition plan. Let&apos;s build your roadmap to success!
              </p>
            </div>
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              size="lg"
              className="w-full max-w-md bg-gradient-to-r from-[#FFC107] to-[#FFD54F] hover:from-[#FFD54F] hover:to-[#FFC107] text-[#223344] font-semibold text-base h-14 rounded-xl shadow-md hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              <Sparkles className={cn(
                "w-5 h-5 mr-2",
                isGenerating && "animate-spin"
              )} />
              {isGenerating ? 'Creating Your Plan...' : 'Generate My Career Plan'}
            </Button>
            <p className="text-xs text-gray-500">
              This will take 30-60 seconds to analyze your information
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
