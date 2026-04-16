"use client";

import NewArrivalSkeleton from "@/components/NewArrivalSkeleton";
import BuyContactModule from "../BuyContactModule";
import Image from "next/image";
import useGetNewProducts from "@/hooks/useProducts";

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
                      <span className="text-green-500 text-sm font-medium">
                        ETB
                      </span>
                    </p>

                    {/* BUTTON */}
                    <div className="mt-3">
                      <BuyContactModule />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
