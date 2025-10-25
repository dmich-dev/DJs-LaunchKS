import { Briefcase, TrendingUp, DollarSign, Calendar } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { type Plan } from '@/types/db';

interface PlanOverviewProps {
  plan: Plan;
  progress: {
    overall: number;
    completedTasks: number;
    totalTasks: number;
    completedMilestones: number;
    totalMilestones: number;
    daysActive: number;
    currentPhase: string;
  };
}

export function PlanOverview({ plan, progress }: PlanOverviewProps) {
  return (
    <Card className="border-2 border-accent">
      <CardHeader className="bg-primary text-primary-foreground">
        <CardTitle className="text-2xl">Career Transition Plan</CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {/* Career Transition Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mt-1">
              <Briefcase className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Target Career</p>
              <p className="font-semibold text-lg">{plan.targetCareer}</p>
            </div>
          </div>

          {plan.currentCareer && (
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center mt-1">
                <Briefcase className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Current Career
                </p>
                <p className="font-semibold text-lg">{plan.currentCareer}</p>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center mt-1">
              <Calendar className="w-5 h-5 text-accent-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Estimated Duration
              </p>
              <p className="font-semibold text-lg">{plan.estimatedDuration}</p>
            </div>
          </div>

          {(plan.salaryExpectationsEntry || plan.salaryExpectationsExperienced) && (
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center mt-1">
                <DollarSign className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Salary Expectations
                </p>
                {plan.salaryExpectationsEntry && (
                  <p className="font-semibold">
                    Entry: {plan.salaryExpectationsEntry}
                  </p>
                )}
                {plan.salaryExpectationsExperienced && (
                  <p className="font-semibold">
                    Experienced: {plan.salaryExpectationsExperienced}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Job Market Outlook */}
        {plan.jobMarketOutlook && (
          <div className="bg-muted/50 border-l-4 border-accent p-4 rounded-r">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-accent-foreground" />
              <h3 className="font-semibold text-primary">Job Market Outlook</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              {plan.jobMarketOutlook}
            </p>
          </div>
        )}

        {/* Overall Progress */}
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-lg text-primary">
              Overall Progress
            </h3>
            <span className="text-3xl font-bold text-primary">
              {progress.overall}%
            </span>
          </div>
          <div className="bg-muted rounded-full h-4 overflow-hidden mb-4">
            <div
              className="bg-gradient-to-r from-accent to-primary h-full transition-all duration-500"
              style={{ width: `${progress.overall}%` }}
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Days Active</p>
              <p className="font-bold text-lg">{progress.daysActive}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Current Phase</p>
              <p className="font-bold text-lg">{progress.currentPhase}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Milestones</p>
              <p className="font-bold text-lg">
                {progress.completedMilestones}/{progress.totalMilestones}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Tasks</p>
              <p className="font-bold text-lg">
                {progress.completedTasks}/{progress.totalTasks}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
