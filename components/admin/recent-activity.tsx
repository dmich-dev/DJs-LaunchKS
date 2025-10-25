import { formatTimeAgo } from '@/lib/utils';
import { User, FileText, CheckCircle2, XCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface RecentActivityProps {
  recentUsers: Array<{
    id: string;
    name: string;
    email: string;
    createdAt: Date;
    hasProfile: string | null;
    hasPlan: string | null;
  }>;
  recentPlans: Array<{
    id: string;
    targetCareer: string;
    generatedAt: Date;
    status: string;
    userName: string;
    userEmail: string;
  }>;
}

export function RecentActivity({ recentUsers, recentPlans }: RecentActivityProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Recent Users */}
      <div className="bg-card border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-primary">Recent Users</h3>
          </div>
          <Link href="/admin/users">
            <Button variant="ghost" size="sm">View All</Button>
          </Link>
        </div>

        <div className="space-y-3">
          {recentUsers.length > 0 ? (
            recentUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {user.hasProfile && (
                      <span className="text-xs text-green-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Profile
                      </span>
                    )}
                    {user.hasPlan && (
                      <span className="text-xs text-accent flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Plan
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatTimeAgo(user.createdAt)}
                </span>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              No recent users
            </p>
          )}
        </div>
      </div>

      {/* Recent Plans */}
      <div className="bg-card border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-primary">Recent Plans</h3>
          </div>
          <Link href="/admin/plans">
            <Button variant="ghost" size="sm">View All</Button>
          </Link>
        </div>

        <div className="space-y-3">
          {recentPlans.length > 0 ? (
            recentPlans.map((plan) => (
              <div
                key={plan.id}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{plan.targetCareer}</p>
                  <p className="text-xs text-muted-foreground truncate">{plan.userName}</p>
                  <div className="mt-1">
                    {plan.status === 'active' ? (
                      <span className="text-xs text-accent flex items-center gap-1">
                        <div className="w-2 h-2 bg-accent rounded-full" />
                        Active
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Completed
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatTimeAgo(plan.generatedAt)}
                </span>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              No recent plans
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
