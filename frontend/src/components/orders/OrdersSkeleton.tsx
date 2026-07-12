"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function OrdersSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-start gap-4">
            <Skeleton className="h-16 w-16 rounded-lg" />
            <div className="flex-1">
              <Skeleton className="h-5 w-1/3 rounded-md" />
              <div className="mt-2 flex items-center gap-2">
                <Skeleton className="h-4 w-2/5 rounded-md" />
                <Skeleton className="h-4 w-1/4 rounded-md" />
              </div>
              <div className="mt-4 flex items-center gap-2">
                <Skeleton className="h-8 w-24 rounded-full" />
                <Skeleton className="h-8 w-24 rounded-full" />
              </div>
            </div>
            <div className="w-36">
              <Skeleton className="h-5 w-3/4 rounded-md" />
              <Skeleton className="mt-3 h-6 w-full rounded-md" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
