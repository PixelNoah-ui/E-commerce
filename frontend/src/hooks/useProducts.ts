import getNewProducts from "@/app/(api)/getNewProducts";
import { ProductType } from "@/types/Types";
import { useQuery } from "@tanstack/react-query";

export default function useGetNewProducts() {
  return useQuery<ProductType[]>({
    queryKey: ["newProducts"],
    queryFn: getNewProducts,
    staleTime: 1000 * 60 * 1,
  });
}
