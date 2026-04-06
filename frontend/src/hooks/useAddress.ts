import { useQuery } from "@tanstack/react-query";
import { getAddress, OwnerAddress } from "@/app/(api)/getAddress";

export function useAddress() {
  return useQuery<OwnerAddress>({
    queryKey: ["address"],
    queryFn: getAddress,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}
