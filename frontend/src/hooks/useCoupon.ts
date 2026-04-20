import { useQuery } from "@tanstack/react-query";

export interface Coupon {
  id: string;
  code: string;
  createdAt: string;
}

export interface GetCouponResponse {
  status: "success" | "error";
  data: {
    coupon: Coupon | null;
  };
}

export interface GetAllCouponsResponse {
  status: "success" | "error";
  data: {
    coupons: Coupon[];
  };
}

export interface CreateCouponData {
  code: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getTodayCoupon(): Promise<Coupon | null> {
  const response = await fetch(`${API_URL}/coupons/today`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  const result: GetCouponResponse = await response.json();
  return result.data.coupon;
}

export function useTodayCoupon() {
  return useQuery<Coupon | null>({
    queryKey: ["todayCoupon"],
    queryFn: getTodayCoupon,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}
