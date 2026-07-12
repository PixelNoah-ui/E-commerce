import { prisma } from "../../lib/Prisma.js";
import { AppError } from "../../utils/AppError.js";
import { catchAsync } from "../../utils/catchAsync .js";

export const getProductReviews = catchAsync(async (req, res, next) => {
  const { productId } = req.params as { productId?: string };
  if (!productId) {
    return next(new AppError("Product id is required", 400));
  }

  const reviews = await prisma.review.findMany({
    where: { productId },
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          imageUrl: true,
        },
      },
    },
  });

  res.status(200).json({
    status: "success",
    data: { reviews },
  });
});

export const createReview = catchAsync(async (req, res, next) => {
  const { productId } = req.params as { productId?: string };
  const { rating, title, comment } = req.body as {
    rating?: number;
    title?: string;
    comment?: string;
  };

  if (!productId) {
    return next(new AppError("Product id is required", 400));
  }

  const parsedRating = Number(rating);
  if (!Number.isInteger(parsedRating) || parsedRating < 1 || parsedRating > 5) {
    return next(new AppError("Rating must be an integer between 1 and 5", 400));
  }

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  const existing = await prisma.review.findUnique({
    where: {
      userId_productId: {
        userId: req.user.id,
        productId,
      },
    },
  });

  if (existing) {
    return next(new AppError("You have already reviewed this product", 409));
  }

  const review = await prisma.review.create({
    data: {
      userId: req.user.id,
      productId,
      rating: parsedRating,
      title: title?.trim() || null,
      comment: comment?.trim() || null,
    },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          imageUrl: true,
        },
      },
    },
  });

  res.status(201).json({
    status: "success",
    data: { review },
  });
});

export const updateReview = catchAsync(async (req, res, next) => {
  const { reviewId } = req.params as { reviewId?: string };
  if (!reviewId) {
    return next(new AppError("Review id is required", 400));
  }

  const existing = await prisma.review.findFirst({
    where: { id: reviewId, userId: req.user.id },
  });

  if (!existing) {
    return next(new AppError("Review not found", 404));
  }

  const { rating, title, comment } = req.body as {
    rating?: number;
    title?: string;
    comment?: string;
  };

  const parsedRating = Number(rating);
  if (
    rating !== undefined &&
    (!Number.isInteger(parsedRating) || parsedRating < 1 || parsedRating > 5)
  ) {
    return next(new AppError("Rating must be an integer between 1 and 5", 400));
  }

  const updated = await prisma.review.update({
    where: { id: reviewId },
    data: {
      ...(rating !== undefined ? { rating: parsedRating } : {}),
      ...(title !== undefined ? { title: title.trim() || null } : {}),
      ...(comment !== undefined ? { comment: comment.trim() || null } : {}),
    },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          imageUrl: true,
        },
      },
    },
  });

  res.status(200).json({
    status: "success",
    data: { review: updated },
  });
});

export const deleteReview = catchAsync(async (req, res, next) => {
  const { reviewId } = req.params as { reviewId?: string };
  if (!reviewId) {
    return next(new AppError("Review id is required", 400));
  }

  const existing = await prisma.review.findFirst({
    where: { id: reviewId, userId: req.user.id },
  });

  if (!existing) {
    return next(new AppError("Review not found", 404));
  }

  await prisma.review.delete({ where: { id: reviewId } });

  res.status(200).json({
    status: "success",
    message: "Review deleted successfully",
  });
});
