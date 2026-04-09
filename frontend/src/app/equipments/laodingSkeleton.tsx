import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingSkeleton() {
  return (
    <main className="group flex flex-col items-center justify-center gap-10 px-5 py-10 lg:flex-row lg:items-start">
      <aside className="h-fit space-y-5 lg:sticky lg:top-10 lg:w-64">
        {/* Collections Filter Skeleton */}
        <div className="space-y-3">
          <Skeleton className="h-6 w-24" />
          <ul className="space-y-1.5">
            {Array.from({ length: 8 }).map((_, i) => (
              <li key={i}>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 flex-1" />
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Price Filter Skeleton */}
        <div className="space-y-3">
          <Skeleton className="h-6 w-32" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-4 w-2" />
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-20" />
          </div>
        </div>
      </aside>

      <div className="w-full max-w-7xl space-y-5">
        <div className="flex justify-center lg:justify-end">
          <Skeleton className="h-10 w-48" />
        </div>

        {/* Products Grid Skeleton */}
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="border rounded-none p-4">
              <Skeleton className="w-full h-64 mb-4" />
              <div className="border-b border-gray-300 mb-4"></div>
              <Skeleton className="h-5 w-3/4 mb-2" />
              <Skeleton className="h-5 w-1/3 mb-4" />
              <Skeleton className="h-12 w-full" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
