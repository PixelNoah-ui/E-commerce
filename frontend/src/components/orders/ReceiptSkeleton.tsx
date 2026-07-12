"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function ReceiptSkeleton() {
  return (
    <div className="p-10">
      <div className="rounded-3xl border border-border bg-white p-8 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="mt-3 h-4 w-64" />
          </div>
          <div>
            <Skeleton className="h-4 w-32" />
            <Skeleton className="mt-2 h-4 w-20" />
          </div>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border border-border">
          <div className="p-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="mt-4 h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-full" />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Skeleton className="h-20 w-72" />
        </div>
      </div>
    </div>
  );
}
