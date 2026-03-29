import Image from "next/image";
import { Button } from "./ui/button";
import BuyContactModule from "./BuyContactModule";

type ProductCardProps = {
  product: {
    id: string | number;
    name?: string;
    description?: string;
    price?: number;
    imageUrl?: string;
    image_url?: string;
    category?: string;
  };
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div
      key={product.id}
      className="border rounded-none p-4 hover:shadow-lg transition-shadow duration-300"
    >
      {/* IMAGE */}
      <div className="relative w-full h-64 mb-4">
        <Image
          src={
            product?.imageUrl || product?.image_url || "/images/placeholder.png"
          }
          alt={product?.name || "Product Image"}
          fill
          className="object-contain"
        />
      </div>

      {/* LINE UNDER IMAGE */}
      <div className="border-b border-gray-300 mb-4"></div>

      {/* PRODUCT DETAILS */}
      <h2 className="text-base font-semibold">{product.name}</h2>
      <p className="text-gray-800 font-bold mt-2">${product.price}</p>
      <BuyContactModule />
    </div>
  );
}
