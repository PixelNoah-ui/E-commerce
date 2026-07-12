"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function OrderDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-border bg-card p-8 shadow-sm">
        <div className="flex items-start gap-4">
          <Skeleton className="h-12 w-12 rounded-2xl" />
          <div className="flex-1">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="mt-3 h-4 w-2/3" />
          </div>
          <div className="w-36">
            <Skeleton className="h-6 w-full" />
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-background p-4">
            <Skeleton className="h-5 w-1/4" />
            <div className="mt-4 space-y-3">
              <Skeleton className="h-14 w-full rounded-lg" />
              <Skeleton className="h-14 w-full rounded-lg" />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-background p-4">
            <Skeleton className="h-5 w-1/3" />
            <div className="mt-4 space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-6 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
