"use client";

import { useParams } from "next/navigation";
import { useOrderDetails } from "@/hooks/useOrders";
import OrderDetailContent from "@/components/orders/OrderDetailContent";
import OrderDetailSkeleton from "@/components/orders/OrderDetailSkeleton";

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const { data: order, isLoading, error } = useOrderDetails(params.id);

  if (isLoading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-12 lg:px-6">
        <OrderDetailSkeleton />
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-12 lg:px-6">
        <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-8 text-sm text-destructive">
          {error instanceof Error
            ? error.message
            : "Unable to load this order."}
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 lg:px-6">
      <OrderDetailContent order={order} />
    </main>
  );
}
