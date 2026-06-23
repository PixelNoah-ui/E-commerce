import Image from "next/image";
import ElectonicsFilter from "./ElectonicsFilter";
import { Metadata } from "next";

const categoryBgImages: Record<string, string> = {
  smartphones: "/images/s23.png",
  laptops: "/images/laptop.jpg",
  refrigerators: "/images/refrigerator.png",
  "washing-machines": "/images/washing-machines.png",
  smartwatches: "/images/smartwatch.png",
  "audio-speakers": "/images/headphones.png",
  "air-conditioners": "/images/ac.png",
  accessories: "/images/headphones.png",
  headphones: "/images/headphones.png",
};

function formatSlug(slug?: string) {
  if (!slug) return "Electronics";

  return slug
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
}

function getCategoryBackgroundImage(slug?: string) {
  if (!slug) return "/images/bg.png";
  return categoryBgImages[slug] ?? "/images/bg.png";
}

// ✅ SEO Metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const formatted = formatSlug(slug);

  return {
    title: `${formatted} | Meqdii Electronics`,
    description: `Shop ${formatted} at Meqdii Electronics. Best prices in Ethiopia.`,
    openGraph: {
      title: `${formatted} | Meqdii Electronics`,
      description: `Browse ${formatted} with great deals.`,
      url: `https://abduelectronics.com/electronics/${slug}`,
      images: ["/images/bg.png"],
      siteName: "Meqdii Electronics",
      locale: "en_ET",
      type: "website",
    },
  };
}

export default async function ElectronicsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <div>
      {/* HERO BANNER */}
      <div className="relative h-[50vh] w-full">
        <Image
          src={getCategoryBackgroundImage(slug)}
          alt="category background"
          fill
          priority
          className="object-contain object-center"
        />

        <div className="absolute inset-0 bg-black/70" />

        <div className="relative z-10 flex flex-col justify-center items-center h-full text-white text-center px-6">
          <h1 className="text-4xl md:text-5xl font-extrabold">
            {formatSlug(slug)}
          </h1>

          <div className="mt-4 flex gap-2 text-sm font-semibold">
            <span className="bg-primary px-4 py-1">HOME</span>
            <span className="text-gray-300">
              / {formatSlug(slug).toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* FILTER + PAGE */}
      <ElectonicsFilter>{children}</ElectonicsFilter>
    </div>
  );
}
