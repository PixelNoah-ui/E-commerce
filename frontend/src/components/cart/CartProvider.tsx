"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { CartItem, CartState } from "@/types/cart";

type Actions = {
  addItem: (
    item: Omit<CartItem, "id" | "quantity"> & { quantity?: number },
  ) => void;
  increase: (id: string, amount?: number) => void;
  decrease: (id: string, amount?: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  itemsCount: number;
  items: CartItem[];
  setPromo: (code: string | null, amount?: number) => void;
};

const STORAGE_KEY = "pixelshop_cart_v1";

const CartContext = createContext<Actions | undefined>(undefined);

function makeId(productId: string, variant?: any) {
  if (!variant) return productId;
  try {
    return `${productId}::${JSON.stringify(variant)}`;
  } catch {
    return productId;
  }
}

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<CartState>({ items: [], promo: null });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setState(JSON.parse(raw) as CartState);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      // ignore
    }
  }, [state]);

  const addItem = (
    payload: Omit<CartItem, "id" | "quantity"> & { quantity?: number },
  ) => {
    const qty = payload.quantity ?? 1;
    const id = makeId(payload.productId, payload.variant);

    setState((s) => {
      const existing = s.items.find((i) => i.id === id);
      if (existing) {
        return {
          ...s,
          items: s.items.map((i) =>
            i.id === id
              ? {
                  ...i,
                  quantity: Math.min(
                    (i.quantity || 0) + qty,
                    i.maxQuantity ?? 9999,
                  ),
                }
              : i,
          ),
        };
      }

      const item: CartItem = {
        id,
        productId: payload.productId,
        name: payload.name,
        price: payload.price,
        currency: payload.currency ?? "ETB",
        image: payload.image,
        variant: payload.variant,
        quantity: Math.max(1, qty),
        maxQuantity: payload.maxQuantity,
        available: payload.available ?? true,
        estimatedDelivery: payload.estimatedDelivery,
      };

      return { ...s, items: [item, ...s.items] };
    });
  };

  const increase = (id: string, amount = 1) => {
    setState((s) => ({
      ...s,
      items: s.items.map((i) =>
        i.id === id
          ? {
              ...i,
              quantity: Math.min(
                (i.quantity || 0) + amount,
                i.maxQuantity ?? 9999,
              ),
            }
          : i,
      ),
    }));
  };

  const decrease = (id: string, amount = 1) => {
    setState((s) => ({
      ...s,
      items: s.items
        .map((i) =>
          i.id === id
            ? { ...i, quantity: Math.max((i.quantity || 1) - amount, 0) }
            : i,
        )
        .filter((i) => i.quantity > 0),
    }));
  };

  const remove = (id: string) => {
    setState((s) => ({ ...s, items: s.items.filter((i) => i.id !== id) }));
  };

  const clear = () => setState({ items: [], promo: null });

  const setPromo = (code: string | null, amount = 0) => {
    setState((s) => ({ ...s, promo: code ? { code, amount } : null }));
  };

  const value = useMemo(
    () => ({
      addItem,
      increase,
      decrease,
      remove,
      clear,
      itemsCount: state.items.reduce((a, b) => a + b.quantity, 0),
      items: state.items,
      setPromo,
    }),
    [state.items],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCartContext = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCartContext must be used within CartProvider");
  return ctx;
};
