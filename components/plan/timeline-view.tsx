'use client';

import { Check, Circle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimelinePhase {
  id: string;
  title: string;
  estimatedDuration: string;
  status: 'completed' | 'in_progress' | 'not_started';
  orderIndex: number;
}

interface TimelineViewProps {
  phases: TimelinePhase[];
  className?: string;
}

export function TimelineView({ phases, className }: TimelineViewProps) {
  return (
    <div className={cn('relative', className)}>
      <div className="bg-card border rounded-lg p-6">
        <h3 className="text-xl font-bold text-primary mb-6">Timeline</h3>
        
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />
          
          {/* Timeline items */}
          <div className="space-y-8">
            {phases
              .sort((a, b) => a.orderIndex - b.orderIndex)
              .map((phase, index) => (
                <div key={phase.id} className="relative flex items-start gap-4">
                  {/* Timeline dot */}
                  <div
                    className={cn(
                      'relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-4 border-background transition-colors',
                      phase.status === 'completed' && 'bg-success',
                      phase.status === 'in_progress' && 'bg-accent',
                      phase.status === 'not_started' && 'bg-muted'
                    )}
                  >
                    {phase.status === 'completed' && (
                      <Check className="w-5 h-5 text-white" />
                    )}
                    {phase.status === 'in_progress' && (
                      <Clock className="w-5 h-5 text-primary" />
                    )}
                    {phase.status === 'not_started' && (
                      <Circle className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                  
                  {/* Phase info */}
                  <div className="flex-1 pb-8">
                    <div className="flex items-center justify-between mb-2">
                      <h4
                        className={cn(
                          'font-semibold text-lg',
                          phase.status === 'completed' && 'text-success',
                          phase.status === 'in_progress' && 'text-primary',
                          phase.status === 'not_started' && 'text-muted-foreground'
                        )}
                      >
                        Phase {index + 1}: {phase.title}
                      </h4>
                      <span className="text-sm text-muted-foreground">
                        {phase.estimatedDuration}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                          phase.status === 'completed' && 'bg-success/10 text-success',
                          phase.status === 'in_progress' && 'bg-accent/10 text-accent-foreground',
                          phase.status === 'not_started' && 'bg-muted text-muted-foreground'
                        )}
                      >
                        {phase.status === 'completed' && 'Completed'}
                        {phase.status === 'in_progress' && 'In Progress'}
                        {phase.status === 'not_started' && 'Not Started'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

