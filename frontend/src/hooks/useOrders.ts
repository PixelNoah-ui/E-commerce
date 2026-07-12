import { useQuery } from "@tanstack/react-query";
import { getOrders, type OrderSummary } from "@/app/(api)/getOrders";
import getOrderDetails, {
  type OrderDetails,
} from "@/app/(api)/getOrderDetails";

export function useOrders() {
  return useQuery<OrderSummary[]>({
    queryKey: ["orders"],
    queryFn: getOrders,
  });
}

export function useOrderDetails(orderIdentifier?: string | null) {
  return useQuery<OrderDetails | null>({
    queryKey: ["checkout-order", orderIdentifier],
    queryFn: () => getOrderDetails(orderIdentifier),
    enabled: Boolean(orderIdentifier),
    retry: false,
  });
}
