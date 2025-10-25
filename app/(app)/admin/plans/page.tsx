import { db } from '@/lib/db';
import { plan, user, phase } from '@/lib/db/schema';
import { eq, desc, count } from 'drizzle-orm';
import { formatDate } from '@/lib/utils';
import { FileText, User as UserIcon, TrendingUp, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default async function AdminPlansPage() {
  // Get all plans with user info and phase count
  const plans = await db
    .select({
      id: plan.id,
      targetCareer: plan.targetCareer,
      currentCareer: plan.currentCareer,
      estimatedDuration: plan.estimatedDuration,
      status: plan.status,
      generatedAt: plan.generatedAt,
      lastActivityAt: plan.lastActivityAt,
      userName: user.name,
      userEmail: user.email,
      userId: user.id,
    })
    .from(plan)
    .innerJoin(user, eq(user.id, plan.userId))
    .orderBy(desc(plan.generatedAt));

  // Get phase counts for each plan
  const phaseCounts = await db
    .select({
      planId: phase.planId,
      count: count(),
    })
    .from(phase)
    .groupBy(phase.planId);

  const phaseCountMap = new Map(phaseCounts.map((pc) => [pc.planId, pc.count]));

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-primary mb-2">Career Plans</h2>
          <p className="text-muted-foreground">
            {plans.length} total plan{plans.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {plans.map((planData) => {
          const phaseCount = phaseCountMap.get(planData.id) || 0;
          const isActive = planData.status === 'active';

          return (
            <div
              key={planData.id}
              className="bg-card border rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{planData.targetCareer}</h3>
                    {planData.currentCareer && (
                      <p className="text-xs text-muted-foreground">
                        From: {planData.currentCareer}
                      </p>
                    )}
                  </div>
                </div>
                {isActive ? (
                  <Badge className="bg-accent text-accent-foreground">Active</Badge>
                ) : (
                  <Badge variant="secondary">Completed</Badge>
                )}
              </div>

              {/* User Info */}
              <div className="flex items-center gap-2 mb-4 p-3 bg-muted/30 rounded-lg">
                <UserIcon className="w-4 h-4 text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{planData.userName}</p>
                  <p className="text-xs text-muted-foreground truncate">{planData.userEmail}</p>
                </div>
              </div>

              {/* Plan Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-medium">{planData.estimatedDuration}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Phases</span>
                  <span className="font-medium">{phaseCount}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Generated</span>
                  <span className="font-medium">{formatDate(planData.generatedAt)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Last Activity</span>
                  <span className="font-medium">{formatDate(planData.lastActivityAt)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t flex gap-2">
                <Link
                  href={`/plan/${planData.id}`}
                  className="flex-1 text-center text-sm px-3 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                  View Plan
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {plans.length === 0 && (
        <div className="bg-card border rounded-lg p-12 text-center">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No plans found</p>
        </div>
      )}
    </div>
  );
}
