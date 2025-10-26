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
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-md">
        <h3 className="text-2xl font-bold text-[#223344] mb-6">Your Journey Timeline</h3>
        
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-1 bg-gray-200" />
          
          {/* Timeline items */}
          <div className="space-y-6">
            {phases
              .sort((a, b) => a.orderIndex - b.orderIndex)
              .map((phase, index) => (
                <div key={phase.id} className="relative flex items-start gap-6">
                  {/* Timeline dot */}
                  <div
                    className={cn(
                      'relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-4 border-white transition-all shadow-md',
                      phase.status === 'completed' && 'bg-[#28A745]',
                      phase.status === 'in_progress' && 'bg-[#FFC107]',
                      phase.status === 'not_started' && 'bg-gray-300'
                    )}
                  >
                    {phase.status === 'completed' && (
                      <Check className="w-6 h-6 text-white" />
                    )}
                    {phase.status === 'in_progress' && (
                      <Clock className="w-6 h-6 text-[#223344]" />
                    )}
                    {phase.status === 'not_started' && (
                      <Circle className="w-6 h-6 text-gray-500" />
                    )}
                  </div>
                  
                  {/* Phase info */}
                  <div className="flex-1 pb-6">
                    <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200 hover:border-[#007BFF] transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <h4
                          className={cn(
                            'font-bold text-lg',
                            phase.status === 'completed' && 'text-[#28A745]',
                            phase.status === 'in_progress' && 'text-[#223344]',
                            phase.status === 'not_started' && 'text-gray-500'
                          )}
                        >
                          Phase {index + 1}: {phase.title}
                        </h4>
                        <span className="text-sm font-semibold text-gray-600 bg-white px-3 py-1 rounded-full border border-gray-200">
                          {phase.estimatedDuration}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <span
                          className={cn(
                            'inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide',
                            phase.status === 'completed' && 'bg-[#28A745] text-white',
                            phase.status === 'in_progress' && 'bg-[#FFC107] text-[#223344]',
                            phase.status === 'not_started' && 'bg-gray-200 text-gray-600'
                          )}
                        >
                          {phase.status === 'completed' && '✓ Completed'}
                          {phase.status === 'in_progress' && '◷ In Progress'}
                          {phase.status === 'not_started' && '○ Not Started'}
                        </span>
                      </div>
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

