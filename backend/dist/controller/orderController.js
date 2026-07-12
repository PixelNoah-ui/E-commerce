"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatus = exports.getUserOrders = void 0;
const Prisma_js_1 = require("../lib/Prisma.js");
const AppError_js_1 = require("../utils/AppError.js");
const catchAsync__js_1 = require("../utils/catchAsync .js");
exports.getUserOrders = (0, catchAsync__js_1.catchAsync)(async (req, res, next) => {
    const orders = await Prisma_js_1.prisma.order.findMany({
        where: { userId: req.user.id },
        orderBy: { createdAt: "desc" },
        include: {
            items: {
                include: {
                    product: {
                        select: {
                            id: true,
                            name: true,
                            imageUrl: true,
                        },
                    },
                },
            },
        },
    });
    res.status(200).json({
        status: "success",
        data: {
            orders: orders.map((order) => ({
                id: order.id,
                orderNumber: order.orderNumber,
                status: order.status,
                paymentStatus: order.paymentStatus,
                total: Number(order.total),
                createdAt: order.createdAt,
                items: order.items.map((item) => ({
                    id: item.id,
                    quantity: item.quantity,
                    total: Number(item.total),
                    product: item.product,
                })),
            })),
        },
    });
});
exports.updateOrderStatus = (0, catchAsync__js_1.catchAsync)(async (req, res, next) => {
    const { orderId } = req.params;
    const { status, paymentStatus } = req.body;
    if (!orderId) {
        return next(new AppError_js_1.AppError("Order id is required", 400));
    }
    const order = await Prisma_js_1.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
        return next(new AppError_js_1.AppError("Order not found", 404));
    }
    const updatedOrder = await Prisma_js_1.prisma.order.update({
        where: { id: orderId },
        data: {
            ...(status ? { status: status } : {}),
            ...(paymentStatus ? { paymentStatus: paymentStatus } : {}),
        },
    });
    res.status(200).json({
        status: "success",
        data: { order: updatedOrder },
    });
});
//# sourceMappingURL=orderController.js.map