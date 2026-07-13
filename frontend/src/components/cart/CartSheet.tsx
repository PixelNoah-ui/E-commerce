"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/hooks/useCart";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import CartItemCard from "./CartItemCard";

export default function CartSheet() {
  const router = useRouter();
  const { items, itemsCount, increase, decrease, remove, clear } = useCart();

  const subtotal = items.reduce((a, b) => a + b.price * b.quantity, 0);

  const handleCheckout = () => {
    if (!items.length) return;

    router.push("/checkout");
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button aria-label="Open cart" className="p-2 relative">
          <ShoppingCart size={24} className="text-slate-700" />
          {itemsCount > 0 && (
            <span className="absolute -right-2 -top-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-semibold text-white">
              {itemsCount > 9 ? "9+" : itemsCount}
            </span>
          )}
        </button>
      </SheetTrigger>

      <SheetContent side="right" className="w-full max-w-md">
        <div className="flex flex-col h-full">
          <div className="px-6 py-5 border-b">
            <h3 className="text-lg font-semibold">Your Cart</h3>
          </div>

          <div className="flex-1 overflow-auto p-4 space-y-3">
            {items.length === 0 ? (
              <div className="text-center py-10">
                <Image
                  src="/images/empty-cart.png"
                  alt="Empty"
                  width={180}
                  height={120}
                />
                <p className="mt-4 text-sm text-muted-foreground">
                  Your cart is empty.
                </p>
                <Button
                  className="mt-4"
                  onClick={() => toast.message("Start shopping")}
                >
                  Continue Shopping
                </Button>
              </div>
            ) : (
              items.map((it) => (
                <motion.div
                  key={it.id}
                  initial={{ opacity: 0, y: 6 }}
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

          <div className="sticky bottom-0 border-t bg-white p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Subtotal</div>
              <div className="font-semibold">{subtotal.toFixed(2)}</div>
            </div>
            <div className="mt-3 flex gap-2">
              <SheetClose asChild>
                <Button className="flex-1" onClick={handleCheckout}>
                  Checkout
                </Button>
              </SheetClose>
              <Button variant="ghost" onClick={() => clear()} className="">
                Clear
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
