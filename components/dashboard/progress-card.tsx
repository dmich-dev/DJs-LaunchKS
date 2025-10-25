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
    <Card className="border-accent border-2">
      <CardHeader className="bg-primary text-primary-foreground">
        <CardTitle>Your Progress</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex items-center justify-center">
          <svg width="140" height="140" className="transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="70"
              cy="70"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="12"
              className="text-muted"
            />
            {/* Progress circle */}
            <circle
              cx="70"
              cy="70"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="text-accent transition-all duration-500"
            />
          </svg>
          <div className="absolute text-center">
            <p className="text-3xl font-bold text-primary">{progress.overall}%</p>
            <p className="text-xs text-muted-foreground">Complete</p>
          </div>
        </div>
        <div className="mt-6 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Days Active:</span>
            <span className="font-semibold">{progress.daysActive}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Current Phase:</span>
            <span className="font-semibold text-right">{progress.currentPhase}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
