import { Users, FileText, Activity, MessageSquare } from 'lucide-react';

interface StatsOverviewProps {
  stats: {
    totalUsers: number;
    totalPlans: number;
    activePlans: number;
    totalConversations: number;
    recentPlansCount: number;
  };
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  const cards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'text-blue-600 bg-blue-100',
      description: 'Registered accounts',
    },
    {
      title: 'Total Plans',
      value: stats.totalPlans,
      icon: FileText,
      color: 'text-green-600 bg-green-100',
      description: `${stats.activePlans} active`,
    },
    {
      title: 'Recent Plans',
      value: stats.recentPlansCount,
      icon: Activity,
      color: 'text-accent bg-accent/10',
      description: 'Last 7 days',
    },
    {
      title: 'Conversations',
      value: stats.totalConversations,
      icon: MessageSquare,
      color: 'text-purple-600 bg-purple-100',
      description: 'Total intake chats',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="bg-card border rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${card.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">{card.title}</p>
              <p className="text-3xl font-bold text-primary">{card.value.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-2">{card.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
