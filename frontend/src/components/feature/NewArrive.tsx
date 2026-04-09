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
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
          New Products
        </h1>
        <p className="text-gray-500 mt-2 mb-8">
          Check out our latest arrivals in electronics. From cutting-edge
          gadgets to essential accessories, discover the newest additions to our
          collection.
        </p>

        {/* Products Grid */}
        {isLoading ? (
          <NewArrivalSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {newProducts?.map((product) => (
              <div
                key={product.id}
                className="border rounded-none p-4 hover:shadow-lg transition-shadow duration-300"
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

                {/* LINE UNDER IMAGE */}
                <div className="border-b border-gray-300 mb-4"></div>

                {/* PRODUCT DETAILS */}
                <h2 className="text-base text-muted-foreground font-semibold">
                  {product.name}
                </h2>
                <p className="text-gray-800 font-bold mt-2">
                  {product?.price
                    ? Number(product.price).toLocaleString()
                    : "0"}{" "}
                  <span className="text-green-500">ETB</span>
                </p>
                <BuyContactModule />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
