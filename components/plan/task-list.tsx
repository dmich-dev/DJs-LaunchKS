'use client';

import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { type Task } from '@/types/db';

interface TaskListProps {
  tasks: Task[];
  planId: string;
}

export function TaskList({ tasks, planId }: TaskListProps) {
  const [taskStates, setTaskStates] = useState<Record<string, boolean>>(
    tasks.reduce(
      (acc, task) => ({
        ...acc,
        [task.id]: task.isCompleted,
      }),
      {}
    )
  );

  const [updating, setUpdating] = useState<string | null>(null);

  const handleToggleTask = async (taskId: string, currentState: boolean) => {
    const newState = !currentState;

    // Optimistically update UI
    setTaskStates((prev) => ({ ...prev, [taskId]: newState }));
    setUpdating(taskId);

    try {
      const response = await fetch('/api/plan/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskId,
          isCompleted: newState,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      // Refresh the page to update milestone completion states
      window.location.reload();
    } catch (error) {
      console.error('Error updating task:', error);
      // Revert on error
      setTaskStates((prev) => ({ ...prev, [taskId]: currentState }));
    } finally {
      setUpdating(null);
    }
  };

  if (tasks.length === 0) {
    return (
      <p className="text-sm text-muted-foreground italic">
        No tasks defined for this milestone
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
        >
          <Checkbox
            id={`task-${task.id}`}
            checked={taskStates[task.id]}
            onCheckedChange={() =>
              handleToggleTask(task.id, taskStates[task.id])
            }
            disabled={updating === task.id}
            className="mt-1"
          />
          <label
            htmlFor={`task-${task.id}`}
            className="flex-1 cursor-pointer select-none"
          >
            <p
              className={`font-medium ${
                taskStates[task.id]
                  ? 'line-through text-muted-foreground'
                  : 'text-foreground'
              }`}
            >
              {task.title}
            </p>
            {task.description && (
              <p className="text-sm text-muted-foreground mt-1">
                {task.description}
              </p>
            )}
          </label>
        </div>
      ))}
    </div>
  );
}
