/**
 * Calculate progress percentage for a milestone based on completed tasks
 */
export function calculateMilestoneProgress(
  completedTasks: number,
  totalTasks: number
): number {
  if (totalTasks === 0) return 0;
  return Math.round((completedTasks / totalTasks) * 100);
}

/**
 * Calculate progress percentage for a phase based on milestones
 */
export function calculatePhaseProgress(milestones: {
  progress: number;
}[]): number {
  if (milestones.length === 0) return 0;
  const total = milestones.reduce((sum, m) => sum + m.progress, 0);
  return Math.round(total / milestones.length);
}

/**
 * Calculate overall plan progress based on phases
 */
export function calculatePlanProgress(phases: {
  progress: number;
}[]): number {
  if (phases.length === 0) return 0;
  const total = phases.reduce((sum, p) => sum + p.progress, 0);
  return Math.round(total / phases.length);
}

/**
 * Get the current active phase (first incomplete phase)
 */
export function getCurrentPhase<T extends { status: string; orderIndex: number }>(
  phases: T[]
): T | null {
  const sortedPhases = [...phases].sort((a, b) => a.orderIndex - b.orderIndex);
  return sortedPhases.find(p => p.status !== 'completed') || sortedPhases[sortedPhases.length - 1] || null;
}

/**
 * Get the next incomplete milestone
 */
export function getNextMilestone<T extends { status: string; orderIndex: number }>(
  milestones: T[]
): T | null {
  const sortedMilestones = [...milestones].sort((a, b) => a.orderIndex - b.orderIndex);
  return sortedMilestones.find(m => m.status !== 'completed') || null;
}

/**
 * Calculate days since a date
 */
export function daysSince(date: Date | string): number {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - d.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Calculate estimated completion date based on progress rate
 */
export function estimateCompletionDate(
  startDate: Date | string,
  currentProgress: number,
  targetProgress: number = 100
): Date | null {
  if (currentProgress === 0) return null;

  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const daysElapsed = daysSince(start);
  const progressRate = currentProgress / daysElapsed; // progress per day
  const remainingProgress = targetProgress - currentProgress;
  const estimatedDaysRemaining = remainingProgress / progressRate;

  const completionDate = new Date();
  completionDate.setDate(completionDate.getDate() + estimatedDaysRemaining);

  return completionDate;
}
