"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  Loader2,
  MapPin,
  ReceiptText,
  ShieldCheck,
  Truck,
  XCircle,
} from "lucide-react";
import { useOrderDetails } from "@/hooks/useOrders";
import OrderDetailSkeleton from "@/components/orders/OrderDetailSkeleton";
import { formatPrice } from "@/lib/currency";

export default function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const orderNumber = searchParams.get("orderNumber");
  const orderIdentifier = useMemo(
    () => orderId || orderNumber || undefined,
    [orderId, orderNumber],
  );

  const {
    data: order,
    isLoading: loading,
    error,
  } = useOrderDetails(orderIdentifier);

  const [pageLoadedAt] = useState(() => Date.now());
  const errorMessage = error instanceof Error ? error.message : null;
  const isPaid = order?.paymentStatus === "PAID";
  const statusLabel = isPaid
    ? "Payment confirmed"
    : order?.paymentStatus === "PENDING"
      ? "Awaiting payment"
      : "Payment failed";
  const statusDescription = order
    ? isPaid
      ? "Your payment was processed successfully and your order is now confirmed."
      : order.paymentStatus === "PENDING"
        ? "Your order is created and waiting for payment confirmation."
        : "Your payment could not be completed. Please try again or contact support."
    : "Your order request has been received. If payment is required, you will be redirected to the secure checkout page.";
  const subtotal = Number(order?.subtotal ?? 0);
  const shipping = Number(order?.shipping ?? 0);
  const tax = Number(order?.tax ?? 0);
  const total = Number(order?.total ?? subtotal + shipping + tax);
  const estimatedDelivery = useMemo(() => {
    if (order?.estimatedDelivery) {
      return new Date(order.estimatedDelivery);
    }
    return new Date(pageLoadedAt + 5 * 86400000);
  }, [order?.estimatedDelivery, pageLoadedAt]);

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-10 md:px-6 lg:px-8 lg:py-14">
      <div className="overflow-hidden rounded-[28px] border border-border bg-card shadow-sm">
        <div className="border-b border-border bg-background/70 p-6 sm:p-8 lg:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-100 text-emerald-700">
                {loading ? (
                  <Loader2 className="h-8 w-8" />
                ) : isPaid ? (
                  <CheckCircle2 className="h-8 w-8" />
                ) : (
                  <XCircle className="h-8 w-8" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
                  Order confirmed
                </p>
                <h1 className="mt-2 text-4xl font-semibold tracking-tight">
                  Thank you for your purchase
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                  {statusDescription}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
                    {statusLabel}
                  </span>
                  <span className="rounded-full border border-border bg-background px-3 py-1 text-sm font-medium text-muted-foreground">
                    {order?.status || "Processing"}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-3 flex flex-col items-start gap-3 sm:mt-0 sm:items-end">
              <div className="rounded-2xl border border-border bg-background p-4 text-sm">
                <p className="text-xs text-muted-foreground">Order number</p>
                <p className="mt-1 font-semibold">
                  {order?.orderNumber || orderIdentifier || "—"}
                </p>
              </div>
              <div className="mt-2 flex gap-2">
                <Link
                  href={`/orders/${order?.id}`}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium"
                >
                  View order
                </Link>
                <Link
                  href="/equipments"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                >
                  Continue shopping <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-border bg-background p-4">
              <p className="text-sm text-muted-foreground">Payment method</p>
              <p className="mt-1 font-semibold">
                {order?.payment?.provider || "Chapa"}
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-background p-4">
              <p className="text-sm text-muted-foreground">
                Transaction reference
              </p>
              <p className="mt-1 font-semibold">
                {order?.payment?.transactionId || "—"}
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-background p-4">
              <p className="text-sm text-muted-foreground">
                Estimated delivery
              </p>
              <p className="mt-1 font-semibold">
                {estimatedDelivery.toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.1fr_0.9fr] lg:p-10">
          <div className="space-y-6">
            <section className="rounded-2xl border border-border bg-background p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Order summary
                  </p>
                  <h2 className="mt-1 text-xl font-semibold">
                    Your order is on the way
                  </h2>
                </div>
                {order ? (
                  <Link
                    href={`/orders/${order.id}`}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    View order
                  </Link>
                ) : null}
              </div>

              <dl className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-sm text-muted-foreground">Order date</dt>
                  <dd className="mt-1 flex items-center gap-2 font-medium">
                    <CalendarDays className="h-4 w-4 text-primary" />
                    {order
                      ? new Date(order.createdAt).toLocaleDateString()
                      : "—"}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">
                    Estimated delivery
                  </dt>
                  <dd className="mt-1 flex items-center gap-2 font-medium">
                    <Truck className="h-4 w-4 text-primary" />
                    {estimatedDelivery.toLocaleDateString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">
                    Payment status
                  </dt>
                  <dd className="mt-1 font-medium">
                    {order?.paymentStatus || "Pending"}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Invoice</dt>
                  <dd className="mt-1 font-medium">
                    {order?.invoiceNumber || "—"}
                  </dd>
                </div>
              </dl>
            </section>

            <section className="rounded-2xl border border-border bg-background p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Purchased items
                  </p>
                  <h2 className="mt-1 text-xl font-semibold">
                    What you ordered
                  </h2>
                </div>
                <span className="text-sm text-muted-foreground">
                  {order?.items?.length || 0} item(s)
                </span>
              </div>
              <div className="mt-6 space-y-3">
                {loading ? (
                  <OrderDetailSkeleton />
                ) : order?.items?.length ? (
                  order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-3 rounded-2xl border border-border bg-background/70 p-4"
                    >
                      {item.product?.imageUrl ? (
                        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border border-border">
                          <Image
                            src={item.product.imageUrl}
                            alt={item.product.name || "Product"}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : null}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <p className="font-medium">
                              {item.product?.name || "Product"}
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">
                              Qty {item.quantity}
                              {item.selectedSize
                                ? ` • ${item.selectedSize}`
                                : ""}
                              {item.selectedColor
                                ? ` • ${item.selectedColor}`
                                : ""}
                            </p>
                          </div>
                          <p className="text-sm font-semibold">
                            {formatPrice(item.total)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
                    Items will appear here once the order is loaded.
                  </div>
                )}
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section className="rounded-2xl border border-border bg-background p-6">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Shipping & billing</h2>
              </div>
              <div className="mt-6 space-y-4 text-sm text-muted-foreground">
                <div className="rounded-2xl border border-border bg-background/70 p-4">
                  <p className="font-medium text-foreground">
                    Shipping address
                  </p>
                  <p className="mt-2">{order?.address?.fullName || "—"}</p>
                  <p>{order?.address?.address || "—"}</p>
                  <p>
                    {[order?.address?.city, order?.address?.country]
                      .filter(Boolean)
                      .join(", ") || "—"}
                  </p>
                  <p>{order?.address?.phone || "—"}</p>
                </div>
                <div className="rounded-2xl border border-border bg-background/70 p-4">
                  <p className="font-medium text-foreground">Billing address</p>
                  <p className="mt-2">
                    {order?.billingAddress?.fullName ||
                      order?.address?.fullName ||
                      "—"}
                  </p>
                  <p>
                    {order?.billingAddress?.address ||
                      order?.address?.address ||
                      "—"}
                  </p>
                  <p>
                    {[
                      order?.billingAddress?.city || order?.address?.city,
                      order?.billingAddress?.country || order?.address?.country,
                    ]
                      .filter(Boolean)
                      .join(", ") || "—"}
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-border bg-background p-6">
              <div className="flex items-center gap-2">
                <CircleDollarSign className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Payment summary</h2>
              </div>
              <div className="mt-6 space-y-3 text-sm">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>{formatPrice(shipping)}</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Tax</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Discount</span>
                  <span>{formatPrice(Number(order?.discount ?? 0))}</span>
                </div>
                <div className="flex items-center justify-between border-t border-border pt-3 text-base font-semibold">
                  <span>Grand total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-border bg-background p-6">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Next steps</h2>
              </div>
              <div className="mt-4 flex flex-col gap-3">
                {order ? (
                  <Link
                    href={`/orders/${order.id}/receipt`}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground"
                  >
                    <ReceiptText className="h-4 w-4" />
                    Download invoice
                  </Link>
                ) : null}
                <Link
                  href="/equipments"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground"
                >
                  Continue shopping
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              {errorMessage ? (
                <p className="mt-4 text-sm text-destructive">{errorMessage}</p>
              ) : null}
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
