import { Skeleton } from '@/components/ui/skeleton';

export default function PlanLoading() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Plan Overview Skeleton */}
      <div className="bg-card border rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-5 w-48" />
          </div>
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-6 w-24" />
            </div>
          ))}
        </div>
      </div>

      {/* Timeline Skeleton */}
      <div className="bg-card border rounded-lg p-6">
        <Skeleton className="h-6 w-40 mb-4" />
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-12 flex-1" />
          ))}
        </div>
      </div>

      {/* Phases Skeleton */}
      <div className="space-y-6">
        <Skeleton className="h-10 w-80" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-card border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Skeleton className="w-12 h-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64" />
              </div>
            </div>
            <div className="space-y-3">
              {[1, 2].map((j) => (
                <div key={j} className="border-l-2 border-muted pl-4">
                  <Skeleton className="h-5 w-56 mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
