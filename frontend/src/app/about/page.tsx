"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAddress } from "@/hooks/useAddress";
import WhyChooseUs from "@/components/whyChooseUs";

/* SVG Icon Component */
function SvgIcon({
  src,
  alt,
  size = 5,
}: {
  src: string;
  alt: string;
  size?: number;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={`h-${size} w-${size}`}
      style={{ height: `${size * 4}px`, width: `${size * 4}px` }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Static content                                                     */
/* ------------------------------------------------------------------ */

const heroIcons = [
  "/icons/products.svg",
  "/icons/phone.svg",
  "/icons/camera.svg",
];

const features = [
  {
    icon: "/icons/dollar.svg",
    title: "Affordable Prices",
    description:
      "Competitive rates for buying, selling, or renting electronics.",
  },
  {
    icon: "/icons/products.svg",
    title: "Wide Selection",
    description: "From laptops and phones to cameras and accessories.",
  },
  {
    icon: "/icons/shield.svg",
    title: "Trusted Service",
    description: "Secure transactions with verified sellers and buyers.",
  },
  {
    icon: "/icons/truck.svg",
    title: "Fast Delivery",
    description: "Quick shipping across Addis Ababa and beyond.",
  },
];

const stats = [
  { value: "500+", label: "Customers", icon: "/icons/user.svg" },
  { value: "1,000+", label: "Products", icon: "/icons/products.svg" },
  { value: "50+", label: "Sellers", icon: "/icons/store.svg" },
  { value: "4.8", label: "Avg. Rating", icon: "/icons/star.svg" },
];

/* ------------------------------------------------------------------ */
/*  Signature element — a small "circuit trace" used as a section mark */
/* ------------------------------------------------------------------ */

function CircuitMark() {
  return (
    <div className="flex items-center gap-1.5" aria-hidden="true">
      <span className="h-px w-8 bg-primary" />
      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
      <span className="h-px w-3 bg-border" />
    </div>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <span className="text-sm font-semibold uppercase tracking-wider text-primary">
        {children}
      </span>
      <CircuitMark />
    </div>
  );
}

export default function AboutHero() {
  const { data: address, isLoading } = useAddress();

  return (
    <section className="relative w-full overflow-hidden">
      {/* ================= HERO ================= */}
      {/* `dark` is scoped locally so the overlay always reads correctly on
          top of the photo, regardless of the site's active theme. */}
      <div className="dark relative flex h-[80vh] min-h-[560px] w-full items-center justify-center overflow-hidden">
        <Image
          src="/images/iphone15.png"
          alt="Latest devices on display at PixelShop"
          fill
          className="object-cover"
          priority
        />

        {/* Overlay — built entirely from theme tokens */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-transparent to-background/90" />

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-10 flex flex-col items-center px-4 text-center"
        >
          {/* ICON ROW */}
          <div className="mb-8 flex items-center gap-4">
            {heroIcons.map((iconPath, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="flex h-14 w-14 items-center justify-center rounded-xl border border-border bg-card/30 backdrop-blur-sm"
              >
                <SvgIcon src={iconPath} alt="Feature icon" size={6} />
              </motion.div>
            ))}
          </div>

          {/* BADGE */}
          <span className="mb-6 inline-flex items-center rounded-full border border-primary/40 bg-primary/10 px-5 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
            Who We Are
          </span>

          {/* TITLE */}
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            About Us
          </h1>

          {/* SUPPORTING LINE */}
          <p className="mt-5 max-w-md text-sm text-muted-foreground sm:text-base">
            PixelShop connects shoppers across Ethiopia and Dubai with a modern
            electronics marketplace and reliable shipping to customers in
            Ethiopia.
          </p>

          {/* BREADCRUMB */}
          <nav
            aria-label="Breadcrumb"
            className="mt-8 flex items-center gap-2 text-sm font-medium"
          >
            <Link
              href="/"
              className="rounded-sm text-foreground/80 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Home
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-primary">About Us</span>
          </nav>
        </motion.div>
      </div>

      {/* ================= SHOP LOCATION SECTION ================= */}
      <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* LEFT IMAGE - Shop Location */}
          <div className="relative">
            <div className="relative h-[420px] w-full overflow-hidden rounded-2xl border border-border bg-muted/30 sm:h-[480px]">
              <Image
                src="/images/electronics-seller.png"
                alt="PixelShop shop location in Dubai"
                fill
                className="object-contain p-8"
              />
            </div>

            {/* Floating rating chip */}
            <div className="absolute -bottom-6 left-8 flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 shadow-md">
              <SvgIcon src="/icons/star.svg" alt="Star rating" size={4} />
              <span className="text-sm font-medium text-foreground">
                4.8 rated by customers
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <Eyebrow>Visit Our Store</Eyebrow>

            {/* BIG TITLE */}
            <h2 className="text-3xl font-bold leading-tight text-foreground md:text-4xl">
              Find Us in Dubai
              <br /> Your Local Electronics Hub
            </h2>

            {/* TEXT */}
            <p className="leading-relaxed text-muted-foreground">
              Our physical store in Dubai offers a hands-on experience where you
              can see, test, and purchase the latest electronics. We ship
              products to customers in Ethiopia — contact our Dubai team for
              orders and shipping details.
            </p>

            {/* LOCATION DETAILS */}
            <div className="divide-y divide-border rounded-xl border border-border bg-card">
              <div className="flex items-start gap-4 p-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <SvgIcon src="/icons/globe.svg" alt="Location" size={5} />
                </span>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">
                    Store Address
                  </p>
                  {isLoading ? (
                    <div className="h-4 w-44 animate-pulse rounded bg-muted" />
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {address?.address ? `${address.address}, ` : ""}
                      {address?.location || "Dubai, UAE"}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-4 p-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <SvgIcon src="/icons/phone.svg" alt="Phone" size={5} />
                </span>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">Call Us</p>
                  {isLoading ? (
                    <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {address?.phone || "Contact via website"}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-4 p-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <SvgIcon src="/icons/truck.svg" alt="Shipping" size={5} />
                </span>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">
                    Shipping
                  </p>
                  <p className="text-sm text-muted-foreground">
                    We ship to Ethiopia — delivery and customs info available on
                    our website.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <SvgIcon src="/icons/time.svg" alt="Working hours" size={5} />
                </span>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">
                    Working Hours
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Mon – Sat: 9AM – 7PM
                  </p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div>
              <Button className="rounded-none px-7" asChild>
                <Link href="/contact">Get Directions</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= ABOUT CONTENT ================= */}
      <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* LEFT IMAGE */}
          <div className="relative h-[420px] w-full overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-muted to-background sm:h-[480px]">
            <Image
              src="/images/s23.png"
              alt="PixelShop flagship product"
              fill
              className="object-contain p-10"
            />
          </div>

          {/* RIGHT CONTENT */}
          <div className="flex flex-col gap-8">
            <Eyebrow>About PixelShop</Eyebrow>

            {/* BIG TITLE */}
            <h2 className="text-3xl font-bold leading-tight text-foreground md:text-4xl">
              Your Trusted Electronics Marketplace
              <br /> Buy &amp; Sell Easily in Ethiopia
            </h2>

            {/* TEXT */}
            <p className="leading-relaxed text-muted-foreground">
              At PixelShop, we provide a reliable online platform to shop for
              electronics across Ethiopia. From laptops and phones to cameras,
              we make technology accessible, affordable, and trustworthy.
            </p>

            {/* FEATURES */}
            <div className="grid gap-4 sm:grid-cols-2">
              {features.map((feature) => (
                <motion.div
                  key={feature.title}
                  whileHover={{ y: -3 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="flex gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <SvgIcon src={feature.icon} alt={feature.title} size={5} />
                  </span>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <div>
              <Button className="rounded-none px-7" asChild>
                <Link href="/equipments">Explore Products</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= STATS ================= */}
      <div className="border-y border-border bg-muted/30 py-16">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-y-12 px-6 md:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
              viewport={{ once: true }}
              className={`flex flex-col items-center gap-3 text-center ${
                i !== 0 ? "md:border-l md:border-border" : ""
              }`}
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-lg border border-border bg-background text-primary shadow-sm">
                <SvgIcon src={stat.icon} alt={stat.label} size={5} />
              </span>
              <span className="text-3xl font-bold text-foreground">
                {stat.value}
              </span>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ================= CLOSING CTA ================= */}
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="flex flex-col items-center gap-6 rounded-2xl border border-border bg-card px-8 py-14 text-center sm:px-14">
          <CircuitMark />
          <h2 className="max-w-xl text-2xl font-bold text-foreground sm:text-3xl">
            Ready to find your next device?
          </h2>
          <p className="max-w-md text-sm text-muted-foreground sm:text-base">
            Browse listings from verified sellers, or visit our Dubai store for
            hands-on advice.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button className="rounded-none px-7" asChild>
              <Link href="/equipments">Explore Products</Link>
            </Button>
            <Button variant="outline" className="rounded-none px-7" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </div>

      <WhyChooseUs />
    </section>
  );
}
