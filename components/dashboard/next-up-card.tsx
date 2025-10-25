'use client';

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronRight } from 'lucide-react';

interface NextUpCardProps {
  milestone: {
    id: string;
    title: string;
    description: string;
    phase: string;
    nextTasks: Array<{
      id: string;
      title: string;
      isCompleted: boolean;
    }>;
  } | null;
  planId: string;
}

export function NextUpCard({ milestone, planId }: NextUpCardProps) {
  if (!milestone) {
    return (
      <Card>
        <CardHeader className="bg-secondary text-secondary-foreground">
          <CardTitle>Next Up</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            You've completed all milestones! 🎉
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="bg-secondary text-secondary-foreground">
        <CardTitle>Next Up</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="text-xs text-muted-foreground mb-1">{milestone.phase}</div>
        <h3 className="font-bold text-lg text-primary mb-2">
          {milestone.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {milestone.description}
        </p>
        <div className="space-y-2 mb-4">
          {milestone.nextTasks.map((task) => (
            <div key={task.id} className="flex items-start gap-2">
              <Checkbox checked={task.isCompleted} disabled />
              <span className="text-sm flex-1">{task.title}</span>
            </div>
          ))}
        </div>
        <Link href={`/plan/${planId}#milestone-${milestone.id}`}>
          <Button className="w-full" variant="default">
            View Full Milestone
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
