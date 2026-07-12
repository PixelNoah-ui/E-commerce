import { prisma } from "../../lib/Prisma.js";
import { AppError } from "../../utils/AppError.js";
import { catchAsync } from "../../utils/catchAsync .js";

export const getWishlist = catchAsync(async (req, res, next) => {
  const wishlist = await prisma.wishlistItem.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      product: true,
    },
  });

  res.status(200).json({
    status: "success",
    data: { wishlist },
  });
});

export const addToWishlist = catchAsync(async (req, res, next) => {
  const { productId } = req.params as { productId?: string };
  if (!productId) {
    return next(new AppError("Product id is required", 400));
  }

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  const existing = await prisma.wishlistItem.findUnique({
    where: {
      userId_productId: {
        userId: req.user.id,
        productId,
      },
    },
  });

  if (existing) {
    return res.status(200).json({
      status: "success",
      message: "Item already in wishlist",
    });
  }

  const item = await prisma.wishlistItem.create({
    data: {
      userId: req.user.id,
      productId,
    },
    include: { product: true },
  });

  res.status(201).json({
    status: "success",
    data: { item },
  });
});

export const removeFromWishlist = catchAsync(async (req, res, next) => {
  const { productId } = req.params as { productId?: string };
  if (!productId) {
    return next(new AppError("Product id is required", 400));
  }

  const existing = await prisma.wishlistItem.findUnique({
    where: {
      userId_productId: {
        userId: req.user.id,
        productId,
      },
    },
  });

  if (!existing) {
    return next(new AppError("Wishlist item not found", 404));
  }

  await prisma.wishlistItem.delete({ where: { id: existing.id } });

  res.status(200).json({
    status: "success",
    message: "Removed from wishlist",
  });
});
