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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-[#223344] to-[#334455] text-white p-8 rounded-xl shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-4xl font-bold">Welcome back, {profile.firstName}!</h1>
                <Plane className="w-8 h-8 text-[#FFC107]" />
              </div>
              <p className="text-xl text-gray-200">
                You're on your way to becoming a <span className="font-semibold text-[#FFC107]">{activePlan.targetCareer}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ProgressCard progress={progress} />
          <NextUpCard milestone={nextMilestone} planId={activePlan.id} />
          <StatsCard stats={stats} />
        </div>

        {/* Upcoming Milestones */}
        {upcomingMilestones.length > 0 && (
          <div className="bg-white border-2 border-gray-200 rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#223344]">Upcoming Milestones</h2>
              <span className="text-sm text-gray-500">{upcomingMilestones.length} upcoming</span>
            </div>
            <div className="space-y-4">
              {upcomingMilestones.map((milestone: any, index: number) => (
                <div
                  key={milestone.id}
                  className="flex items-start gap-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-[#007BFF] text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="inline-block px-2 py-0.5 bg-[#007BFF]/10 text-[#007BFF] text-xs font-semibold rounded">
                        {milestone.phase}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg text-[#223344] mb-1">{milestone.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {milestone.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
