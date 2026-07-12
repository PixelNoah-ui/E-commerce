import { z } from "zod";
import type { CartItem } from "@/types/cart";

export const checkoutFormSchema = z.object({
  fullName: z.string().trim().min(2, "Full name is required."),
  phone: z.string().trim().min(7, "Phone number is required."),
  country: z.string().trim().min(2, "Country is required."),
  city: z.string().trim().min(2, "City is required."),
  address: z.string().trim().min(5, "Address is required."),
  postalCode: z.string().trim().min(3, "Postal code is required."),
  orderNotes: z.string().optional(),
});

export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

export type CheckoutOrderItem = Pick<
  CartItem,
  "productId" | "name" | "price" | "quantity" | "image"
> & {
  lineTotal: number;
};

export type CheckoutOrder = {
  customer: CheckoutFormValues;
  items: CheckoutOrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  placedAt: string;
};

export type CheckoutInitResponse = {
  status: "success" | "fail";
  data?: {
    orderId?: string;
    orderNumber?: string;
    checkoutUrl?: string;
    txRef?: string;
  };
  message?: string;
};
