"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCoupon = exports.getTodayCoupon = exports.getAllCoupons = exports.createCoupon = void 0;
const client_js_1 = require("../generated/prisma/client.js");
const Prisma_js_1 = require("../lib/Prisma.js");
const AppError_js_1 = require("../utils/AppError.js");
const catchAsync__js_1 = require("../utils/catchAsync .js");
// Create a new coupon (Admin only)
exports.createCoupon = (0, catchAsync__js_1.catchAsync)(async (req, res, next) => {
    const { code } = req.body;
    if (!code) {
        return next(new AppError_js_1.AppError("Please provide code and discount", 400));
    }
    // Check if coupon code already exists
    const existingCoupon = await Prisma_js_1.prisma.coupon.findUnique({
        where: { code: code.toUpperCase() },
    });
    if (existingCoupon) {
        return next(new AppError_js_1.AppError("Coupon code already exists", 400));
    }
    const coupon = await Prisma_js_1.prisma.coupon.create({
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
exports.getAllCoupons = (0, catchAsync__js_1.catchAsync)(async (req, res, next) => {
    const page = Number(req.query.page) || 1;
    const limit = 10;
    const q = req.query.q || "";
    const where = q
        ? {
            code: {
                contains: q,
                mode: client_js_1.Prisma.QueryMode.insensitive,
            },
        }
        : {};
    const [coupons, total] = await Promise.all([
        Prisma_js_1.prisma.coupon.findMany({
            where,
            orderBy: {
                createdAt: "desc",
            },
            skip: (page - 1) * limit,
            take: limit,
        }),
        Prisma_js_1.prisma.coupon.count({ where }),
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
exports.getTodayCoupon = (0, catchAsync__js_1.catchAsync)(async (req, res, next) => {
    const coupon = await Prisma_js_1.prisma.coupon.findFirst({
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
exports.deleteCoupon = (0, catchAsync__js_1.catchAsync)(async (req, res, next) => {
    const { id } = req.params;
    const coupon = await Prisma_js_1.prisma.coupon.findUnique({
        where: { id: id },
    });
    if (!coupon) {
        return next(new AppError_js_1.AppError("Coupon not found", 404));
    }
    await Prisma_js_1.prisma.coupon.delete({
        where: { id: id },
    });
    res.status(200).json({
        status: "success",
        message: "Coupon deleted successfully",
    });
});
//# sourceMappingURL=couponController.js.map