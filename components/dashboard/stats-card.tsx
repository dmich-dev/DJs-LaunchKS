import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CheckCircle, ListTodo, Calendar } from 'lucide-react';

interface StatsCardProps {
  stats: {
    completedMilestones: number;
    totalMilestones: number;
    completedTasks: number;
    totalTasks: number;
    estimatedWeeksRemaining: number;
  };
}

export function StatsCard({ stats }: StatsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Stats</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-success" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">Milestones</p>
            <p className="text-xl font-bold">
              {stats.completedMilestones} / {stats.totalMilestones}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
            <ListTodo className="w-5 h-5 text-secondary" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">Tasks Complete</p>
            <p className="text-xl font-bold">
              {stats.completedTasks} / {stats.totalTasks}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
            <Calendar className="w-5 h-5 text-accent-foreground" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">Est. Time Left</p>
            <p className="text-xl font-bold">{stats.estimatedWeeksRemaining} weeks</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
