"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReview = exports.updateReview = exports.createReview = exports.getProductReviews = void 0;
const Prisma_js_1 = require("../../lib/Prisma.js");
const AppError_js_1 = require("../../utils/AppError.js");
const catchAsync__js_1 = require("../../utils/catchAsync .js");
exports.getProductReviews = (0, catchAsync__js_1.catchAsync)(async (req, res, next) => {
    const { productId } = req.params;
    if (!productId) {
        return next(new AppError_js_1.AppError("Product id is required", 400));
    }
    const reviews = await Prisma_js_1.prisma.review.findMany({
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
exports.createReview = (0, catchAsync__js_1.catchAsync)(async (req, res, next) => {
    const { productId } = req.params;
    const { rating, title, comment } = req.body;
    if (!productId) {
        return next(new AppError_js_1.AppError("Product id is required", 400));
    }
    const parsedRating = Number(rating);
    if (!Number.isInteger(parsedRating) || parsedRating < 1 || parsedRating > 5) {
        return next(new AppError_js_1.AppError("Rating must be an integer between 1 and 5", 400));
    }
    const product = await Prisma_js_1.prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
        return next(new AppError_js_1.AppError("Product not found", 404));
    }
    const existing = await Prisma_js_1.prisma.review.findUnique({
        where: {
            userId_productId: {
                userId: req.user.id,
                productId,
            },
        },
    });
    if (existing) {
        return next(new AppError_js_1.AppError("You have already reviewed this product", 409));
    }
    const review = await Prisma_js_1.prisma.review.create({
        data: {
            userId: req.user.id,
            productId,
            rating: parsedRating,
            title: (title === null || title === void 0 ? void 0 : title.trim()) || null,
            comment: (comment === null || comment === void 0 ? void 0 : comment.trim()) || null,
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
exports.updateReview = (0, catchAsync__js_1.catchAsync)(async (req, res, next) => {
    const { reviewId } = req.params;
    if (!reviewId) {
        return next(new AppError_js_1.AppError("Review id is required", 400));
    }
    const existing = await Prisma_js_1.prisma.review.findFirst({
        where: { id: reviewId, userId: req.user.id },
    });
    if (!existing) {
        return next(new AppError_js_1.AppError("Review not found", 404));
    }
    const { rating, title, comment } = req.body;
    const parsedRating = Number(rating);
    if (rating !== undefined &&
        (!Number.isInteger(parsedRating) || parsedRating < 1 || parsedRating > 5)) {
        return next(new AppError_js_1.AppError("Rating must be an integer between 1 and 5", 400));
    }
    const updated = await Prisma_js_1.prisma.review.update({
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
exports.deleteReview = (0, catchAsync__js_1.catchAsync)(async (req, res, next) => {
    const { reviewId } = req.params;
    if (!reviewId) {
        return next(new AppError_js_1.AppError("Review id is required", 400));
    }
    const existing = await Prisma_js_1.prisma.review.findFirst({
        where: { id: reviewId, userId: req.user.id },
    });
    if (!existing) {
        return next(new AppError_js_1.AppError("Review not found", 404));
    }
    await Prisma_js_1.prisma.review.delete({ where: { id: reviewId } });
    res.status(200).json({
        status: "success",
        message: "Review deleted successfully",
    });
});
//# sourceMappingURL=reviewController.js.map