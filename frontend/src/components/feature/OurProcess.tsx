import Image from "next/image";

const processSteps = [
  {
    step: "Step 1",
    title: "Browse Premium Products",
    description:
      "Explore the latest smartphones, laptops, accessories, and smart gadgets curated for everyday value and performance.",
    icon: "/icons/products.svg",
  },
  {
    step: "Step 2",
    title: "Add to Cart & Checkout",
    description:
      "Choose your preferred item, review your cart, and complete a smooth checkout with secure payment options.",
    icon: "/icons/order.svg",
  },
  {
    step: "Step 3",
    title: "Confirm & Prepare Your Order",
    description:
      "We confirm your purchase details, prepare your order, and keep you updated from processing to dispatch.",
    icon: "/icons/chat.svg",
  },
  {
    step: "Step 4",
    title: "Receive Fast Delivery",
    description:
      "Enjoy quick delivery and dependable support as your electronics reach your door anywhere in Ethiopia.",
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
            Shop smart, checkout fast, and get your favorite electronics
            delivered with confidence.
          </h2>
          <p className="mt-4 text-base text-slate-600 leading-relaxed">
            From discovering the right product to receiving it at your doorstep,
            our ecommerce journey is designed to be simple, secure, and
            reliable.
          </p>
        </div>

        {/* Steps */}
        <div className="mt-16 grid gap-12 md:grid-cols-2 lg:grid-cols-4 text-center">
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
