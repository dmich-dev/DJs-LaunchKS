import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

export function NoPlanState() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="max-w-md text-center space-y-6">
        <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto">
          <Sparkles className="w-10 h-10 text-accent-foreground" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">
            Ready to Launch Your Career?
          </h1>
          <p className="text-muted-foreground">
            Start a conversation with our AI career coach to create your personalized career plan.
          </p>
        </div>
        <Link href="/intake">
          <Button size="lg" className="w-full max-w-xs">
            <Sparkles className="w-5 h-5 mr-2" />
            Start Career Planning
          </Button>
        </Link>
      </div>
    </div>
  );
}
