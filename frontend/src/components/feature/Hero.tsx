"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  const heroSlides = [
    {
      id: 1,
      badge: "NEW ARRIVAL",
      title: "SAMSUNG GALAXY S23",
      subtitle: "Power in Your Pocket",
      description:
        "Experience stunning display, lightning-fast performance, and pro-grade cameras. Capture every moment and stay ahead with the latest smartphone technology.",
      buttonText: "BUY NOW",
      image: "/images/s23.png",
    },
    {
      id: 2,
      badge: "BEST SELLER",
      title: "IPHONE 15 PRO",
      subtitle: "Innovation at Hand",
      description:
        "Sleek design, exceptional camera system, and smooth performance. Stay connected, productive, and entertained with Apple's latest smartphone.",
      buttonText: "SHOP NOW",
      image: "/images/iphone15.png",
    },
    {
      id: 3,
      badge: "LIMITED EDITION",
      title: "SMART WATCH PRO",
      subtitle: "Health & Lifestyle",
      description:
        "Track your fitness, monitor your heart rate, and stay connected on the go. Perfect for a modern, active lifestyle.",
      buttonText: "EXPLORE",
      image: "/images/smartwatch.png",
    },
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % heroSlides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const slide = heroSlides[index];

  return (
    <section className="w-full min-h-screen flex items-center overflow-hidden relative">
      <div className="w-full max-w-7xl mx-auto px-6 md:px-8 lg:px-10">
        {/* ✅ ONE AnimatePresence wrapping ONE child */}
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.6 }}
            className="grid md:grid-cols-2 gap-10 items-center"
          >
            {/* IMAGE */}
            <motion.div
              initial={{
                x: index % 2 === 0 ? -150 : 150,
                opacity: 0,
              }}
              animate={{ x: 0, opacity: 1 }}
              exit={{
                x: index % 2 === 0 ? 150 : -150,
                opacity: 0,
              }}
              transition={{ duration: 0.7 }}
              className="flex justify-center md:justify-start"
            >
              <Image
                src={slide.image}
                alt={slide.title}
                width={480}
                height={600}
                className="max-w-full h-auto"
                priority
              />
            </motion.div>

            {/* CONTENT */}
            <motion.div
              initial={{
                x: index % 2 === 0 ? 150 : -150,
                opacity: 0,
              }}
              animate={{ x: 0, opacity: 1 }}
              exit={{
                x: index % 2 === 0 ? -150 : 150,
                opacity: 0,
              }}
              transition={{ duration: 0.7 }}
              className="text-center md:text-left"
            >
              <p className="text-sm text-gray-500 tracking-widest mb-2">
                {slide.badge}
              </p>

              <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
                {slide.title}
              </h1>

              <h2 className="text-xl md:text-2xl text-gray-500 mt-2">
                {slide.subtitle}
              </h2>

              <p className="text-gray-400 mt-6 max-w-md mx-auto md:mx-0">
                {slide.description}
              </p>

              <div className="mt-8">
                <Button className="px-12 py-4 lg:py-5 rounded-none">
                  {slide.buttonText}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
