'use client';

import { useState } from 'react';
import { CheckCircle, Circle, AlertCircle, X } from 'lucide-react';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { TaskList } from './task-list';
import { ResourceList } from './resource-list';
import { type Milestone, type Task, type Resource } from '@/types/db';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface MilestoneCardProps {
  milestone: Milestone & {
    tasks: Task[];
    resources: Resource[];
  };
  planId: string;
  index: number;
}

export function MilestoneCard({ milestone, planId, index }: MilestoneCardProps) {
  const router = useRouter();
  const [isCompleting, setIsCompleting] = useState(false);
  const [isSkipping, setIsSkipping] = useState(false);
  
  const completedTasks = milestone.tasks.filter((t) => t.isCompleted).length;
  const totalTasks = milestone.tasks.length;
  const progress =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const handleComplete = async () => {
    if (progress < 100) {
      toast.error('Please complete all tasks before marking the milestone as complete');
      return;
    }

    setIsCompleting(true);
    try {
      const response = await fetch('/api/plan/milestones/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ milestoneId: milestone.id }),
      });

      if (!response.ok) {
        throw new Error('Failed to complete milestone');
      }

      toast.success('Milestone completed! 🎊');
      router.refresh();
    } catch (error) {
      console.error('Error completing milestone:', error);
      toast.error('Failed to complete milestone');
    } finally {
      setIsCompleting(false);
    }
  };

  const handleSkip = async () => {
    setIsSkipping(true);
    try {
      const response = await fetch('/api/plan/milestones/skip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ milestoneId: milestone.id }),
      });

      if (!response.ok) {
        throw new Error('Failed to skip milestone');
      }

      toast.success('Milestone skipped');
      router.refresh();
    } catch (error) {
      console.error('Error skipping milestone:', error);
      toast.error('Failed to skip milestone');
    } finally {
      setIsSkipping(false);
    }
  };

  return (
    <AccordionItem
      value={milestone.id}
      id={`milestone-${milestone.id}`}
      className="border rounded-lg px-4 bg-card"
    >
      <AccordionTrigger className="hover:no-underline py-4">
        <div className="flex items-start gap-4 w-full text-left">
          {/* Status Icon */}
          <div className="mt-1">
            {milestone.isCompleted ? (
              <CheckCircle className="w-6 h-6 text-success" />
            ) : completedTasks > 0 ? (
              <AlertCircle className="w-6 h-6 text-warning" />
            ) : (
              <Circle className="w-6 h-6 text-muted-foreground" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium text-muted-foreground">
                Milestone {index + 1}
              </span>
              {milestone.verificationRequired && (
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-accent/10 text-accent-foreground border border-accent/20">
                  Verification Required
                </span>
              )}
            </div>
            <h3 className="font-semibold text-lg text-primary mb-1">
              {milestone.title}
            </h3>
            <p className="text-sm text-muted-foreground mb-2">
              {milestone.description}
            </p>

            {/* Progress Bar */}
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className="bg-accent h-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-sm font-medium text-muted-foreground min-w-[60px]">
                {completedTasks}/{totalTasks} tasks
              </span>
            </div>
          </div>
        </div>
      </AccordionTrigger>

      <AccordionContent className="pt-4 pb-6 space-y-6">
        {/* Completion Criteria */}
        {milestone.completionCriteria && (
          <div className="bg-muted/50 border-l-4 border-accent p-4 rounded-r">
            <h4 className="font-semibold text-sm text-primary mb-1">
              Completion Criteria
            </h4>
            <p className="text-sm text-muted-foreground">
              {milestone.completionCriteria}
            </p>
          </div>
        )}

        {/* Tasks */}
        <div>
          <h4 className="font-semibold text-primary mb-3">Tasks</h4>
          <TaskList tasks={milestone.tasks} planId={planId} />
        </div>

        {/* Resources */}
        {milestone.resources.length > 0 && (
          <div>
            <h4 className="font-semibold text-primary mb-3">
              Resources ({milestone.resources.length})
            </h4>
            <ResourceList resources={milestone.resources} />
          </div>
        )}

        {/* Actions */}
        {!milestone.isCompleted && (
          <div className="flex gap-2 pt-4 border-t">
            <Button
              onClick={handleComplete}
              disabled={isCompleting || progress < 100}
              className="bg-success hover:bg-success/90 text-white"
            >
              {isCompleting ? 'Completing...' : 'Mark as Complete'}
            </Button>
            <Button
              onClick={handleSkip}
              disabled={isSkipping}
              variant="outline"
              className="text-muted-foreground"
            >
              <X className="w-4 h-4 mr-2" />
              {isSkipping ? 'Skipping...' : 'Skip Milestone'}
            </Button>
          </div>
        )}

        {/* Completion Status */}
        {milestone.isCompleted && milestone.completedAt && (
          <div className="bg-success/10 border border-success/20 text-success p-4 rounded-lg">
            <p className="text-sm font-medium">
              ✓ Completed on{' '}
              {new Date(milestone.completedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}
