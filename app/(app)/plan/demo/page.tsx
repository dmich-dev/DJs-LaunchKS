import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlanOverview } from '@/components/plan/plan-overview';
import { PhaseCard } from '@/components/plan/phase-card';
import { TimelineView } from '@/components/plan/timeline-view';

// Mock plan data for demo
const mockPlan = {
  id: 'demo-plan',
  userId: 'demo-user',
  conversationId: 'demo-conversation',
  targetCareer: 'Software Developer (Back-end Java/Spring)',
  currentCareer: 'Software Developer',
  estimatedDuration: '6-8 months',
  salaryExpectationsEntry: '$65,000 - $75,000',
  salaryExpectationsExperienced: '$85,000 - $110,000',
  jobMarketOutlook: 'Strong demand in Kansas, especially in Wichita, Overland Park, and Kansas City metro areas. Remote opportunities also available.',
  status: 'active' as const,
  generatedAt: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
  lastActivityAt: new Date(),
};

const mockPhases = [
  {
    id: 'phase-1',
    planId: 'demo-plan',
    createdAt: new Date(),
    title: 'Foundation & Environment Setup',
    description: 'Get your development environment ready and review Java fundamentals',
    estimatedDuration: '2-3 weeks',
    orderIndex: 1,
    milestones: [
      {
        id: 'milestone-1',
        phaseId: 'phase-1',
        createdAt: new Date(),
        title: 'Development Environment Setup',
        description: 'Install and configure all necessary tools for Spring Boot development',
        orderIndex: 1,
        completionCriteria: 'Successfully run a "Hello World" Spring Boot application locally',
        verificationRequired: false,
        isCompleted: true,
        completedAt: new Date(),
        tasks: [
          {
            id: 'task-1',
            milestoneId: 'milestone-1',
            title: 'Install JDK 17 or higher',
            description: 'Download and install Java Development Kit from Oracle or use OpenJDK',
            orderIndex: 1,
            estimatedHours: 1,
            isCompleted: true,
            completedAt: new Date(),
          },
          {
            id: 'task-2',
            milestoneId: 'milestone-1',
            title: 'Set up IntelliJ IDEA or VS Code',
            description: 'Install your preferred IDE with Java/Spring extensions',
            orderIndex: 2,
            estimatedHours: 1,
            isCompleted: true,
            completedAt: new Date(),
          },
          {
            id: 'task-3',
            milestoneId: 'milestone-1',
            title: 'Install Maven or Gradle',
            description: 'Set up build tools for dependency management',
            orderIndex: 3,
            estimatedHours: 1,
            isCompleted: true,
            completedAt: new Date(),
          },
        ],
        resources: [
          {
            id: 'resource-1',
            milestoneId: 'milestone-1',
            title: 'JDK Installation Guide',
            description: 'Official Oracle guide for installing Java',
            url: 'https://www.oracle.com/java/technologies/downloads/',
            type: 'documentation',
            cost: 'Free',
            provider: 'Oracle',
          },
        ],
      },
      {
        id: 'milestone-2',
        phaseId: 'phase-1',
        createdAt: new Date(),
        title: 'Java Fundamentals Review',
        description: 'Refresh or strengthen core Java concepts',
        orderIndex: 2,
        completionCriteria: 'Complete practice exercises on collections, streams, and lambdas',
        verificationRequired: false,
        isCompleted: false,
        tasks: [
          {
            id: 'task-4',
            milestoneId: 'milestone-2',
            title: 'Review Java Collections Framework',
            description: 'Study List, Set, Map interfaces and common implementations',
            orderIndex: 1,
            estimatedHours: 4,
            isCompleted: false,
          },
          {
            id: 'task-5',
            milestoneId: 'milestone-2',
            title: 'Practice Stream API operations',
            description: 'Complete exercises on filtering, mapping, and reducing data',
            orderIndex: 2,
            estimatedHours: 4,
            isCompleted: false,
          },
          {
            id: 'task-6',
            milestoneId: 'milestone-2',
            title: 'Master Lambda expressions',
            description: 'Practice functional programming concepts in Java',
            orderIndex: 3,
            estimatedHours: 3,
            isCompleted: false,
          },
        ],
        resources: [
          {
            id: 'resource-2',
            milestoneId: 'milestone-2',
            title: 'Java Programming - LinkedIn Learning',
            description: 'Free access through Wichita Public Library',
            url: 'https://www.wichitalibrary.org/Research/Pages/linkedin-learning.aspx',
            type: 'online_course',
            cost: 'Free',
            duration: '20 hours',
            provider: 'LinkedIn Learning',
          },
        ],
      },
      {
        id: 'milestone-3',
        phaseId: 'phase-1',
        createdAt: new Date(),
        title: 'Git & Version Control Mastery',
        description: 'Learn professional Git workflows',
        orderIndex: 3,
        completionCriteria: 'Create a GitHub account and push your first project',
        verificationRequired: false,
        isCompleted: false,
        tasks: [
          {
            id: 'task-7',
            milestoneId: 'milestone-3',
            title: 'Complete Git basics tutorial',
            description: 'Learn commit, branch, merge, and pull request workflows',
            orderIndex: 1,
            estimatedHours: 3,
            isCompleted: false,
          },
          {
            id: 'task-8',
            milestoneId: 'milestone-3',
            title: 'Create GitHub portfolio',
            description: 'Set up professional GitHub profile with README',
            orderIndex: 2,
            estimatedHours: 2,
            isCompleted: false,
          },
          {
            id: 'task-9',
            milestoneId: 'milestone-3',
            title: 'Practice branching strategies',
            description: 'Learn Git Flow or trunk-based development',
            orderIndex: 3,
            estimatedHours: 2,
            isCompleted: false,
          },
        ],
        resources: [
          {
            id: 'resource-3',
            milestoneId: 'milestone-3',
            title: 'Git and GitHub Tutorial',
            description: 'Free comprehensive Git course',
            url: 'https://www.youtube.com/watch?v=RGOj5yH7evk',
            type: 'video',
            cost: 'Free',
            provider: 'freeCodeCamp',
          },
        ],
      },
    ],
  },
  {
    id: 'phase-2',
    planId: 'demo-plan',
    createdAt: new Date(),
    title: 'Spring Boot Core Development',
    description: 'Master Spring Boot REST API development with best practices',
    estimatedDuration: '8-10 weeks',
    orderIndex: 2,
    milestones: [
      {
        id: 'milestone-4',
        phaseId: 'phase-2',
        createdAt: new Date(),
        title: 'Spring Boot Fundamentals',
        description: 'Learn Spring Boot architecture and core concepts',
        orderIndex: 1,
        completionCriteria: 'Build a working REST API with CRUD operations',
        verificationRequired: false,
        isCompleted: false,
        tasks: [
          {
            id: 'task-10',
            milestoneId: 'milestone-4',
            title: 'Complete Spring Boot official guides',
            description: 'Work through spring.io getting started guides',
            orderIndex: 1,
            estimatedHours: 8,
            isCompleted: false,
          },
          {
            id: 'task-11',
            milestoneId: 'milestone-4',
            title: 'Build a Task Manager API',
            description: 'Create REST endpoints for creating, reading, updating, and deleting tasks',
            orderIndex: 2,
            estimatedHours: 12,
            isCompleted: false,
          },
          {
            id: 'task-12',
            milestoneId: 'milestone-4',
            title: 'Implement request validation',
            description: 'Add Bean Validation annotations and error handling',
            orderIndex: 3,
            estimatedHours: 4,
            isCompleted: false,
          },
        ],
        resources: [
          {
            id: 'resource-4',
            milestoneId: 'milestone-4',
            title: 'Spring Boot Reference Documentation',
            description: 'Official Spring Boot documentation',
            url: 'https://spring.io/projects/spring-boot',
            type: 'documentation',
            cost: 'Free',
            provider: 'VMware',
          },
        ],
      },
    ],
  },
  {
    id: 'phase-3',
    planId: 'demo-plan',
    createdAt: new Date(),
    title: 'Database & Testing',
    description: 'Learn database integration and testing best practices',
    estimatedDuration: '6-8 weeks',
    orderIndex: 3,
    milestones: [],
  },
];

