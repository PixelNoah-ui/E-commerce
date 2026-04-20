import { Prisma } from "../generated/prisma/client.js";
import { prisma } from "../lib/Prisma.js";
import { AppError } from "../utils/AppError.js";
import { catchAsync } from "../utils/catchAsync .js";

// Create a new coupon (Admin only)
export const createCoupon = catchAsync(async (req, res, next) => {
  const { code } = req.body;

  if (!code) {
    return next(new AppError("Please provide code and discount", 400));
  }

  // Check if coupon code already exists
  const existingCoupon = await prisma.coupon.findUnique({
    where: { code: code.toUpperCase() },
  });

  if (existingCoupon) {
    return next(new AppError("Coupon code already exists", 400));
  }

  const coupon = await prisma.coupon.create({
    data: {
      code: code.toUpperCase(),
    },
  });

  res.status(201).json({
    status: "success",
    data: {
      coupon,
    },
  });
});

export const getAllCoupons = catchAsync(async (req, res, next) => {
  const page = Number(req.query.page) || 1;
  const limit = 10;
  const q = (req.query.q as string) || "";

  const where: Prisma.CouponWhereInput = q
    ? {
        code: {
          contains: q,
          mode: Prisma.QueryMode.insensitive,
        },
      }
    : {};

  const [coupons, total] = await Promise.all([
    prisma.coupon.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * limit,
      take: limit,
    }),

    prisma.coupon.count({ where }),
  ]);

  res.status(200).json({
    success: true,
    data: coupons,
    pagination: {
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
});

export const getTodayCoupon = catchAsync(async (req, res, next) => {
  const coupon = await prisma.coupon.findFirst({
    where: {
      isActive: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  res.status(200).json({
    status: "success",
    data: {
      coupon,
    },
  });
});

// Delete coupon (Admin only)
export const deleteCoupon = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const coupon = await prisma.coupon.findUnique({
    where: { id: id as string },
  });

  if (!coupon) {
    return next(new AppError("Coupon not found", 404));
  }

  await prisma.coupon.delete({
    where: { id: id as string },
  });

  res.status(200).json({
    status: "success",
    message: "Coupon deleted successfully",
  });
});
