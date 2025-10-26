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
  const milestoneProgress = stats.totalMilestones > 0 
    ? Math.round((stats.completedMilestones / stats.totalMilestones) * 100)
    : 0;
  
  const taskProgress = stats.totalTasks > 0
    ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
    : 0;

  return (
    <Card className="border-2 border-gray-200 shadow-sm">
      <CardHeader className="bg-[#223344] text-white">
        <CardTitle className="text-lg font-semibold">Your Stats</CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-5">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#28A745]/10 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-[#28A745]" />
              </div>
              <p className="text-sm font-medium text-gray-600">Milestones</p>
            </div>
            <p className="text-lg font-bold text-[#223344]">
              {stats.completedMilestones} / {stats.totalMilestones}
            </p>
          </div>
          <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-[#28A745] h-full transition-all duration-300"
              style={{ width: `${milestoneProgress}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#007BFF]/10 rounded-full flex items-center justify-center">
                <ListTodo className="w-4 h-4 text-[#007BFF]" />
              </div>
              <p className="text-sm font-medium text-gray-600">Tasks</p>
            </div>
            <p className="text-lg font-bold text-[#223344]">
              {stats.completedTasks} / {stats.totalTasks}
            </p>
          </div>
          <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-[#007BFF] h-full transition-all duration-300"
              style={{ width: `${taskProgress}%` }}
            />
          </div>
        </div>

        <div className="pt-3 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#FFC107]/10 rounded-full flex items-center justify-center">
                <Calendar className="w-4 h-4 text-[#FFC107]" />
              </div>
              <p className="text-sm font-medium text-gray-600">Est. Time Left</p>
            </div>
            <p className="text-2xl font-bold text-[#223344]">{stats.estimatedWeeksRemaining} <span className="text-sm font-normal text-gray-600">weeks</span></p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
