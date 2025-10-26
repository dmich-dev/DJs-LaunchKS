'use client';

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronRight, CheckCircle } from 'lucide-react';

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
      <Card className="border-2 border-gray-200 shadow-sm">
        <CardHeader className="bg-[#223344] text-white">
          <CardTitle className="text-lg font-semibold">Next Up</CardTitle>
        </CardHeader>
        <CardContent className="pt-12 pb-12 text-center">
          <div className="w-16 h-16 bg-[#28A745]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-[#28A745]" />
          </div>
          <p className="text-gray-600 font-medium">
            You've completed all milestones!
          </p>
          <p className="text-2xl mt-2">🎉</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-gray-200 hover:border-[#007BFF] transition-all shadow-sm hover:shadow-md">
      <CardHeader className="bg-[#223344] text-white">
        <CardTitle className="text-lg font-semibold">Next Up</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="mb-4">
          <div className="inline-block px-2 py-1 bg-[#007BFF]/10 text-[#007BFF] text-xs font-semibold rounded mb-2">
            {milestone.phase}
          </div>
          <h3 className="font-bold text-lg text-[#223344] mb-2 line-clamp-2">
            {milestone.title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2">
            {milestone.description}
          </p>
        </div>
        
        <div className="space-y-2 mb-6 bg-gray-50 rounded-lg p-3">
          <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Upcoming Tasks</p>
          {milestone.nextTasks.slice(0, 3).map((task) => (
            <div key={task.id} className="flex items-start gap-2">
              <Checkbox checked={task.isCompleted} disabled className="mt-0.5" />
              <span className="text-sm text-[#223344] flex-1 leading-relaxed">{task.title}</span>
            </div>
          ))}
        </div>
        
        <Link href={`/plan/${planId}#milestone-${milestone.id}`}>
          <Button className="w-full bg-[#FFC107] text-[#223344] hover:bg-[#FFD54F] font-semibold">
            View Full Milestone
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
