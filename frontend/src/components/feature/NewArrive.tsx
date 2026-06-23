"use client";

import NewArrivalSkeleton from "@/components/NewArrivalSkeleton";
import BuyContactModule from "../BuyContactModule";
import Image from "next/image";
import specIcons from "../specIcons";
import useGetNewProducts from "@/hooks/useProducts";
import ProductCard from "../ProductCard";

export default function NewArriveProducts() {
  const { isLoading, data: newProducts } = useGetNewProducts();

  return (
    <div className="bg-slate-50 pt-2 pb-5">
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-10 my-16">
        {/* HEADER */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
          New Products
        </h1>

        <p className="text-gray-500 mt-2 mb-8">
          Check out our latest arrivals in electronics. From cutting-edge
          gadgets to essential accessories, discover the newest additions to our
          collection.
        </p>

        {/* PRODUCTS */}
        {isLoading ? (
          <NewArrivalSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 items-stretch">
            {newProducts?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
