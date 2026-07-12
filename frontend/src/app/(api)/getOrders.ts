import { buildApiUrl } from "@/lib/auth";

export type OrderSummary = {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  total: number;
  createdAt: string;
  items: Array<{
    id: string;
    quantity: number;
    total: number;
    product?: {
      id?: string;
      name?: string;
      imageUrl?: string | null;
    } | null;
  }>;
};

export type OrdersResponse = {
  status: "success" | "fail";
  data?: {
    orders?: OrderSummary[];
  };
  message?: string;
};

export async function getOrders(): Promise<OrderSummary[]> {
  const response = await fetch(buildApiUrl("/checkout/orders"), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  const data: OrdersResponse = await response.json();

  if (!response.ok || data.status !== "success") {
    throw new Error(data.message || "Unable to load your orders");
  }

  return data.data?.orders || [];
}
