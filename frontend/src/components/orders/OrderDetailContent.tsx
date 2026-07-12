"use client";

import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  CircleCheckBig,
  Package,
  Printer,
  ReceiptText,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { OrderDetails } from "@/app/(api)/getOrderDetails";
import { formatPrice } from "@/lib/currency";

type OrderDetailContentProps = {
  order: OrderDetails;
  onReorder?: () => void;
};

const statusStyles: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  CONFIRMED: "bg-emerald-100 text-emerald-700",
  PROCESSING: "bg-sky-100 text-sky-700",
  SHIPPED: "bg-indigo-100 text-indigo-700",
  DELIVERED: "bg-emerald-100 text-emerald-700",
  CANCELLED: "bg-rose-100 text-rose-700",
};

const paymentStyles: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  PAID: "bg-emerald-100 text-emerald-700",
  FAILED: "bg-rose-100 text-rose-700",
  REFUNDED: "bg-slate-100 text-slate-700",
};

export default function OrderDetailContent({
  order,
  onReorder,
}: OrderDetailContentProps) {
  const subtotal = Number(order.subtotal ?? 0);
  const shipping = Number(order.shipping ?? 0);
  const tax = Number(order.tax ?? 0);
  const discount = Number(order.discount ?? 0);
  const total = Number(order.total ?? subtotal + shipping + tax - discount);
  const transactionId = order.payment?.transactionId || "—";
  const paymentMethod = order.payment?.provider || "Chapa";
  const estimatedDelivery = order.estimatedDelivery
    ? new Date(order.estimatedDelivery)
    : new Date(new Date(order.createdAt).getTime() + 5 * 86400000);

  const timeline = [
    { title: "Order placed", done: true, icon: CalendarDays },
    {
      title: "Payment confirmed",
      done:
        order.paymentStatus === "PAID" ||
        order.status === "CONFIRMED" ||
        order.status === "PROCESSING" ||
        order.status === "SHIPPED" ||
        order.status === "DELIVERED",
      icon: CircleCheckBig,
    },
    {
      title: "Processing",
      done:
        order.status === "PROCESSING" ||
        order.status === "SHIPPED" ||
        order.status === "DELIVERED",
      icon: Package,
    },
    {
      title: "Out for delivery",
      done: order.status === "SHIPPED" || order.status === "DELIVERED",
      icon: Truck,
    },
    {
      title: "Delivered",
      done: order.status === "DELIVERED",
      icon: CircleCheckBig,
    },
  ];

  const firstProduct = order.items?.[0]?.product;

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-border bg-card p-8 shadow-md sm:p-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
              Order details
            </p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight">
              {order.orderNumber}
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Placed on {new Date(order.createdAt).toLocaleDateString()} •{" "}
              {order.items?.length || 0} item(s)
            </p>
          </div>
          <div className="flex flex-wrap gap-3 items-center">
            <span
              className={`rounded-full px-3 py-1.5 text-sm font-medium ${statusStyles[order.status] || "bg-slate-100 text-slate-700"}`}
            >
              {order.status}
            </span>
            <span
              className={`rounded-full px-3 py-1.5 text-sm font-medium ${paymentStyles[order.paymentStatus] || "bg-slate-100 text-slate-700"}`}
            >
              {order.paymentStatus}
            </span>
            <div className="ml-2 text-sm text-muted-foreground">
              {order.items?.length} items
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-border bg-background p-4">
            <p className="text-sm text-muted-foreground">Invoice number</p>
            <p className="mt-1 font-semibold">{order.invoiceNumber || "—"}</p>
          </div>
          <div className="rounded-2xl border border-border bg-background p-4">
            <p className="text-sm text-muted-foreground">Payment method</p>
            <p className="mt-1 font-semibold">{paymentMethod}</p>
          </div>
          <div className="rounded-2xl border border-border bg-background p-4">
            <p className="text-sm text-muted-foreground">Estimated delivery</p>
            <p className="mt-1 font-semibold">
              {estimatedDelivery.toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Order timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {timeline.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={step.title} className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 flex h-10 w-10 items-center justify-center rounded-full ${step.done ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 border-b border-border/70 pb-4 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-medium">{step.title}</p>
                        {step.done ? (
                          <span className="text-xs text-primary">Complete</span>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            Pending
                          </span>
                        )}
                      </div>
                      {index === 0 ? (
                        <p className="mt-1 text-sm text-muted-foreground">
                          We received your order and it is currently being
                          prepared.
                        </p>
                      ) : null}
                      {index === 3 ? (
                        <p className="mt-1 text-sm text-muted-foreground">
                          Expected delivery by{" "}
                          {estimatedDelivery.toLocaleDateString()}.
                        </p>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {order.items?.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-4 rounded-2xl border border-border/70 bg-background p-4"
                >
                  {item.product?.imageUrl ? (
                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-border">
                      <Image
                        src={item.product.imageUrl}
                        alt={item.product.name || "Product"}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : null}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="font-medium">
                          {item.product?.name || "Product"}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Qty: {item.quantity}
                          {item.selectedSize ? ` • ${item.selectedSize}` : ""}
                          {item.selectedColor ? ` • ${item.selectedColor}` : ""}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          {formatPrice(item.total)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Unit {formatPrice(item.price)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment & delivery</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <div className="rounded-2xl border border-border/70 bg-background p-4">
                <p className="font-medium text-foreground">
                  Payment information
                </p>
                <p className="mt-2">Method: {paymentMethod}</p>
                <p className="mt-1">Transaction ID: {transactionId}</p>
                <p className="mt-1">Amount paid: {formatPrice(total)}</p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-background p-4">
                <p className="font-medium text-foreground">Shipping address</p>
                <p className="mt-2">{order.address?.fullName || "—"}</p>
                <p>{order.address?.address || "—"}</p>
                <p>
                  {[order.address?.city, order.address?.country]
                    .filter(Boolean)
                    .join(", ") || "—"}
                </p>
                <p>{order.address?.phone || "—"}</p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-background p-4">
                <p className="font-medium text-foreground">Billing address</p>
                <p className="mt-2">
                  {order.billingAddress?.fullName ||
                    order.address?.fullName ||
                    "—"}
                </p>
                <p>
                  {order.billingAddress?.address ||
                    order.address?.address ||
                    "—"}
                </p>
                <p>
                  {[
                    order.billingAddress?.city || order.address?.city,
                    order.billingAddress?.country || order.address?.country,
                  ]
                    .filter(Boolean)
                    .join(", ") || "—"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Totals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
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
                <span>{formatPrice(discount)}</span>
              </div>
              <div className="flex items-center justify-between border-t border-border pt-3 text-base font-semibold">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {onReorder ? (
                <Button type="button" onClick={onReorder}>
                  Buy again
                </Button>
              ) : null}
              <Link
                href={`/orders/${order.id}/receipt`}
                className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium transition hover:bg-muted"
              >
                <ReceiptText className="mr-2 h-4 w-4" />
                Download invoice
              </Link>
              <Button
                type="button"
                variant="outline"
                onClick={() => window.print()}
              >
                <Printer className="mr-2 h-4 w-4" />
                Print receipt
              </Button>
              {firstProduct?.id ? (
                <Link
                  href={`/products/${firstProduct.id}`}
                  className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium transition hover:bg-muted"
                >
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Buy this again
                </Link>
              ) : null}
              <Link
                href="/orders"
                className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium transition hover:bg-muted"
              >
                Continue shopping
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
