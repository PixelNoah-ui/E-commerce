"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Smartphone,
  Laptop,
  Headphones,
  Watch,
  ArrowRight,
  Truck,
  ShieldCheck,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const AUTOPLAY_MS = 6000;

// Product categories shown as the small "halo" badges around the visual.
// Each slide below maps to one of these via the `category` key, and the
// active one is highlighted with a shared, animated fill.
const categories = [
  {
    key: "phones",
    label: "Smartphones",
    icon: Smartphone,
    position: "left-1/2 top-0",
  },
  {
    key: "laptops",
    label: "Laptops",
    icon: Laptop,
    position: "left-full top-1/2",
  },
  {
    key: "audio",
    label: "Audio",
    icon: Headphones,
    position: "left-1/2 top-full",
  },
  {
    key: "wearables",
    label: "Wearables",
    icon: Watch,
    position: "left-0 top-1/2",
  },
];

const slides = [
  {
    id: 1,
    category: "smartphones",
    eyebrow: "[ NEW ARRIVALS ]",
    line1: "FLAGSHIP PHONES",
    line2: "UNLOCKED FOR YOU",
    description:
      "The newest flagship smartphones, fully unlocked for any carrier. Pro-grade cameras, all-day battery, and displays that make everything look better.",
    image: "/images/iphone15.png",
    cta: "Shop Smartphones",
  },
  {
    id: 2,
    category: "laptops",
    eyebrow: "[ TOP RATED ]",
    line1: "POWER THAT",
    line2: "KEEPS UP",
    description:
      "From everyday browsing to heavy creative work, find a laptop that doesn't slow down. Fast processors, crisp displays, and battery life for a full day.",
    image: "/images/laptop.png",
    cta: "Shop Laptops",
  },
  {
    id: 3,
    category: "headphones",
    eyebrow: "[ STAFF PICK ]",
    line1: "SOUND THAT",
    line2: "MOVES YOU",
    description:
      "Studio-grade headphones and earbuds with active noise cancellation. Tuned for clarity, built for comfort, made to go anywhere with you.",
    image: "/images/headphones.png",
    cta: "Shop Audio",
  },
  {
    id: 4,
    category: "smartwatches",
    eyebrow: "[ LIMITED STOCK ]",
    line1: "WEAR YOUR",
    line2: "NEXT MOVE",
    description:
      "Smartwatches and fitness trackers that track your health, your workouts, and your notifications, all from your wrist.",
    image: "/images/smartwatch.png",
    cta: "Shop Wearables",
  },
];

const textVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? 48 : -48, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? -48 : 48, opacity: 0 }),
};

export default function HeroSection() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const slide = slides[index];

  const goTo = useCallback((nextIndex: number, dir: number) => {
    setDirection(dir);
    setIndex(((nextIndex % slides.length) + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    if (isPaused || shouldReduceMotion) return;
    const interval = setInterval(() => goTo(index + 1, 1), AUTOPLAY_MS);
    return () => clearInterval(interval);
  }, [index, isPaused, shouldReduceMotion, goTo]);

  return (
    <section
      className="relative w-full  overflow-hidden bg-background"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-32 -left-32 h-[28rem] w-[28rem] rounded-full bg-primary/10 blur-3xl"
          animate={
            shouldReduceMotion ? undefined : { x: [0, 40, 0], y: [0, 30, 0] }
          }
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-40 -right-20 h-[32rem] w-[32rem] rounded-full bg-accent/30 blur-3xl"
          animate={
            shouldReduceMotion ? undefined : { x: [0, -30, 0], y: [0, -20, 0] }
          }
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative mx-auto flex min-h-[75vh] w-full max-w-7xl flex-col justify-center px-6 py-16 md:px-10">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-10">
          {/* TEXT COLUMN */}
          <div className="order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span className="text-xs font-medium tracking-wide text-card-foreground">
                PixelShop
              </span>
            </motion.div>

            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={slide.id}
                custom={direction}
                variants={textVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.45, ease: "easeOut" }}
              >
                <p className="mb-4 font-mono text-xs font-medium tracking-[0.2em] text-primary">
                  {slide.eyebrow}
                </p>

                <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:text-5xl">
                  {slide.line1}
                  <br />
                  <span className="text-muted-foreground">{slide.line2}</span>
                </h1>

                <p className="mt-5 max-w-md text-sm leading-7 text-muted-foreground md:text-base">
                  {slide.description}
                </p>

                <div className="mt-9 flex flex-wrap items-center gap-4">
                  <Button size="lg" className="group rounded-full px-8" asChild>
                    <Link href={`/electronics/${slide.category}`}>
                      {slide.cta}
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full px-8"
                    asChild
                  >
                    <Link href="/equipments">Browse All</Link>
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* VISUAL COLUMN */}
          <div className="order-1 lg:order-2">
            <div className="relative mx-auto aspect-square w-full max-w-md">
              {/* Category halo badges */}
              {categories.map((cat) => {
                const Icon = cat.icon;
                const active = cat.key === slide.category;
                return (
                  <div
                    key={cat.key}
                    className={cn(
                      "absolute -translate-x-1/2 -translate-y-1/2",
                      cat.position,
                    )}
                  >
                    <div
                      className="relative flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card shadow-sm overflow-hidden"
                      title={cat.label}
                    >
                      {active && (
                        <motion.div
                          layoutId="activeCategoryGlow"
                          className="absolute inset-0 bg-primary"
                          transition={{
                            type: "spring",
                            stiffness: 280,
                            damping: 24,
                          }}
                        />
                      )}
                      <Icon
                        className={cn(
                          "relative z-10 h-5 w-5",
                          active
                            ? "text-primary-foreground"
                            : "text-muted-foreground",
                        )}
                      />
                    </div>
                  </div>
                );
              })}

              {/* Product card */}
              <div className="absolute inset-[12%] overflow-hidden rounded-[2rem] border border-border bg-card shadow-2xl">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={slide.id}
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.94 }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                    className="flex h-full w-full items-center justify-center p-10"
                  >
                    <Image
                      src={slide.image}
                      alt={`${slide.line1} ${slide.line2}`}
                      width={400}
                      height={400}
                      sizes="(max-width: 768px) 70vw, 400px"
                      className="h-auto w-full object-contain drop-shadow-xl"
                      priority={index === 0}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-16 flex items-center justify-center gap-6 lg:justify-start">
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => goTo(index - 1, -1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground transition hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-2">
            {slides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => goTo(i, i > index ? 1 : -1)}
                className="relative h-1.5 w-10 overflow-hidden rounded-full bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                {i === index && (
                  <motion.span
                    key={slide.id}
                    className="absolute inset-y-0 left-0 rounded-full bg-primary"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{
                      duration: AUTOPLAY_MS / 1000,
                      ease: "linear",
                    }}
                  />
                )}
              </button>
            ))}
          </div>

          <button
            type="button"
            aria-label="Next slide"
            onClick={() => goTo(index + 1, 1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground transition hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
