"use client";

import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";
import formatPrice from "@/lib/currency";
import specIcons from "./specIcons";
import { ProductType } from "@/types/Types";

type ProductCardProps = {
  product: ProductType;
};

export default function ProductCard({ product }: ProductCardProps) {
  const cart = useCart();
  const specs = product.specifications || {};

  return (
    <div className="border p-4 bg-white hover:shadow-lg transition-all duration-300 flex flex-col h-full">
      {/* IMAGE (fixed height) */}
      <div className="relative w-full h-70  overflow-hidden ">
        <Image
          src={
            product.imageUrl || product.image_url || "/images/headphones.png"
          }
          alt={product.name || "Product Image"}
          fill
          className="object-contain"
        />
      </div>

      {/* CONTENT */}
      <div className="flex flex-col flex-1">
        {/* NAME */}
        <h2 className="font-semibold text-sm text-gray-900 line-clamp-2 mb-2">
          {product.name || "Unknown Product"}
        </h2>

        {/* DESCRIPTION */}
        <p className="text-xs text-gray-500 mb-1 line-clamp-2">
          {product.description || "No description available."}
        </p>

        {/* SPEC GRID */}
        <div className="grid grid-cols-2 gap-3 pb-2 text-sm text-gray-700">
          {Object.entries(specs)
            .slice(0, 6)
            .map(([key, value]) => (
              <div key={key} className="flex items-center gap-2">
                <Image
                  src={specIcons[key] || specIcons.default}
                  alt={key}
                  width={18}
                  height={18}
                />

                <span className="truncate">{value}</span>
              </div>
            ))}
        </div>

        {/* BOTTOM (always fixed at bottom) */}
        <div className="mt-auto pt-3 border-t border-gray-200">
          <p className="text-lg font-semibold">{formatPrice(product.price)}</p>

          <div className="mt-2">
            <Button
              className="w-full rounded-none"
              onClick={() => {
                if (!product.id) return;
                cart.addItem({
                  productId: product.id,
                  name: product.name || "Product",
                  price:
                    typeof product.price === "string"
                      ? Number(product.price)
                      : product.price || 0,
                  image:
                    product.imageUrl ||
                    product.image_url ||
                    "/images/headphones.png",
                  variant: [],
                  quantity: 1,
                });
                toast.success("Added to cart");
              }}
            >
              <div className="flex items-center justify-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
