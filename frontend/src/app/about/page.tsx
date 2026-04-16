"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAddress } from "@/hooks/useAddress";
import WhyChooseUs from "@/components/whyChooseUs";

export default function AboutHero() {
  const { data: address, isLoading } = useAddress();

  return (
    <section className="relative w-full space-y-20 overflow-hidden">
      {/* ================= HERO ================= */}
      <div className="relative h-[70vh] w-full">
        <Image
          src="/images/iphone15.png"
          alt="Background"
          fill
          className="object-cover"
          priority
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/90" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          {/* ICON ROW */}
          <div className="flex items-center gap-6 mb-6">
            <Image src="/icons/laptop.svg" alt="" width={60} height={60} />
            <Image src="/icons/phone.svg" alt="" width={60} height={60} />
            <Image src="/icons/camera.svg" alt="" width={60} height={60} />
          </div>

          {/* TITLE */}
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            About Us
          </h1>

          {/* BADGE */}
          <span className="px-6 py-2 rounded-full border border-primary text-primary text-sm font-semibold mb-6">
            Who We Are
          </span>

          {/* BREADCRUMB */}
          <div className="flex items-center gap-3">
            <span className="bg-primary text-white px-4 py-1 text-sm font-semibold">
              HOME
            </span>
            <span className="text-white/70 text-sm font-semibold">
              ABOUT US
            </span>
          </div>
        </div>
      </div>
      {/* ================= SHOP LOCATION SECTION ================= */}
      <div className="relative pb-12 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* LEFT IMAGE - Shop Location */}
          <div className="relative w-full h-[500px]">
            <Image
              src="/images/electronics-seller.png" // Replace with actual shop location images
              alt="Abdu Electronics Shop Location"
              fill
              className="object-contain rounded-lg"
            />
          </div>

          <div className="flex flex-col space-y-8">
            {/* SMALL TITLE */}
            <span className="text-primary font-semibold uppercase tracking-wider text-sm">
              Visit Our Store
            </span>

            {/* BIG TITLE */}
            <h2 className="text-3xl md:text-4xl font-bold leading-tight">
              Find Us in Jimma
              <br /> Your Local Electronics Hub
            </h2>

            {/* DECOR */}
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <div className="w-10 h-[2px] bg-primary" />
                <div className="w-5 h-[2px] bg-primary" />
              </div>
              <div className="w-10 h-[2px] bg-primary" />
            </div>

            {/* TEXT */}
            <p className="text-gray-700 leading-relaxed">
              Located in the heart of Jimma, our physical store offers a
              hands-on experience where you can see, test, and purchase the
              latest electronics. Visit us to explore our wide range of products
              and get expert advice from our knowledgeable staff.
            </p>

            {/* LOCATION DETAILS */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Image src="/icons/globe.svg" alt="" width={24} height={24} />
                <div className="text-gray-700 flex items-center gap-3">
                  {address?.address},
                  <span>{address?.location || "Jimma, Ethiopia"}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Image src="/icons/phone.svg" alt="" width={24} height={24} />
                <span className="text-gray-700">
                  {address?.phone || "+251 911 123 456"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Image src="/icons/time.svg" alt="" width={24} height={24} />
                <span className="text-gray-700">Mon - Sat: 9AM - 7PM</span>
              </div>
            </div>

            {/* CTA */}
            <div>
              <Button className="px-7 rounded-none" asChild>
                <Link href="/contact"> Get Directions</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* ================= ABOUT CONTENT ================= */}
      <div className="relative pb-12 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* LEFT IMAGE */}
          <div className="relative w-full h-[500px]">
            <Image
              src="/images/s23.png"
              alt="Abdu Electronics Store"
              fill
              className="object-contain"
            />
          </div>

          {/* RIGHT CONTENT */}
          <div className="flex flex-col space-y-8">
            {/* SMALL TITLE */}
            <span className="text-primary font-semibold uppercase tracking-wider text-sm">
              About Abdu Electronics
            </span>

            {/* BIG TITLE */}
            <h2 className="text-3xl md:text-4xl font-bold leading-tight">
              Your Trusted Electronics Marketplace
              <br /> Buy & Sell Easily in Ethiopia
            </h2>

            {/* DECOR */}
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <div className="w-10 h-[2px] bg-primary" />
                <div className="w-5 h-[2px] bg-primary" />
              </div>
              <div className="w-10 h-[2px] bg-primary" />
            </div>

            {/* TEXT */}
            <p className="text-gray-700 leading-relaxed">
              At Abdu Electronics, we provide a reliable platform to buy and
              sell electronics across Ethiopia. From laptops and phones to
              cameras, we make technology accessible, affordable, and
              trustworthy.
            </p>

            {/* FEATURES */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* FEATURE 1 */}
              <div className="flex gap-4">
                <div className="p-3 rounded-lg">
                  <Image
                    src="/icons/dollar.svg"
                    alt=""
                    width={32}
                    height={32}
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Affordable Prices</h3>
                  <p className="text-sm text-gray-600">
                    Competitive rates for buying, selling, or renting
                    electronics.
                  </p>
                </div>
              </div>

              {/* FEATURE 2 */}
              <div className="flex gap-4">
                <div className="p-3 rounded-lg">
                  <Image
                    src="/icons/laptop.svg"
                    alt=""
                    width={32}
                    height={32}
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Wide Selection</h3>
                  <p className="text-sm text-gray-600">
                    From laptops and phones to cameras and accessories.
                  </p>
                </div>
              </div>

              {/* FEATURE 3 */}
              <div className="flex gap-4">
                <div className="p-3 rounded-lg">
                  <Image
                    src="/icons/shield.svg"
                    alt=""
                    width={32}
                    height={32}
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Trusted Service</h3>
                  <p className="text-sm text-gray-600">
                    Secure transactions with verified sellers and buyers.
                  </p>
                </div>
              </div>

              {/* FEATURE 4 */}
              <div className="flex gap-4">
                <div className="p-3 rounded-lg">
                  <Image src="/icons/truck.svg" alt="" width={32} height={32} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Fast Delivery</h3>
                  <p className="text-sm text-gray-600">
                    Quick shipping across Addis Ababa and beyond.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div>
              <Button className="px-7 rounded-none" asChild>
                <Link href="/equipments"> Explore Products</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 px-6 text-center">
          {[
            { value: "500+", label: "Customers", icon: "/icons/user.svg" },
            { value: "1000+", label: "Products", icon: "/icons/laptop.svg" },
            { value: "50+", label: "Sellers", icon: "/icons/store.svg" },
            { value: "4.8★", label: "Rating", icon: "/icons/star.svg" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.6,
                delay: i * 0.2, // stagger effect
                ease: "easeOut",
              }}
              viewport={{ once: true }}
              className="flex flex-col items-center space-y-3"
            >
              {/* BIG ICON */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <Image src={stat.icon} alt="" width={94} height={94} />
              </motion.div>

              {/* SMALL TEXT */}
              <p className="text-sm text-gray-500 uppercase tracking-wide">
                {stat.label}
              </p>

              {/* VALUE */}
              <span className="text-xl font-semibold text-primary">
                {stat.value}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
      <WhyChooseUs />
    </section>
  );
}
