import { Skeleton } from '@/components/ui/skeleton';

export default function AdminLoading() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header Skeleton */}
      <div>
        <Skeleton className="h-9 w-64 mb-2" />
        <Skeleton className="h-5 w-96" />
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-card border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="w-12 h-12 rounded-full" />
            </div>
            <Skeleton className="h-4 w-24 mb-1" />
            <Skeleton className="h-8 w-16 mb-2" />
            <Skeleton className="h-3 w-32" />
          </div>
        ))}
      </div>

      {/* Charts Row Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="bg-card border rounded-lg p-6">
            <Skeleton className="h-6 w-40 mb-6" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="bg-card border rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-8 w-20" />
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((j) => (
                <div key={j} className="flex items-start gap-3">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-64" />
                  </div>
                  <Skeleton className="h-3 w-16" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
