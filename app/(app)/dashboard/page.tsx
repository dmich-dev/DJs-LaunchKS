import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { userProfile } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import {
  getActivePlan,
  getPlanWithDetails,
  calculateOverallProgress,
  getNextMilestone,
  calculateQuickStats,
  getUpcomingMilestones,
  getFeaturedResources,
} from '@/lib/utils/plan-helpers';
import { ProgressCard } from '@/components/dashboard/progress-card';
import { NextUpCard } from '@/components/dashboard/next-up-card';
import { StatsCard } from '@/components/dashboard/stats-card';
import { NoPlanState } from '@/components/dashboard/no-plan-state';
import { Plane } from 'lucide-react';

export default async function DashboardPage() {
  // Get authenticated user
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect('/login');
  }

  // Get user profile
  const profiles = await db
    .select()
    .from(userProfile)
    .where(eq(userProfile.userId, session.user.id))
    .limit(1);

  if (profiles.length === 0) {
    redirect('/onboarding');
  }

  const profile = profiles[0];

  // Get active plan
  const activePlan = await getActivePlan(session.user.id);

  if (!activePlan) {
    return (
      <div className="container mx-auto px-4 py-8">
        <NoPlanState />
      </div>
    );
  }

  // Get full plan with details
  const planWithDetails = await getPlanWithDetails(activePlan.id);

  if (!planWithDetails) {
    return (
      <div className="container mx-auto px-4 py-8">
        <NoPlanState />
      </div>
    );
  }

  const progress = calculateOverallProgress(planWithDetails);
  const nextMilestone = getNextMilestone(planWithDetails);
  const stats = calculateQuickStats(planWithDetails);
  const upcomingMilestones = getUpcomingMilestones(planWithDetails, 3);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-8 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-4xl font-bold">Welcome back, {profile.firstName}!</h1>
            <Plane className="w-8 h-8" />
          </div>
          <p className="text-lg opacity-90">
            You're on your way to becoming a {activePlan.targetCareer}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ProgressCard progress={progress} />
          <NextUpCard milestone={nextMilestone} planId={activePlan.id} />
          <StatsCard stats={stats} />
        </div>

        {/* Upcoming Milestones */}
        {upcomingMilestones.length > 0 && (
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-2xl font-bold text-primary mb-4">Upcoming Milestones</h2>
            <div className="space-y-4">
              {upcomingMilestones.map((milestone: any) => (
                <div
                  key={milestone.id}
                  className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg"
                >
                  <div className="w-2 h-2 bg-accent rounded-full mt-2" />
                  <div className="flex-1">
                    <div className="text-xs text-muted-foreground mb-1">{milestone.phase}</div>
                    <h3 className="font-semibold text-lg">{milestone.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {milestone.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
    </div>
  );
}
