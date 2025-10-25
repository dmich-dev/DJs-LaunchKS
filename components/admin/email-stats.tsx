import { Mail, CheckCircle2, XCircle, Clock } from 'lucide-react';

interface EmailStatsProps {
  sent: number;
  failed: number;
  queued: number;
}

export function EmailStats({ sent, failed, queued }: EmailStatsProps) {
  const total = sent + failed + queued;
  const successRate = total > 0 ? Math.round((sent / total) * 100) : 0;

  const stats = [
    {
      label: 'Sent',
      value: sent,
      icon: CheckCircle2,
      color: 'text-green-600',
    },
    {
      label: 'Failed',
      value: failed,
      icon: XCircle,
      color: 'text-red-600',
    },
    {
      label: 'Queued',
      value: queued,
      icon: Clock,
      color: 'text-yellow-600',
    },
  ];

  return (
    <div className="bg-card border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <Mail className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-primary">Email Activity</h3>
        <span className="ml-auto text-sm text-muted-foreground">Last 7 days</span>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Success Rate</span>
          <span className="text-2xl font-bold text-primary">{successRate}%</span>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="text-center">
                <Icon className={`w-5 h-5 mx-auto mb-2 ${stat.color}`} />
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            );
          })}
        </div>

        <div className="pt-4 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total Emails</span>
            <span className="font-semibold">{total}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
