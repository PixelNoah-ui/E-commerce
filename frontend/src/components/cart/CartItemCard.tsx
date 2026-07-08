"use client";

import Image from "next/image";
import { Trash, Minus, Plus } from "lucide-react";
import { CartItem } from "@/types/cart";
import { Button } from "@/components/ui/button";

type Props = {
  item: CartItem;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
};

export default function CartItemCard({
  item,
  onIncrease,
  onDecrease,
  onRemove,
}: Props) {
  return (
    <div className="flex items-center gap-4 p-3 rounded-lg border bg-white shadow-sm">
      <div className="w-20 h-20 flex-shrink-0 rounded-md overflow-hidden bg-muted">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            width={80}
            height={80}
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-sm text-muted-foreground">
            No Image
          </div>
        )}
      </div>

      <div className="flex-1">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-sm font-medium">{item.name}</div>
            {item.variant && item.variant.length > 0 && (
              <div className="text-xs text-muted-foreground mt-1">
                {item.variant.map((v) => `${v.name}:${v.value}`).join(" • ")}
              </div>
            )}
          </div>
          <div className="text-sm font-semibold">{item.price.toFixed(2)}</div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onDecrease}
              aria-label="Decrease quantity"
            >
              <Minus size={14} />
            </Button>
            <div className="px-3 text-sm">{item.quantity}</div>
            <Button
              variant="outline"
              size="sm"
              onClick={onIncrease}
              aria-label="Increase quantity"
            >
              <Plus size={14} />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onRemove}
              className="text-red-600"
            >
              <Trash size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
