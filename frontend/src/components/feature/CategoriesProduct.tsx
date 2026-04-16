"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const categories = [
  // 📱 ELECTRONICS
  {
    id: "1",
    name: "Smartphones",
    description: "Latest Android & iPhone devices",
    imageUrl: "/images/s23.png",
    category: "electronics",
    slug: "smartphones",
  },
  {
    id: "2",
    name: "Laptops",
    description: "Powerful laptops for work & gaming",
    imageUrl: "/images/laptop.png",
    category: "electronics",
    slug: "laptops",
  },
  {
    id: "3",
    name: "Smartwatches",
    description: "Stay connected & track your health",
    imageUrl: "/images/smartwatch.png",
    category: "electronics",
    slug: "smartwatches",
  },
  {
    id: "4",
    name: "Headphones ",
    description: "Headphones, speakers & sound systems",
    imageUrl: "/images/headphones.png",
    category: "electronics",
    slug: "headphones",
  },

  // ❄️ HOME APPLIANCES
  {
    id: "5",
    name: "Refrigerators",
    description: "Energy-efficient cooling solutions",
    imageUrl: "/images/refrigerator.png",
    category: "electronics",
    slug: "refrigerators",
  },
  {
    id: "6",
    name: "Air Conditioners",
    description: "Stay cool with modern AC units",
    imageUrl: "/images/ac.png",
    category: "electronics",
    slug: "air-conditioners",
  },
  {
    id: "7",
    name: "Washing Machines",
    description: "Automatic & semi-automatic washers",
    imageUrl: "/images/washing-machines.png",
    category: "electronics",
    slug: "washing-machines",
  },
];

const loopedCategories = [...categories, ...categories];

export default function CategoryProducts() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const half = container.scrollWidth / 2;
    container.scrollLeft = half;
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const half = container.scrollWidth / 2;
    const speed = 0.6;
    let frameId: number;

    const autoScroll = () => {
      if (!isPaused) {
        container.scrollLeft += speed;
        if (container.scrollLeft >= container.scrollWidth - 1) {
          container.scrollLeft -= half;
        }
      }
      frameId = requestAnimationFrame(autoScroll);
    };

    frameId = requestAnimationFrame(autoScroll);
    return () => cancelAnimationFrame(frameId);
  }, [isPaused]);

  const normalizeScroll = (value: number, half: number) => {
    const offset = value - half;
    return (((offset % half) + half) % half) + half;
  };

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;

    const container = scrollRef.current;
    const half = container.scrollWidth / 2;
    const amount = 300;

    const newScroll =
      direction === "left"
        ? container.scrollLeft - amount
        : container.scrollLeft + amount;

    container.scrollLeft = normalizeScroll(newScroll, half);
    setIsPaused(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-10 my-16 relative">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
        Shop by Category
      </h1>
      <p className="text-gray-500 text-sm mt-2 mb-6">
        Browse products by category and find the best deals for your needs.
      </p>

      <div className="relative">
        {/* LEFT */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white shadow-md hover:bg-gray-100"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>

        {/* SCROLL */}
        <div
          ref={scrollRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          className="flex gap-6 overflow-x-auto py-4 scroll-smooth"
          style={{ scrollbarWidth: "none" }}
        >
          {loopedCategories.map((item, index) => (
            <Link
              key={`${item.id}-${index}`}
              href={`/${item.category}/${item.slug}`}
              className="min-w-[250px] flex-shrink-0 group border rounded-2xl p-6 bg-white hover:shadow-2xl transition-all duration-500 flex flex-col items-center text-center"
            >
              <div className="relative w-36 h-36 mb-5 bg-gradient-to-tr from-gray-100 to-gray-200 rounded-full flex items-center justify-center group-hover:scale-105 transition">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  className="object-contain p-4"
                />
              </div>

              <h2 className="text-xl font-semibold text-gray-800 group-hover:text-primary">
                {item.name}
              </h2>

              <p className="text-gray-500 text-sm mt-2">{item.description}</p>
            </Link>
          ))}
        </div>

        {/* RIGHT */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white shadow-md hover:bg-gray-100"
        >
          <ChevronRight className="w-6 h-6 text-gray-700" />
        </button>
      </div>
    </div>
  );
}
