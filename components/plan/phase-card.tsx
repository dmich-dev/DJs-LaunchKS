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
    <div className="border-2 border-gray-200 rounded-xl p-6 bg-white shadow-md hover:shadow-lg transition-shadow">
      {/* Phase Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="inline-flex items-center justify-center w-10 h-10 bg-[#223344] text-white rounded-full font-bold text-lg">
                {index + 1}
              </span>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">
                  Phase {index + 1} of {totalMilestones > 0 ? '4-5' : 'TBD'}
                </p>
                <h2 className="text-2xl font-bold text-[#223344]">{phase.title}</h2>
              </div>
            </div>
          </div>
          <div className="text-right bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Duration</p>
            <p className="text-lg font-bold text-[#223344]">{phase.estimatedDuration}</p>
          </div>
        </div>

        <p className="text-gray-700 mb-6 leading-relaxed">{phase.description}</p>

        {/* Phase Progress */}
        <div className="bg-gradient-to-br from-[#FFC107]/5 to-[#FFC107]/10 rounded-xl p-5 border-2 border-[#FFC107]/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-[#223344] uppercase">
              Phase Progress
            </span>
            <span className="text-2xl font-bold text-[#FFC107]">{progress}%</span>
          </div>
          <div className="bg-gray-300 rounded-full h-4 overflow-hidden mb-4 shadow-inner">
            <div
              className="bg-gradient-to-r from-[#FFC107] to-[#FFD54F] h-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#28A745] rounded-full"></div>
              <span className="text-gray-700 font-medium">
                {completedMilestones} / {totalMilestones} milestones
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#007BFF] rounded-full"></div>
              <span className="text-gray-700 font-medium">
                {completedTasks} / {totalTasks} tasks
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Milestones */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-xl text-[#223344]">
            Milestones
          </h3>
          <span className="text-sm font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {totalMilestones} total
          </span>
        </div>
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
          <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <p className="text-sm text-gray-500 italic">
              No milestones defined for this phase yet
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
