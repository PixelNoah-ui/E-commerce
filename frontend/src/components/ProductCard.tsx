"use client";

import Image from "next/image";
import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { Button } from "./ui/button";
import { useAddress } from "@/hooks/useAddress";
import formatPrice from "@/lib/currency";
import specIcons from "./specIcons";
import { ProductType } from "@/types/Types";

type ProductCardProps = {
  product: ProductType;
};

export default function ProductCard({ product }: ProductCardProps) {
  const { data: address } = useAddress();
  const specs = product.specifications || {};
  const phone = address?.phone || "+251911477218";
  const whatsappNumber = phone.replace(/\D/g, "");
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

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
            <Button asChild className="w-full rounded-none">
              <Link
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2"
              >
                <MessageSquare className="h-4 w-4" />
                Buy Now
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
