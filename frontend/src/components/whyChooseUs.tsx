"use client";

import Image from "next/image";

export default function WhyChooseUs() {
  return (
    <section className="w-full ">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-10">
        {/* LEFT IMAGE SECTION */}
        <div className=" relative w-full h-[500px] lg:h-[600px] basis-2/5">
          <Image
            src="/images/whyChooseImages.png"
            alt="electronics"
            fill
            className="object-contain relative z-10"
          />
        </div>

        {/* RIGHT CONTENT */}
        <div className="py-10 px-4 lg:px-0 basis-3/5">
          <p className="text-orange-500 font-semibold uppercase tracking-wide">
            Our Specialization
          </p>

          <h2 className="text-4xl font-bold mt-2 mb-10">
            Why Choose Abdu Electronics
          </h2>

          <div className="grid sm:grid-cols-2 gap-8">
            <FeatureCard
              icon="/icons/trophy.svg"
              title="Top Quality Electronics"
              desc="We provide original and high-performance devices from trusted brands."
            />

            <FeatureCard
              icon="/icons/dollar.svg"
              title="Affordable Prices"
              desc="Best deals on smartphones, laptops, and accessories."
            />

            <FeatureCard
              icon="/icons/laptop.svg"
              title="Latest Tech Devices"
              desc="Explore the newest smartphones, laptops, and modern gadgets."
            />

            <FeatureCard
              icon="/icons/support.svg"
              title="24/7 Customer Support"
              desc="We are always ready to help you anytime."
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================= COMPONENT ================= */

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex flex-col gap-4 items-center sm:items-start text-center sm:text-left">
      {/* BIG ICON */}
      <div className="w-16 h-16">
        <Image
          src={icon}
          alt={title}
          width={64}
          height={64}
          className="object-contain"
        />
      </div>

      {/* TEXT */}
      <div>
        <h4 className="font-semibold text-lg">{title}</h4>
        <p className="text-gray-500 text-sm mt-2">{desc}</p>
      </div>
    </div>
  );
}
