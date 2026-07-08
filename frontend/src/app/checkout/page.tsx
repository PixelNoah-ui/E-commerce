"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Lock, ShieldCheck, ShoppingBag, Truck } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
).replace(/\/$/, "");

function buildApiUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return API_URL.includes("/api/v1")
    ? `${API_URL}${normalizedPath}`
    : `${API_URL}/api/v1${normalizedPath}`;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clear } = useCart();
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState("");

  const subtotal = useMemo(
    () => items.reduce((total, item) => total + item.price * item.quantity, 0),
    [items],
  );
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = Number((subtotal * 0.07).toFixed(2));
  const total = Number((subtotal + shipping + tax).toFixed(2));

  const handleCheckout = async () => {
    if (!items.length) {
      setError("Your cart is empty.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth");
      return;
    }

    setIsChecking(true);
    setError("");

    try {
      const res = await fetch(buildApiUrl("/checkout/validate"), {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            name: item.name,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Checkout validation failed");
      }

      clear();
      router.push("/checkout/success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
    } finally {
      setIsChecking(false);
    }
  };

  if (!items.length) {
    return (
      <main className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-4 py-16 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <ShoppingBag className="h-8 w-8" />
        </div>
        <h1 className="text-3xl font-semibold">Your cart is empty</h1>
        <p className="mt-3 max-w-md text-sm text-muted-foreground">
          Add a few products to your cart and come back here when you are ready
          to continue.
        </p>
        <Link
          href="/equipments"
          className="mt-6 inline-flex items-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
        >
          Continue shopping
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 lg:px-6">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Lock className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
            Secure Checkout
          </p>
          <h1 className="text-3xl font-semibold">Complete your order</h1>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-xl border border-border/70 bg-muted/20 p-4"
                >
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold">
                    {(item.price * item.quantity).toFixed(2)} ETB
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Delivery info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-3 rounded-xl border border-border/70 bg-background p-4">
                <Truck className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-foreground">
                    Fast delivery across Ethiopia
                  </p>
                  <p>
                    We confirm your order quickly and share tracking details
                    after payment confirmation.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl border border-border/70 bg-background p-4">
                <ShieldCheck className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-foreground">
                    Protected checkout
                  </p>
                  <p>
                    Only signed-in users can place an order. Your session is
                    verified before checkout.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Subtotal</span>
              <span>{subtotal.toFixed(2)} ETB</span>
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Shipping</span>
              <span>{shipping.toFixed(2)} ETB</span>
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Estimated tax</span>
              <span>{tax.toFixed(2)} ETB</span>
            </div>
            <div className="flex items-center justify-between border-t pt-3 text-base font-semibold">
              <span>Total</span>
              <span>{total.toFixed(2)} ETB</span>
            </div>

            {error ? (
              <p className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </p>
            ) : null}

            <Button
              className="w-full"
              onClick={handleCheckout}
              disabled={isChecking}
            >
              {isChecking ? "Validating order..." : "Place order"}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              By placing this order, you agree to our terms and conditions.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
