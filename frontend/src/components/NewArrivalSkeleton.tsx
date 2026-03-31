"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function NewArrivalSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="border rounded-none p-4 flex flex-col items-center"
        >
          {/* Image skeleton */}
          <div className="relative w-full h-64 mb-4">
            <Skeleton className="w-full h-full rounded" />
          </div>

          {/* Line under image skeleton */}
          <Skeleton className="w-full h-[1px] mb-4" />

          {/* Title skeleton */}
          <Skeleton className="h-5 w-3/4 mb-2" />
          {/* Price skeleton */}
          <Skeleton className="h-5 w-1/2 mb-4" />
          {/* BuyContactModule skeleton placeholder */}
          <Skeleton className="h-10 w-full rounded" />
        </div>
      ))}
    </div>
  );
}
