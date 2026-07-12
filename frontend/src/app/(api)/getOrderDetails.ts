const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
).replace(/\/$/, "");

function buildApiUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  if (API_URL.includes("/api/v1")) {
    return `${API_URL}${normalizedPath}`;
  }

  return `${API_URL}/api/v1${normalizedPath}`;
}

export type OrderDetails = {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  subtotal: string;
  shipping: string;
  tax: string;
  total: string;
  discount?: number | string;
  currency?: string;
  invoiceNumber?: string;
  estimatedDelivery?: string;
  createdAt: string;
  items: Array<{
    id: string;
    quantity: number;
    price: string;
    total: string;
    selectedSize?: string | null;
    selectedColor?: string | null;
    product?: {
      id?: string;
      name?: string;
      imageUrl?: string | null;
      price?: string | number;
    } | null;
  }>;
  address?: {
    fullName?: string;
    address?: string;
    city?: string;
    country?: string;
    phone?: string;
  } | null;
  billingAddress?: {
    fullName?: string;
    address?: string;
    city?: string;
    country?: string;
    phone?: string;
  } | null;
  payment?: {
    amount: string;
    status: string;
    provider: string | null;
    transactionId?: string | null;
  } | null;
};

export default async function getOrderDetails(orderIdentifier?: string | null) {
  if (!orderIdentifier) {
    return null;
  }

  const response = await fetch(
    buildApiUrl(`/checkout/order/${orderIdentifier}`),
    {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to load order details.");
  }

  return data.data.order as OrderDetails;
}
