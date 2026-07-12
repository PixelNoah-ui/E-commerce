"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { motion } from "framer-motion";
import { useCart } from "@/hooks/useCart";
import CartItemCard from "@/components/cart/CartItemCard";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  const router = useRouter();
  const { items, increase, decrease, remove } = useCart();

  const subtotal = items.reduce((a, b) => a + b.price * b.quantity, 0);
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.07;
  const discount = 0;
  const total = subtotal + shipping + tax - discount;

  const handleCheckout = () => {
    if (!items.length) return;
    router.push("/checkout");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-2xl font-semibold">Shopping Cart</h2>
          {items.length === 0 ? (
            <div className="py-24 text-center">
              <p className="text-lg">Your cart is empty.</p>
              <Link href="/equipments" className="mt-4 inline-flex">
                <Button>Continue shopping</Button>
              </Link>
            </div>
          ) : (
            items.map((it) => (
              <motion.div
                key={it.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <CartItemCard
                  item={it}
                  onIncrease={() => increase(it.id)}
                  onDecrease={() => decrease(it.id)}
                  onRemove={() => remove(it.id)}
                />
              </motion.div>
            ))
          )}
        </div>

        <aside className="lg:col-span-1 sticky top-24">
          <div className="p-6 rounded-lg border bg-white shadow-sm">
            <h3 className="text-lg font-medium">Order Summary</h3>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Subtotal</span>
                <span>{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Shipping</span>
                <span>{shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Estimated Tax</span>
                <span>{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold">
                <span>Total</span>
                <span>{total.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-6">
              <input
                placeholder="Promo code"
                className="w-full rounded-md border px-3 py-2"
              />
              <Button className="mt-3 w-full" onClick={handleCheckout}>
                Proceed to checkout
              </Button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
