import { prisma } from "../lib/Prisma.js";
import { AppError } from "../utils/AppError.js";
import { catchAsync } from "../utils/catchAsync .js";

export const getUserOrders = catchAsync(async (req, res, next) => {
  const orders = await prisma.order.findMany({
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

export const updateOrderStatus = catchAsync(async (req, res, next) => {
  const { orderId } = req.params as { orderId?: string };
  const { status, paymentStatus } = req.body as {
    status?: string;
    paymentStatus?: string;
  };

  if (!orderId) {
    return next(new AppError("Order id is required", 400));
  }

  const order = await prisma.order.findUnique({ where: { id: orderId } });

  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: {
      ...(status ? { status: status as never } : {}),
      ...(paymentStatus ? { paymentStatus: paymentStatus as never } : {}),
    } as never,
  });

  res.status(200).json({
    status: "success",
    data: { order: updatedOrder },
  });
});
