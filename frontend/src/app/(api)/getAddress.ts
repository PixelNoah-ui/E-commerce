export interface OwnerAddress {
  id: string;
  fullName: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  location?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export async function getAddress(): Promise<OwnerAddress> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/address`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch address");
  }

  const result: ApiResponse<OwnerAddress> = await response.json();

  if (!result.success) {
    throw new Error(result.message || "Failed to fetch address");
  }

  return result.data;
}
