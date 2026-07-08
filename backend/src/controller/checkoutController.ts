import { prisma } from "../lib/Prisma.js";
import { AppError } from "../utils/AppError.js";
import { catchAsync } from "../utils/catchAsync .js";

export const validateCheckout = catchAsync(async (req, res, next) => {
  const { items } = req.body as {
    items?: Array<{
      productId: string;
      quantity: number;
      price?: number;
      name?: string;
    }>;
  };

  if (!Array.isArray(items) || items.length === 0) {
    return next(new AppError("Your cart is empty", 400));
  }

  const validatedItems: Array<{
    productId: string;
    name: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
    image?: string | null;
  }> = [];

  let subtotal = 0;

  for (const item of items) {
    const quantity = Number(item?.quantity ?? 0);
    const productId = item?.productId;

    if (!productId || !Number.isInteger(quantity) || quantity < 1) {
      return next(
        new AppError(
          "Each cart item must have a valid product id and quantity",
          400,
        ),
      );
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return next(
        new AppError("One or more products in your cart were not found", 404),
      );
    }

    if (!product.isActive) {
      return next(
        new AppError(`${product.name} is currently unavailable`, 400),
      );
    }

    const unitPrice = Number(product.price);
    if (Number.isNaN(unitPrice)) {
      return next(new AppError(`${product.name} has an invalid price`, 400));
    }

    const maxAllowed = 10;
    if (quantity > maxAllowed) {
      return next(
        new AppError(
          `${product.name} quantity exceeds the allowed limit of ${maxAllowed}`,
          400,
        ),
      );
    }

    const lineTotal = Number((unitPrice * quantity).toFixed(2));
    subtotal += lineTotal;

    validatedItems.push({
      productId: product.id,
      name: product.name,
      quantity,
      unitPrice: Number(unitPrice.toFixed(2)),
      lineTotal,
      image: product.imageUrl,
    });
  }

  const shipping = subtotal > 100 ? 0 : 10;
  const tax = Number((subtotal * 0.07).toFixed(2));
  const total = Number((subtotal + shipping + tax).toFixed(2));

  res.status(200).json({
    status: "success",
    data: {
      items: validatedItems,
      subtotal: Number(subtotal.toFixed(2)),
      shipping,
      tax,
      total,
      currency: "ETB",
      message: "Your cart is ready for checkout",
    },
  });
});
