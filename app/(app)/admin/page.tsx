import { db } from '@/lib/db';
import { user, plan, userProfile, email, conversation } from '@/lib/db/schema';
import { eq, desc, count, and, gte } from 'drizzle-orm';
import { StatsOverview } from '@/components/admin/stats-overview';
import { RecentActivity } from '@/components/admin/recent-activity';
import { EmailStats } from '@/components/admin/email-stats';
import { PlanStats } from '@/components/admin/plan-stats';

export default async function AdminPage() {
  // Get total counts
  const [
    totalUsers,
    totalPlans,
    totalActiveUsers,
    totalConversations,
  ] = await Promise.all([
    db.select({ count: count() }).from(user),
    db.select({ count: count() }).from(plan),
    db.select({ count: count() }).from(userProfile),
    db.select({ count: count() }).from(conversation),
  ]);

  // Get plans created in the last 7 days
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const recentPlans = await db
    .select({ count: count() })
    .from(plan)
    .where(gte(plan.generatedAt, sevenDaysAgo));

  // Get email stats for last 7 days
  const emailStats = await db
    .select({
      status: email.status,
      count: count(),
    })
    .from(email)
    .where(gte(email.createdAt, sevenDaysAgo))
    .groupBy(email.status);

  const emailSent = emailStats.find((s) => s.status === 'sent')?.count || 0;
  const emailFailed = emailStats.find((s) => s.status === 'failed')?.count || 0;
  const emailQueued = emailStats.find((s) => s.status === 'queued')?.count || 0;

  // Get active plans
  const activePlans = await db
    .select({ count: count() })
    .from(plan)
    .where(eq(plan.status, 'active'));

  // Get recent users (last 10)
  const recentUsersRaw = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      hasProfile: userProfile.id,
      hasPlan: plan.id,
    })
    .from(user)
    .leftJoin(userProfile, eq(userProfile.userId, user.id))
    .leftJoin(plan, and(eq(plan.userId, user.id), eq(plan.status, 'active')))
    .orderBy(desc(user.createdAt))
    .limit(50);

  // Deduplicate users (in case of multiple active plans)
  const seenUserIds = new Set<string>();
  const recentUsers = recentUsersRaw
    .filter((u) => {
      if (seenUserIds.has(u.id)) return false;
      seenUserIds.add(u.id);
      return true;
    })
    .slice(0, 10);

  // Get recent plans (last 10)
  const recentPlansList = await db
    .select({
      id: plan.id,
      targetCareer: plan.targetCareer,
      generatedAt: plan.generatedAt,
      status: plan.status,
      userName: user.name,
      userEmail: user.email,
    })
    .from(plan)
    .innerJoin(user, eq(user.id, plan.userId))
    .orderBy(desc(plan.generatedAt))
    .limit(10);

  const stats = {
    totalUsers: totalUsers[0].count,
    totalPlans: totalPlans[0].count,
    activePlans: activePlans[0].count,
    totalConversations: totalConversations[0].count,
    recentPlansCount: recentPlans[0].count,
    emailSent,
    emailFailed,
    emailQueued,
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-bold text-primary mb-2">Dashboard Overview</h2>
        <p className="text-muted-foreground">
          Monitor system performance and user activity
        </p>
      </div>

      {/* Stats Overview */}
      <StatsOverview stats={stats} />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EmailStats
          sent={emailSent}
          failed={emailFailed}
          queued={emailQueued}
        />
        <PlanStats
          total={stats.totalPlans}
          active={stats.activePlans}
          recentCount={stats.recentPlansCount}
        />
      </div>

      {/* Recent Activity */}
      <RecentActivity
        recentUsers={recentUsers}
        recentPlans={recentPlansList}
      />
    </div>
  );
}
