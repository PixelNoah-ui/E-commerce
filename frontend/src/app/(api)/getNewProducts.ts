import { ProductType } from "@/types/Types";

export default async function getNewProducts(): Promise<ProductType[]> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products/new-arrivals`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    console.error("Failed to fetch new products");
    return [];
  }

  const data: { status: string; data: { products: ProductType[] } } =
    await response.json();
  return data.data?.products ?? [];
}
