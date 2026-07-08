"use client";

import { useCartContext } from "@/components/cart/CartProvider";

export const useCart = () => {
  return useCartContext();
};

export default useCart;
