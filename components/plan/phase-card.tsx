import { Accordion } from '@/components/ui/accordion';
import { MilestoneCard } from './milestone-card';
import { type Phase, type Milestone, type Task, type Resource } from '@/types/db';

interface PhaseCardProps {
  phase: Phase & {
    milestones: (Milestone & {
      tasks: Task[];
      resources: Resource[];
    })[];
  };
  planId: string;
  index: number;
}

export function PhaseCard({ phase, planId, index }: PhaseCardProps) {
  const totalMilestones = phase.milestones.length;
  const completedMilestones = phase.milestones.filter(
    (m) => m.isCompleted
  ).length;
  const progress =
    totalMilestones > 0
      ? Math.round((completedMilestones / totalMilestones) * 100)
      : 0;

  const totalTasks = phase.milestones.reduce(
    (sum, m) => sum + m.tasks.length,
    0
  );
  const completedTasks = phase.milestones.reduce(
    (sum, m) => sum + m.tasks.filter((t) => t.isCompleted).length,
    0
  );

  return (
    <div className="border-2 border-primary/20 rounded-lg p-6 bg-card">
      {/* Phase Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              Phase {index + 1} of {totalMilestones > 0 ? '4-5' : 'TBD'}
            </p>
            <h2 className="text-2xl font-bold text-primary">{phase.title}</h2>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground mb-1">Duration</p>
            <p className="text-lg font-semibold">{phase.estimatedDuration}</p>
          </div>
        </div>

        <p className="text-muted-foreground mb-4">{phase.description}</p>

        {/* Phase Progress */}
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-primary">
              Phase Progress
            </span>
            <span className="text-sm font-bold text-primary">{progress}%</span>
          </div>
          <div className="bg-muted rounded-full h-3 overflow-hidden mb-3">
            <div
              className="bg-gradient-to-r from-accent to-accent/80 h-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              {completedMilestones} / {totalMilestones} milestones completed
            </span>
            <span>
              {completedTasks} / {totalTasks} tasks completed
            </span>
          </div>
        </div>
      </div>

      {/* Milestones */}
      <div>
        <h3 className="font-semibold text-lg text-primary mb-4">
          Milestones ({totalMilestones})
        </h3>
        {phase.milestones.length > 0 ? (
          <Accordion type="multiple" className="space-y-3">
            {phase.milestones.map((milestone, idx) => (
              <MilestoneCard
                key={milestone.id}
                milestone={milestone}
                planId={planId}
                index={idx}
              />
            ))}
          </Accordion>
        ) : (
          <p className="text-sm text-muted-foreground italic">
            No milestones defined for this phase
          </p>
        )}
      </div>
    </div>
  );
}
