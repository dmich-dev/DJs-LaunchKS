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
import { TimelineView } from '@/components/plan/timeline-view';
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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Plan Overview */}
        <PlanOverview plan={planData} progress={progress} />

        {/* Timeline Visualization */}
        {planWithDetails.phases.length > 0 && (
          <TimelineView
            phases={planWithDetails.phases.map((phase: any) => ({
              id: phase.id,
              title: phase.title,
              estimatedDuration: phase.estimatedDuration,
              status: phase.milestones?.every((m: any) => m.isCompleted)
                ? 'completed'
                : phase.milestones?.some((m: any) => m.isCompleted)
                ? 'in_progress'
                : 'not_started',
              orderIndex: phase.orderIndex,
            }))}
          />
        )}

        {/* Phases */}
        <div className="space-y-8">
          <div className="flex items-center justify-between bg-white p-6 rounded-xl border-2 border-gray-200 shadow-sm">
            <div>
              <h2 className="text-3xl font-bold text-[#223344]">
                Your Journey
              </h2>
              <p className="text-gray-600 mt-1">
                {planWithDetails.phases.length} {planWithDetails.phases.length === 1 ? 'Phase' : 'Phases'} to complete
              </p>
            </div>
            <div className="bg-[#FFC107] text-[#223344] px-6 py-3 rounded-full font-bold text-lg shadow-md">
              {progress.overall}% Complete
            </div>
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
            <div className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-16 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl text-gray-400">📋</span>
              </div>
              <p className="text-gray-500 text-lg font-medium">
                No phases have been generated for this plan yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