const progress = {
  overall: 15,
  completedTasks: 3,
  totalTasks: 20,
  completedMilestones: 1,
  totalMilestones: 8,
  daysActive: 7,
  currentPhase: 'Foundation & Environment Setup',
};

export default function DemoPlanPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background sticky top-0 z-10">
        <div className="container mx-auto flex h-16 items-center px-4 gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Dashboard
            </Button>
          </Link>
          <h1 className="text-xl font-semibold">Career Plan (Demo)</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Demo Notice */}
        <div className="bg-[#FFF9E6] border-2 border-[#FFC107] rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold text-[#223344] mb-2">
            📋 Demo Career Plan
          </h2>
          <p className="text-sm text-gray-600">
            This is a sample plan showing what your personalized career transition plan will look like.
            The full version will include Kansas-specific resources, real job listings, and customized guidance.
          </p>
        </div>

        {/* Plan Overview */}
        <PlanOverview plan={mockPlan} progress={progress} />

        {/* Timeline Visualization */}
        <TimelineView
          phases={mockPhases.map((phase) => ({
            id: phase.id,
            title: phase.title,
            estimatedDuration: phase.estimatedDuration,
            status: phase.milestones.every((m) => m.isCompleted)
              ? 'completed'
              : phase.milestones.some((m) => m.isCompleted)
              ? 'in_progress'
              : 'not_started',
            orderIndex: phase.orderIndex,
          }))}
        />

        {/* Phases */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-primary">
              Your Journey ({mockPhases.length} Phases)
            </h2>
          </div>

          {mockPhases.map((phase, index) => (
            <PhaseCard
              key={phase.id}
              phase={phase as any}
              planId="demo-plan"
              index={index}
            />
          ))}
        </div>

        {/* Back to Dashboard Button */}
        <div className="flex justify-center pt-8">
          <Link href="/dashboard">
            <Button variant="outline" size="lg">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}

