"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";

const newArrivalProducts = [
  {
    id: "1",
    name: "Samsung Galaxy S23",
    description: "Powerful smartphone with stunning display and camera.",
    price: 799.99,
    imageUrl: "/images/s23.png",
    categoryType: "smartphone",
  },
  {
    id: "2",
    name: "iPhone 15 Pro",
    description: "Sleek design, exceptional camera system, smooth performance.",
    price: 999.99,
    imageUrl: "/images/iphone15.png",
    categoryType: "smartphone",
  },
  {
    id: "3",
    name: "Smart Watch Pro",
    description: "Track your fitness and stay connected with this smartwatch.",
    price: 299.99,
    imageUrl: "/images/smartwatch.png",
    categoryType: "smartwatch",
  },
  {
    id: "4",
    name: "Wireless Headphones",
    description:
      "Immersive sound with noise cancellation and long battery life.",
    price: 199.99,
    imageUrl: "/images/headphones.png",
    categoryType: "accessories",
  },
];

export default function NewArriveProducts() {
  return (
    <div className="max-w-7xl mx-auto px-6  md:px-8 lg:px-10 my-16">
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
        New Products
      </h1>
      <p className="text-gray-500 mt-2 mb-8">
        Check out our latest arrivals in electronics. From cutting-edge gadgets
        to essential accessories, discover the newest additions to our
        collection.
      </p>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {newArrivalProducts.map((product) => (
          <div
            key={product.id}
            className="border rounded-none p-4 hover:shadow-lg transition-shadow duration-300"
          >
            {/* IMAGE */}
            <div className="relative w-full h-64 mb-4">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-contain"
              />
            </div>

            {/* LINE UNDER IMAGE */}
            <div className="border-b border-gray-300 mb-4"></div>

            {/* PRODUCT DETAILS */}
            <h2 className="text-base font-semibold">{product.name}</h2>
            <p className="text-gray-800 font-bold mt-2">${product.price}</p>
            <Button className="w-full py-5 rounded-none mt-4">Buy Now</Button>
          </div>
        ))}
      </div>
    </div>
  );
}
