import { FileText, TrendingUp, CheckCircle } from 'lucide-react';

interface PlanStatsProps {
  total: number;
  active: number;
  recentCount: number;
}

export function PlanStats({ total, active, recentCount }: PlanStatsProps) {
  const activePercentage = total > 0 ? Math.round((active / total) * 100) : 0;
  const completed = total - active;

  return (
    <div className="bg-card border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <FileText className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-primary">Plan Statistics</h3>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Active Plans</span>
          <span className="text-2xl font-bold text-primary">{activePercentage}%</span>
        </div>

        <div className="space-y-3">
          {/* Total Plans */}
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">Total Plans</span>
            </div>
            <span className="font-semibold">{total}</span>
          </div>

          {/* Active */}
          <div className="flex items-center justify-between p-3 bg-accent/10 rounded-lg">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-accent" />
              <span className="text-sm">Active</span>
            </div>
            <span className="font-semibold text-accent">{active}</span>
          </div>

          {/* Completed */}
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm">Completed</span>
            </div>
            <span className="font-semibold text-green-600">{completed}</span>
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Created this week</span>
            <span className="font-semibold text-accent">+{recentCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
