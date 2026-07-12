"use client";

import { useParams } from "next/navigation";
import { useOrderDetails } from "@/hooks/useOrders";
import ReceiptSkeleton from "@/components/orders/ReceiptSkeleton";

export default function OrderReceiptPage() {
  const params = useParams<{ id: string }>();
  const { data: order, isLoading, error } = useOrderDetails(params.id);

  if (isLoading) {
    return <ReceiptSkeleton />;
  }

  if (error || !order) {
    return (
      <div className="p-10 text-sm text-destructive">
        Unable to load receipt.
      </div>
    );
  }

  const subtotal = Number(order.subtotal ?? 0);
  const shipping = Number(order.shipping ?? 0);
  const tax = Number(order.tax ?? 0);
  const total = Number(order.total ?? subtotal + shipping + tax);

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <div className="rounded-3xl border border-border bg-white p-8 shadow-sm print:shadow-none">
        <div className="flex flex-col gap-6 border-b border-border pb-6 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
              Receipt
            </p>
            <h1 className="mt-2 text-3xl font-semibold">Abdu Electronics</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Professional invoice and receipt
            </p>
          </div>
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground">
              Invoice: {order.orderNumber}
            </p>
            <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
            <p>Payment: {order.paymentStatus}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div>
            <p className="text-sm font-semibold">Bill to</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {order.address?.fullName}
            </p>
            <p className="text-sm text-muted-foreground">
              {order.address?.address}
            </p>
            <p className="text-sm text-muted-foreground">
              {order.address?.city}, {order.address?.country}
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold">Order details</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Order number: {order.orderNumber}
            </p>
            <p className="text-sm text-muted-foreground">
              Transaction ID: {order.payment?.transactionId || "—"}
            </p>
            <p className="text-sm text-muted-foreground">
              Payment method: {order.payment?.provider || "Chapa"}
            </p>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border border-border">
          <table className="min-w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left">Item</th>
                <th className="px-4 py-3 text-left">Qty</th>
                <th className="px-4 py-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {order.items?.map((item) => (
                <tr key={item.id} className="border-t border-border/70">
                  <td className="px-4 py-3">
                    {item.product?.name || "Product"}
                  </td>
                  <td className="px-4 py-3">{item.quantity}</td>
                  <td className="px-4 py-3 text-right">
                    ETB {Number(item.total ?? 0).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-end">
          <div className="w-full max-w-sm space-y-2 rounded-2xl border border-border bg-background p-4 text-sm">
            <div className="flex items-center justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>ETB {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-muted-foreground">
              <span>Shipping</span>
              <span>ETB {shipping.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-muted-foreground">
              <span>Tax</span>
              <span>ETB {tax.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between border-t pt-2 text-base font-semibold">
              <span>Grand total</span>
              <span>ETB {total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6 text-sm text-muted-foreground">
          <p>Thank you for shopping with Abdu Electronics.</p>
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-lg border border-border bg-background px-4 py-2 font-medium text-foreground"
          >
            Print receipt
          </button>
        </div>
      </div>
    </main>
  );
}
