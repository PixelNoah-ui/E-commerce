export interface Address {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  secondPhone: string | null;
  address: string | null;
  location: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GetAddressResponse {
  status: "success" | "error";
  data: {
    owner: Address;
  };
  message?: string;
}

export default async function getAddress(): Promise<Address> {
  const API_URL = (
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
  ).replace(/\/$/, "");

  const response = await fetch(`${API_URL}/ownerAddress`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch owner address");
  }

  const result: GetAddressResponse = await response.json();
  console.log("getAddress result:", result); // Log the entire result for debugging

  return result.data.owner;
}
