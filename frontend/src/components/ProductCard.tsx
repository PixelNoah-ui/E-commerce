import Image from "next/image";
import { Button } from "./ui/button";
import BuyContactModule from "./BuyContactModule";

type ProductCardProps = {
  product: {
    id: string | number;
    name?: string;
    description?: string;
    price?: string | number;
    imageUrl?: string;
    image_url?: string;
    category?: string;
  };
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div
      key={product.id}
      className="border rounded-xl p-4 hover:shadow-lg transition-all duration-300 flex flex-col h-full bg-white"
    >
      {/* IMAGE */}
      <div className="relative w-full h-64 mb-4">
        <Image
          src={product.imageUrl || "/images/default-product.png"}
          alt={product.name || "New Product"}
          fill
          className="object-contain"
        />
      </div>

      {/* CONTENT */}
      <div className="flex flex-col flex-grow">
        {/* NAME */}
        <h2 className="text-base font-semibold text-gray-900 line-clamp-2">
          {product.name}
        </h2>

        {/* DESCRIPTION */}
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
          {product.description || "No description available"}
        </p>

        {/* 🔥 BOTTOM SECTION (ALWAYS STICKS DOWN) */}
        <div className="mt-auto pt-4 border-t border-gray-200">
          {/* PRICE */}
          <p className="text-gray-900 font-semibold text-lg">
            {product?.price
              ? Number(product.price).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              : "0.00"}{" "}
            <span className="text-green-500 text-sm font-medium">ETB</span>
          </p>

          {/* BUTTON */}
          <div className="mt-3">
            <BuyContactModule />
          </div>
        </div>
      </div>
    </div>
  );
}
