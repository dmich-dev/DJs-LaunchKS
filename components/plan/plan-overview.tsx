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
    <Card className="border-2 border-gray-200 shadow-md">
      <CardHeader className="bg-[#223344] text-white">
        <CardTitle className="text-2xl font-bold">Career Transition Plan</CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {/* Career Transition Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start gap-4 p-4 bg-[#FFC107]/10 rounded-lg border border-[#FFC107]/20">
            <div className="w-12 h-12 bg-[#FFC107] rounded-full flex items-center justify-center flex-shrink-0">
              <Briefcase className="w-6 h-6 text-[#223344]" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Target Career</p>
              <p className="font-bold text-xl text-[#223344]">{plan.targetCareer}</p>
            </div>
          </div>

          {plan.currentCareer && (
            <div className="flex items-start gap-4 p-4 bg-[#007BFF]/10 rounded-lg border border-[#007BFF]/20">
              <div className="w-12 h-12 bg-[#007BFF] rounded-full flex items-center justify-center flex-shrink-0">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                  Current Career
                </p>
                <p className="font-bold text-xl text-[#223344]">{plan.currentCareer}</p>
              </div>
            </div>
          )}

          <div className="flex items-start gap-4 p-4 bg-gray-100 rounded-lg border border-gray-200">
            <div className="w-12 h-12 bg-[#223344] rounded-full flex items-center justify-center flex-shrink-0">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                Estimated Duration
              </p>
              <p className="font-bold text-xl text-[#223344]">{plan.estimatedDuration}</p>
            </div>
          </div>

          {(plan.salaryExpectationsEntry || plan.salaryExpectationsExperienced) && (
            <div className="flex items-start gap-4 p-4 bg-[#28A745]/10 rounded-lg border border-[#28A745]/20">
              <div className="w-12 h-12 bg-[#28A745] rounded-full flex items-center justify-center flex-shrink-0">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                  Salary Expectations
                </p>
                {plan.salaryExpectationsEntry && (
                  <p className="font-semibold text-[#223344]">
                    Entry: <span className="text-lg font-bold">{plan.salaryExpectationsEntry}</span>
                  </p>
                )}
                {plan.salaryExpectationsExperienced && (
                  <p className="font-semibold text-[#223344]">
                    Experienced: <span className="text-lg font-bold">{plan.salaryExpectationsExperienced}</span>
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Job Market Outlook */}
        {plan.jobMarketOutlook && (
          <div className="bg-gradient-to-r from-[#007BFF]/5 to-[#007BFF]/10 border-l-4 border-[#007BFF] p-5 rounded-r-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-[#007BFF]" />
              <h3 className="font-bold text-[#223344] text-lg">Job Market Outlook</h3>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              {plan.jobMarketOutlook}
            </p>
          </div>
        )}

        {/* Overall Progress */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border-2 border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-xl text-[#223344]">
              Overall Progress
            </h3>
            <span className="text-4xl font-bold text-[#FFC107]">
              {progress.overall}%
            </span>
          </div>
          <div className="bg-gray-300 rounded-full h-5 overflow-hidden mb-6 shadow-inner">
            <div
              className="bg-gradient-to-r from-[#FFC107] to-[#FFD54F] h-full transition-all duration-500 shadow-sm"
              style={{ width: `${progress.overall}%` }}
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Days Active</p>
              <p className="font-bold text-2xl text-[#223344]">{progress.daysActive}</p>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Current Phase</p>
              <p className="font-bold text-lg text-[#223344]">{progress.currentPhase}</p>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Milestones</p>
              <p className="font-bold text-2xl text-[#223344]">
                {progress.completedMilestones}/{progress.totalMilestones}
              </p>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Tasks</p>
              <p className="font-bold text-2xl text-[#223344]">
                {progress.completedTasks}/{progress.totalTasks}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
