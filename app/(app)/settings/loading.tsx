import { Skeleton } from '@/components/ui/skeleton';

export default function SettingsLoading() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Skeleton className="h-9 w-64 mb-2" />
        <Skeleton className="h-5 w-96" />
      </div>

      {/* Tabs Skeleton */}
      <div className="flex gap-2 mb-6">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-24" />
      </div>

      {/* Content Skeleton */}
      <div className="bg-card border rounded-lg p-6 space-y-6">
        <div>
          <Skeleton className="h-6 w-48 mb-4" />
          <Skeleton className="h-5 w-full mb-6" />
        </div>

        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}

        <div className="flex justify-end pt-4 border-t">
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    </div>
  );
}
