"use client";

import Image from "next/image";
import Link from "next/link";

const categories = [
  {
    id: "1",
    name: "Smartphones",
    description: "Explore the latest smartphones from top brands.",
    imageUrl: "/images/s23.png",
    slug: "smartphones",
  },
  {
    id: "2",
    name: "Laptops",
    description: "High performance laptops for work, gaming, and study.",
    imageUrl: "/images/laptop.png", // placeholder
    slug: "laptops",
  },
  {
    id: "3",
    name: "Smartwatches",
    description: "Track your fitness and stay connected in style.",
    imageUrl: "/images/smartwatch.png",
    slug: "smartwatches",
  },
  {
    id: "4",
    name: "Audio & Headphones",
    description: "Immersive sound experience for music lovers.",
    imageUrl: "/images/iphone15.png",
    slug: "audio-headphones",
  },
];

export default function CategoryProducts() {
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-10 my-16">
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800">
        Shop by Category
      </h1>
      <p className="text-gray-500 text-sm mt-2 mb-10">
        Explore products by type and find what fits your needs. Click any
        category to see all products in that type.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
        {categories.map((category) => (
          <Link
            href={`/electronics/${category.slug}`}
            key={category.id}
            className="group border rounded-2xl p-6 bg-white hover:shadow-2xl transition-all duration-500 flex flex-col items-center text-center"
          >
            <div className="relative w-36 h-36 mb-5 bg-gradient-to-tr from-gray-100 to-gray-200 rounded-full flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
              <Image
                src={category.imageUrl}
                alt={category.name}
                fill
                className="object-contain p-4"
              />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 group-hover:text-primary transition-colors duration-300">
              {category.name}
            </h2>
            <p className="text-gray-500 text-sm mt-2">{category.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
