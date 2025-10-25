import { Skeleton } from '@/components/ui/skeleton';
import { Plane } from 'lucide-react';

export default function DashboardLoading() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Welcome Header Skeleton */}
      <div className="bg-gradient-to-r from-primary to-primary/80 p-8 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Skeleton className="h-10 w-64 bg-primary-foreground/20" />
          <Plane className="w-8 h-8 text-primary-foreground opacity-50" />
        </div>
        <Skeleton className="h-6 w-96 bg-primary-foreground/20" />
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-card border rounded-lg p-6">
            <Skeleton className="h-5 w-32 mb-4" />
            <Skeleton className="h-8 w-20 mb-2" />
            <Skeleton className="h-4 w-40" />
          </div>
        ))}
      </div>

      {/* Upcoming Milestones Skeleton */}
      <div className="bg-card border rounded-lg p-6">
        <Skeleton className="h-8 w-64 mb-4" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
              <Skeleton className="w-2 h-2 rounded-full mt-2" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
