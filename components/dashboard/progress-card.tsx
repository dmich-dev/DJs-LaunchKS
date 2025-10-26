import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface ProgressCardProps {
  progress: {
    overall: number;
    daysActive: number;
    currentPhase: string;
  };
}

export function ProgressCard({ progress }: ProgressCardProps) {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress.overall / 100) * circumference;

  return (
    <Card className="border-2 border-gray-200 hover:border-[#FFC107] transition-all shadow-sm hover:shadow-md">
      <CardHeader className="bg-[#223344] text-white">
        <CardTitle className="text-lg font-semibold">Your Progress</CardTitle>
      </CardHeader>
      <CardContent className="pt-8 pb-6">
        <div className="flex items-center justify-center relative mb-6">
          <svg width="140" height="140" className="transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="70"
              cy="70"
              r={radius}
              fill="none"
              stroke="#E9ECEF"
              strokeWidth="10"
            />
            {/* Progress circle */}
            <circle
              cx="70"
              cy="70"
              r={radius}
              fill="none"
              stroke="#FFC107"
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-500"
            />
          </svg>
          <div className="absolute text-center">
            <p className="text-4xl font-bold text-[#223344]">{progress.overall}%</p>
            <p className="text-xs text-gray-600 mt-1">Complete</p>
          </div>
        </div>
        <div className="space-y-3 px-2">
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">Days Active</span>
            <span className="font-bold text-[#223344] text-lg">{progress.daysActive}</span>
          </div>
          <div className="flex justify-between items-start py-2">
            <span className="text-sm text-gray-600">Current Phase</span>
            <span className="font-semibold text-[#223344] text-right text-sm max-w-[140px]">{progress.currentPhase}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
