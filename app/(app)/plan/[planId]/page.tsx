import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { plan } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import {
  getPlanWithDetails,
  calculateOverallProgress,
} from '@/lib/utils/plan-helpers';
import { PlanOverview } from '@/components/plan/plan-overview';
import { PhaseCard } from '@/components/plan/phase-card';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface PlanPageProps {
  params: Promise<{
    planId: string;
  }>;
}

export default async function PlanPage({ params }: PlanPageProps) {
  const resolvedParams = await params;
  const planId = resolvedParams.planId;

  // Get authenticated user
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect('/login');
  }

  // Verify plan belongs to user
  const plans = await db
    .select()
    .from(plan)
    .where(and(eq(plan.id, planId), eq(plan.userId, session.user.id)))
    .limit(1);

  if (plans.length === 0) {
    redirect('/dashboard');
  }

  const planData = plans[0];

  // Get full plan with details
  const planWithDetails = await getPlanWithDetails(planId);

  if (!planWithDetails) {
    redirect('/dashboard');
  }

  const progress = calculateOverallProgress(planWithDetails);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background sticky top-0 z-10">
        <div className="container mx-auto flex h-16 items-center px-4 gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Dashboard
            </Button>
          </Link>
          <h1 className="text-xl font-semibold">Career Plan</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Plan Overview */}
        <PlanOverview plan={planData} progress={progress} />

        {/* Phases */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-primary">
              Your Journey ({planWithDetails.phases.length} Phases)
            </h2>
          </div>

          {planWithDetails.phases.length > 0 ? (
            planWithDetails.phases.map((phase, index) => (
              <PhaseCard
                key={phase.id}
                phase={phase}
                planId={planId}
                index={index}
              />
            ))
          ) : (
            <div className="bg-muted/50 border border-dashed rounded-lg p-12 text-center">
              <p className="text-muted-foreground">
                No phases have been generated for this plan yet.
              </p>
            </div>
          )}
        </div>

        {/* Back to Dashboard Button */}
        <div className="flex justify-center pt-8">
          <Link href="/dashboard">
            <Button variant="outline" size="lg">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
