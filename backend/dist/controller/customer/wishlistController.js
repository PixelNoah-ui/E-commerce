"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFromWishlist = exports.addToWishlist = exports.getWishlist = void 0;
const Prisma_js_1 = require("../../lib/Prisma.js");
const AppError_js_1 = require("../../utils/AppError.js");
const catchAsync__js_1 = require("../../utils/catchAsync .js");
exports.getWishlist = (0, catchAsync__js_1.catchAsync)(async (req, res, next) => {
    const wishlist = await Prisma_js_1.prisma.wishlistItem.findMany({
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
exports.addToWishlist = (0, catchAsync__js_1.catchAsync)(async (req, res, next) => {
    const { productId } = req.params;
    if (!productId) {
        return next(new AppError_js_1.AppError("Product id is required", 400));
    }
    const product = await Prisma_js_1.prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
        return next(new AppError_js_1.AppError("Product not found", 404));
    }
    const existing = await Prisma_js_1.prisma.wishlistItem.findUnique({
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
    const item = await Prisma_js_1.prisma.wishlistItem.create({
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
exports.removeFromWishlist = (0, catchAsync__js_1.catchAsync)(async (req, res, next) => {
    const { productId } = req.params;
    if (!productId) {
        return next(new AppError_js_1.AppError("Product id is required", 400));
    }
    const existing = await Prisma_js_1.prisma.wishlistItem.findUnique({
        where: {
            userId_productId: {
                userId: req.user.id,
                productId,
            },
        },
    });
    if (!existing) {
        return next(new AppError_js_1.AppError("Wishlist item not found", 404));
    }
    await Prisma_js_1.prisma.wishlistItem.delete({ where: { id: existing.id } });
    res.status(200).json({
        status: "success",
        message: "Removed from wishlist",
    });
});
//# sourceMappingURL=wishlistController.js.map