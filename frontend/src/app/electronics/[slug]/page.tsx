import ProductCard from "@/components/ProductCard";
import NoProductsFound from "@/components/NotProductFound";
import PaginationBar from "@/components/PaginationBar";
import { Skeleton } from "@/components/ui/skeleton";
import { sortType } from "@/types/Types";
import { Suspense } from "react";
import getProducts from "../../(api)/getProducts";

function formatSlug(slug: string) {
  return slug
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
}

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: {
    page?: string;
    price_min?: string;
    price_max?: string;
    sort?: string;
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: PageProps) {
  const { slug } = await params;
  const {
    page = "1",
    price_min,
    price_max,
    sort = "last_updated",
  } = await searchParams;
  const currentPage = Number(page) >= 1 ? Number(page) : 1;

  return (
    <section className="w-full">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold mb-10">
          Available {formatSlug(slug)}
        </h2>

        <Suspense
          fallback={<LoadingSkeleton />}
          key={`${slug}-${currentPage}-${sort}-${price_min || ""}-${price_max || ""}`}
        >
          <ProductResults
            slug={slug}
            page={currentPage}
            priceMin={price_min ? parseInt(price_min) : undefined}
            priceMax={price_max ? parseInt(price_max) : undefined}
            sort={sort as sortType}
          />
        </Suspense>
      </div>
    </section>
  );
}

interface ProductResultsProps {
  slug: string;
  page: number;
  priceMin?: number;
  priceMax?: number;
  sort?: sortType;
}

async function ProductResults({
  slug,
  page,
  priceMin,
  priceMax,
  sort,
}: ProductResultsProps) {
  const data = await getProducts({
    collection: slug,
    price_min: priceMin,
    price_max: priceMax,
    sort,
    page,
  });

  if (!data?.products?.length) {
    return (
      <div className="flex justify-center">
        <NoProductsFound clearUrl={`/electronics/${slug}`} />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
        {data.products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <PaginationBar currentPage={page} totalPage={data.totalPages} />
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-5 sm:grid sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="border rounded-none p-4 animate-pulse">
            <div className="relative w-full h-64 mb-4 bg-muted">
              <Skeleton className="w-full h-full rounded-none" />
            </div>
            <div className="border-b border-gray-300 mb-4"></div>
            <Skeleton className="h-5 w-3/4 mb-2 bg-muted" />
            <Skeleton className="h-5 w-1/3 mb-4 bg-muted" />
            <Skeleton className="h-12 w-full rounded-none bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}
