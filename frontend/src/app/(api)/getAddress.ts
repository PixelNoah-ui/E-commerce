export interface Address {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
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
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/ownerAddress`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch owner address");
  }

  const result: GetAddressResponse = await response.json();

  return result.data.owner;
}
