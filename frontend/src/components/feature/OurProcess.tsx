import Image from "next/image";

const processSteps = [
  {
    step: "Step 1",
    title: "Contact Owner via WhatsApp",
    description:
      "Start by messaging the owner directly on WhatsApp to check product availability, price, and details instantly.",
    icon: "/icons/whatsapp.svg",
  },
  {
    step: "Step 2",
    title: "Chat & Confirm Order",
    description:
      "Discuss with our team, confirm your selected product, and finalize all order details before processing.",
    icon: "/icons/chat.svg",
  },
  {
    step: "Step 3",
    title: "Place Your Order",
    description:
      "Once confirmed, your order is officially registered and prepared for delivery with full tracking support.",
    icon: "/icons/order.svg",
  },
  {
    step: "Step 4",
    title: "Receive Your Delivery",
    description:
      "Get your electronics delivered safely and quickly to your location anywhere in Ethiopia.",
    icon: "/icons/truck.svg",
  },
];

export default function OurProcess() {
  return (
    <section className="bg-slate-50 py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.4em] text-primary">
            Our Process
          </p>
          <h2 className="mt-4 text-3xl md:text-4xl font-bold text-slate-900">
            Contact us, confirm your order, and receive your products in just a
            few easy steps.
          </h2>
          <p className="mt-4 text-base text-slate-600 leading-relaxed">
            Follow our simple three-step process to place your order, get clear
            updates, and receive your electronics quickly.
          </p>
        </div>

        {/* Steps */}
        <div className="mt-16 grid gap-12 md:grid-cols-3 lg:grid-cols-4 text-center">
          {processSteps.map((step, index) => (
            <div key={step.title} className="flex flex-col items-center group">
              {/* Icon */}
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition">
                <Image
                  src={step.icon}
                  alt={step.title}
                  width={40}
                  height={40}
                  className="scale-110 group-hover:scale-125 transition-transform duration-300"
                />
              </div>

              {/* Step label */}
              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                {step.step}
              </p>

              {/* Title */}
              <h3 className="mt-3 text-xl font-semibold text-slate-900">
                {step.title}
              </h3>

              {/* Description */}
              <p className="mt-2 max-w-xs text-sm text-slate-500 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
