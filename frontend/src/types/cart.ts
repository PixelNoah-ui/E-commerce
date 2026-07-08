export type CartVariant = {
  id?: string;
  name?: string; // e.g. Color: Black
  value?: string; // e.g. Black
};

export type CartItem = {
  id: string; // unique cart item id (productId + variant)
  productId: string;
  name: string;
  price: number; // unit price in cents or major currency (choose consistently)
  currency?: string;
  image?: string;
  quantity: number;
  variant?: CartVariant[];
  maxQuantity?: number; // stock
  available?: boolean;
  estimatedDelivery?: string; // human friendly
};

export type CartState = {
  items: CartItem[];
  promo?: {
    code: string;
    amount: number; // absolute discount
  } | null;
};

export type CartTotals = {
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
};
