import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { buildApiUrl } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { ProductType } from "@/types/Types";
import ProductCard from "@/components/ProductCard";
import ProductReviews from "@/components/reviews/ProductReviews";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";

async function getProduct(id: string): Promise<ProductType | null> {
  const res = await fetch(buildApiUrl(`/products/${id}`), {
    cache: "no-store",
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data?.data?.product ?? null;
}

async function getProducts(): Promise<ProductType[]> {
  const res = await fetch(buildApiUrl("/products?limit=4"), {
    cache: "no-store",
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data?.data?.products || [];
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

  const related = (await getProducts())
    .filter((item) => item.id !== product.id)
    .slice(0, 4);

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border bg-white p-6">
          <div className="relative h-95 w-full overflow-hidden rounded-xl">
            <Image
              src={
                product.imageUrl ||
                product.image_url ||
                "/images/headphones.png"
              }
              alt={product.name || "Product"}
              fill
              className="object-contain"
            />
          </div>
        </div>
        <div className="space-y-6">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
              Featured product
            </p>
            <h1 className="mt-2 text-3xl font-semibold">{product.name}</h1>
            <p className="mt-4 text-sm text-muted-foreground">
              {product.description}
            </p>
          </div>
          <div className="rounded-2xl border bg-card p-6">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Price</p>
                <p className="text-3xl font-semibold">
                  ETB {Number(product.price || 0).toFixed(2)}
                </p>
              </div>
              <Button
                className="rounded-full"
                onClick={() =>
                  toast.success(
                    "Add to cart from the product page is available from the product cards",
                  )
                }
              >
                Add to cart
              </Button>
            </div>
          </div>
          <div className="rounded-2xl border bg-card p-6">
            <h2 className="font-semibold">Specifications</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {product.specifications ? (
                Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="rounded-lg border p-3 text-sm">
                    <p className="font-medium text-muted-foreground">{key}</p>
                    <p className="mt-1">{String(value)}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No specifications available.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <ProductReviews productId={product.id} />

      {related.length > 0 ? (
        <section className="mt-12">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Related products</h2>
            <Link
              href="/equipments"
              className="text-sm text-primary hover:underline"
            >
              Browse all
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
