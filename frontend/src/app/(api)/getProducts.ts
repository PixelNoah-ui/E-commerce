import { ProductType } from "@/types/Types";

export interface GetProductsFilters {
  q?: string;
  collection?: string | string[];
  price_min?: number;
  price_max?: number;
  sort?: "price_asc" | "price_desc" | "last_updated";
  page?: number;
  limit?: number;
}

export interface GetProductsResponse {
  products: ProductType[];
  totalPages: number;
}

export default async function getProducts(
  filters: GetProductsFilters = {},
): Promise<GetProductsResponse> {
  const params = new URLSearchParams();

  if (filters.q) params.append("q", filters.q);
  if (filters.collection) {
    if (Array.isArray(filters.collection)) {
      filters.collection.forEach((c) => params.append("collection", c));
    } else {
      params.append("collection", filters.collection);
    }
  }
  if (filters.price_min !== undefined)
    params.append("price_min", String(filters.price_min));
  if (filters.price_max !== undefined)
    params.append("price_max", String(filters.price_max));
  if (filters.sort) params.append("sort", filters.sort);
  if (filters.page) params.append("page", String(filters.page));

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products?${params.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Failed to fetch products:", errorData);
    console.error("Failed to fetch products");
    return { products: [], totalPages: 0 };
  }

  const result = await response.json();

  return {
    products: result.data.products,
    totalPages: result.data.totalPages,
  };
}
