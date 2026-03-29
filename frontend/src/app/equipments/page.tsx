import NoProductsFound from "@/components/NotProductFound";
import PaginationBar from "@/components/PaginationBar";
import ProductCard from "@/components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { sortType } from "@/types/Types";
import { Metadata } from "next";
import { Suspense } from "react";

interface PageProps {
  searchParams: {
    q?: string;
    page?: string;
    collection?: string[];
    price_min?: string;
    price_max?: string;
    sort?: string;
  };
}

export function generateMetadata({ searchParams: { q } }: PageProps): Metadata {
  return {
    title: q ? `Results for "${q}"` : "Products",
  };
}

export default async function Page({ searchParams }: PageProps) {
  const {
    q,
    page = "1",
    collection,
    price_min,
    price_max,
    sort,
  } = await searchParams;
  const title = q ? `Results for "${q}"` : "Products";

  return (
    <div className="space-y-10">
      <h1 className="text-center text-3xl font-bold md:text-4xl">{title}</h1>
      <Suspense
        fallback={<LoadingSkeleton />}
        key={`${q}-${page}-${sort || ""}`}
      >
        <ProductResults
          q={q}
          page={parseInt(page)}
          collections={
            Array.isArray(collection)
              ? collection
              : collection
                ? [collection]
                : []
          }
          priceMin={price_min ? parseInt(price_min) : undefined}
          priceMax={price_max ? parseInt(price_max) : undefined}
          sort={sort as sortType}
        />
      </Suspense>
    </div>
  );
}

interface ProductResultsProps {
  q?: string;
  page: number;
  collections?: string[];
  priceMin?: number;
  priceMax?: number;
  sort?: sortType;
}

async function ProductResults({
  q,
  page,
  collections,
  priceMin,
  priceMax,
  sort,
}: ProductResultsProps) {
  const Products = [
    {
      id: "1",
      name: "Samsung Galaxy S23",
      description: "Powerful smartphone with stunning display and camera.",
      price: 799.99,
      imageUrl: "/images/s23.png",
      categoryType: "smartphone",
    },
    {
      id: "2",
      name: "iPhone 15 Pro",
      description:
        "Sleek design, exceptional camera system, smooth performance.",
      price: 999.99,
      imageUrl: "/images/iphone15.png",
      categoryType: "smartphone",
    },
    {
      id: "3",
      name: "Smart Watch Pro",
      description:
        "Track your fitness and stay connected with this smartwatch.",
      price: 299.99,
      imageUrl: "/images/smartwatch.png",
      categoryType: "smartwatch",
    },
    {
      id: "4",
      name: "Wireless Headphones",
      description:
        "Immersive sound with noise cancellation and long battery life.",
      price: 199.99,
      imageUrl: "/images/headphones.png",
      categoryType: "accessories",
    },
    {
      id: "5",
      name: "Samsung Galaxy S23",
      description: "Powerful smartphone with stunning display and camera.",
      price: 799.99,
      imageUrl: "/images/s23.png",
      categoryType: "smartphone",
    },
    {
      id: "6",
      name: "iPhone 15 Pro",
      description:
        "Sleek design, exceptional camera system, smooth performance.",
      price: 999.99,
      imageUrl: "/images/iphone15.png",
      categoryType: "smartphone",
    },
    {
      id: "7",
      name: "Smart Watch Pro",
      description:
        "Track your fitness and stay connected with this smartwatch.",
      price: 299.99,
      imageUrl: "/images/smartwatch.png",
      categoryType: "smartwatch",
    },
    {
      id: "8",
      name: "Wireless Headphones",
      description:
        "Immersive sound with noise cancellation and long battery life.",
      price: 199.99,
      imageUrl: "/images/headphones.png",
      categoryType: "accessories",
    },
  ];

  if (Products.length === 0) {
    return <NoProductsFound />;
  }

  return (
    <div className="space-y-10 group-has-[[data-pending]]:animate-pulse">
      <div className="flex grid-cols-2 flex-col gap-5 sm:grid xl:grid-cols-3 2xl:grid-cols-4">
        {Products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <PaginationBar currentPage={2} totalPage={4} />
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-5 sm:grid sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="border rounded-none p-4 animate-pulse">
            {/* IMAGE */}
            <div className="relative w-full h-64 mb-4 bg-muted">
              <Skeleton className="w-full h-full rounded-none" />
            </div>

            {/* LINE UNDER IMAGE */}
            <div className="border-b border-gray-300 mb-4"></div>

            {/* TITLE */}
            <Skeleton className="h-5 w-3/4 mb-2 bg-muted" />

            {/* PRICE */}
            <Skeleton className="h-5 w-1/3 mb-4 bg-muted" />

            {/* BUTTON */}
            <Skeleton className="h-12 w-full rounded-none bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}
