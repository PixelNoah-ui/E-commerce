"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { formatPrice } from "@/lib/currency";
import { Card } from "@/components/ui/card";
import { ShoppingBag } from "lucide-react";
import type { OrderSummary } from "@/app/(api)/getOrders";

type Props = {
  order: OrderSummary;
};

export default function OrderCard({ order }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const items = order.items || [];
  const activeItem = items[activeIndex] || items[0];
  const thumbnails = items
    .map((i) => i.product?.imageUrl)
    .filter(Boolean) as string[];

  const totalQty = items.reduce((sum, it) => sum + (it.quantity || 0), 0);

  return (
    <Card className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="flex -space-x-3">
            {thumbnails.length ? (
              thumbnails.map((src, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  aria-pressed={activeIndex === idx}
                  className={`relative h-16 w-16 overflow-hidden rounded-lg border bg-background transition-transform focus:outline-none ${activeIndex === idx ? "z-10 ring-2 ring-primary" : "border-border"}`}
                >
                  <Image
                    src={src}
                    alt={
                      activeItem?.product?.name || `Order ${order.orderNumber}`
                    }
                    fill
                    className="object-cover"
                  />
                </button>
              ))
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-border bg-muted text-muted-foreground">
                <svg className="h-6 w-6" />
              </div>
            )}
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-4">
            <div className="truncate">
              <p className="text-sm font-medium text-primary">
                {order.orderNumber}
              </p>
              <h3 className="mt-1 truncate text-lg font-semibold">
                {activeItem?.product?.name || "Order"}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Placed on {new Date(order.createdAt).toLocaleDateString()}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {items.length} item(s) • {totalQty} total qty
              </p>
            </div>

            <div className="flex-shrink-0 text-right">
              <div className="flex flex-col items-end gap-2">
                <span className="rounded-full border border-border bg-background px-3 py-1 text-sm text-muted-foreground">
                  {order.paymentStatus}
                </span>
                <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  {order.status}
                </span>
                <p className="mt-2 text-sm font-semibold">
                  {formatPrice(Number(order.total))}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Link
              href={`/orders/${order.id}`}
              className="inline-flex items-center justify-center rounded-full border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              View details
            </Link>
            {activeItem?.product?.id ? (
              <Link
                href={`/products/${activeItem.product.id}`}
                className="inline-flex items-center justify-center rounded-full border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-muted"
              >
                <ShoppingBag className="mr-2 h-4 w-4" />
                Buy again
              </Link>
            ) : null}
            <div className="ml-2 text-sm text-muted-foreground">
              Qty: {activeItem?.quantity}
            </div>
            <div className="ml-2 text-sm font-semibold">
              {formatPrice(activeItem?.total || 0)}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
