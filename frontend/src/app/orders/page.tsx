"use client";

import Link from "next/link";
import { Package, ReceiptText } from "lucide-react";
import { useState } from "react";
import { useOrders } from "@/hooks/useOrders";
import OrderCard from "@/components/orders/OrderCard";
import OrdersSkeleton from "@/components/orders/OrdersSkeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";

const PAGE_SIZE = 6;

export default function OrdersPage() {
  const { data: orders = [], isLoading: loading, error, refetch } = useOrders();
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(orders.length / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const pageItems = orders.slice(start, start + PAGE_SIZE);

  const errorMessage =
    error instanceof Error ? error.message : "Unable to load orders";

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 lg:px-6">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Package className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
            My orders
          </p>
          <h1 className="text-3xl font-semibold">Your recent purchases</h1>
        </div>
      </div>

      {loading ? (
        <OrdersSkeleton count={3} />
      ) : error ? (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-8 text-sm text-destructive">
          <p>{errorMessage}</p>
          <div className="mt-4">
            <button
              onClick={() => refetch()}
              className="inline-flex items-center rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
              Retry
            </button>
          </div>
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-10 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <ReceiptText className="h-7 w-7" />
          </div>
          <h2 className="mt-4 text-xl font-semibold">No orders yet</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Your completed purchases will appear here once you place an order.
          </p>
          <Link
            href="/equipments"
            className="mt-6 inline-flex items-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
          >
            Continue shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {pageItems.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}

          {totalPages > 1 ? (
            <Pagination className="mt-2">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    aria-disabled={page <= 1}
                  />
                </PaginationItem>
                <li className="flex items-center px-3 text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </li>
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    aria-disabled={page >= totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          ) : null}
        </div>
      )}
    </main>
  );
}
