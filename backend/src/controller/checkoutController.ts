import crypto from "crypto";
import { Prisma } from "../generated/prisma/client.js";
import { prisma } from "../lib/Prisma.js";
import { AppError } from "../utils/AppError.js";
import { catchAsync } from "../utils/catchAsync .js";
import {
  notifyAdminNewOrder,
  notifyAdminPaymentReceived,
  notifyCustomerOrderPlaced,
  notifyCustomerPaymentFailed,
  notifyCustomerPaymentSuccess,
} from "../services/notificationService.js";
import {
  resolveChapaPaymentState,
  buildInvoiceNumber,
} from "../utils/paymentLifecycle.js";

const MAX_ORDER_ITEMS = 20;
const MAX_ORDER_QUANTITY = 10;

const normalizePhone = (value: string) => value.trim().replace(/\s+/g, "");
const normalizeName = (value: string) => value.trim();
const normalizeText = (value: string | undefined) => value?.trim() || "";

type CheckoutCustomer = {
  fullName: string;
  phone: string;
  country: string;
  city: string;
  address: string;
  postalCode: string;
  orderNotes?: string;
};

type CheckoutItem = {
  productId: string;
  quantity: number;
  price?: number;
  name?: string;
  image?: string;
};

const toDecimal = (value: number) => new Prisma.Decimal(value.toFixed(2));
const buildOrderNumber = () =>
  `ORD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

const getChapaConfig = () => {
  const secretKey = process.env.CHAPA_SECRET_KEY;
  if (!secretKey) {
    throw new AppError("Chapa secret key is not configured", 500);
  }

  return {
    secretKey,
    baseUrl:
      process.env.CHAPA_BASE_URL || "https://api.chapa.co/v1/transaction",
    callbackUrl:
      process.env.CHAPA_CALLBACK_URL ||
      `${process.env.BACKEND_URL || "http://localhost:8000"}/api/v1/checkout/chapa/callback`,
    returnUrl:
      process.env.CHAPA_RETURN_URL ||
      `${process.env.CLIENT_URL || "http://localhost:3000"}/checkout/success`,
  };
};

const validateCheckoutItems = async (items: CheckoutItem[]) => {
  if (!Array.isArray(items) || items.length === 0) {
    throw new AppError("Your cart is empty", 400);
  }

  if (items.length > MAX_ORDER_ITEMS) {
    throw new AppError("You can only checkout up to 20 items at once", 400);
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
      throw new AppError(
        "Each cart item must have a valid product id and quantity",
        400,
      );
    }

    if (quantity > MAX_ORDER_QUANTITY) {
      throw new AppError(
        `Each item quantity cannot exceed ${MAX_ORDER_QUANTITY}`,
        400,
      );
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new AppError(
        "One or more products in your cart were not found",
        404,
      );
    }

    if (!product.isActive) {
      throw new AppError(`${product.name} is currently unavailable`, 400);
    }

    const unitPrice = Number(product.price);
    if (Number.isNaN(unitPrice)) {
      throw new AppError(`${product.name} has an invalid price`, 400);
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

  return { validatedItems, subtotal };
};

export const validateCheckout = catchAsync(async (req, res, next) => {
  const { items } = req.body as {
    items?: CheckoutItem[];
  };

  try {
    const { validatedItems, subtotal } = await validateCheckoutItems(
      items || [],
    );
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
  } catch (error) {
    next(error);
  }
});

export const initializeCheckout = catchAsync(async (req, res, next) => {
  const { items, customer, notes } = req.body as {
    items?: CheckoutItem[];
    customer?: CheckoutCustomer;
    notes?: string;
  };

  const fullName = normalizeName(customer?.fullName || "");
  const phone = normalizePhone(customer?.phone || "");
  const country = normalizeText(customer?.country);
  const city = normalizeText(customer?.city);
  const addressLine = normalizeText(customer?.address);
  const postalCode = normalizeText(customer?.postalCode);

  if (!fullName || !phone || !country || !city || !addressLine || !postalCode) {
    return next(new AppError("Please complete the delivery information", 400));
  }

  try {
    const { validatedItems, subtotal } = await validateCheckoutItems(
      items || [],
    );
    const shipping = subtotal > 100 ? 0 : 10;
    const tax = Number((subtotal * 0.07).toFixed(2));
    const total = Number((subtotal + shipping + tax).toFixed(2));

    const address = await prisma.userAddress.create({
      data: {
        userId: req.user.id,
        fullName,
        phone,
        country,
        city,
        address: addressLine,
        postalCode,
        state: null,
        isDefault: false,
      },
    });

    const orderNumber = buildOrderNumber();
    const txRef = `chapa-${orderNumber}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: req.user.id,
        addressId: address.id,
        subtotal: toDecimal(subtotal),
        shipping: toDecimal(shipping),
        tax: toDecimal(tax),
        total: toDecimal(total),
        notes: normalizeText(notes || customer?.orderNotes) || null,
        status: "PENDING",
        paymentStatus: "PENDING",
        items: {
          create: validatedItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: toDecimal(item.unitPrice),
            total: toDecimal(item.lineTotal),
          })),
        },
        payment: {
          create: {
            transactionId: txRef,
            provider: "CHAPA",
            amount: toDecimal(total),
            status: "PENDING",
          },
        },
      },
    });

    void notifyCustomerOrderPlaced(req.user.email, order.orderNumber);
    void notifyAdminNewOrder(order.orderNumber);

    const { secretKey, baseUrl, callbackUrl, returnUrl } = getChapaConfig();

    const chapaResponse = await fetch(`${baseUrl}/initialize`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: total.toFixed(2),
        currency: "ETB",
        email: req.user.email,
        first_name: fullName.split(" ")[0] || fullName,
        last_name: fullName.split(" ").slice(1).join(" ") || "Customer",
        phone_number: phone,
        tx_ref: txRef,
        callback_url: callbackUrl,
        return_url: `${returnUrl}?orderId=${order.id}&orderNumber=${order.orderNumber}`,
        customization: {
          title: "Abdu Electronics",
          description: `Order ${order.orderNumber}`,
        },
      }),
    });

    const chapaData = (await chapaResponse.json()) as {
      status?: string;
      message?: string;
      data?: { checkout_url?: string };
    };

    if (!chapaResponse.ok || chapaData.status !== "success") {
      await prisma.payment.update({
        where: { orderId: order.id },
        data: { status: "FAILED" },
      });
      await prisma.order.update({
        where: { id: order.id },
        data: { status: "CANCELLED", paymentStatus: "FAILED" },
      });

      return next(
        new AppError(chapaData.message || "Unable to initialize payment", 502),
      );
    }

    await prisma.payment.update({
      where: { orderId: order.id },
      data: { transactionId: txRef },
    });

    res.status(200).json({
      status: "success",
      data: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        checkoutUrl: chapaData.data?.checkout_url,
        txRef,
      },
    });
  } catch (error) {
    next(error);
  }
});

export const getOrder = catchAsync(async (req, res, next) => {
  const { orderId } = req.params as { orderId?: string };

  if (!orderId) {
    return next(new AppError("Order id is required", 400));
  }

  const order = await prisma.order.findFirst({
    where: {
      OR: [{ id: orderId }, { orderNumber: orderId }],
    },
    include: {
      address: true,
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              imageUrl: true,
              price: true,
            },
          },
        },
      },
      payment: true,
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
        },
      },
    },
  });

  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  if (order.userId !== req.user.id) {
    return next(new AppError("Unauthorized access to this order", 403));
  }

  const invoiceNumber = buildInvoiceNumber(order.orderNumber);
  const estimatedDelivery = new Date(
    new Date(order.createdAt).getTime() + 5 * 86400000,
  ).toISOString();

  res.status(200).json({
    status: "success",
    data: {
      order: {
        ...order,
        invoiceNumber,
        estimatedDelivery,
        discount: 0,
        currency: "ETB",
        billingAddress: order.address,
      },
    },
  });
});

const validateChapaSignature = (body: unknown, signature?: string) => {
  const secretKey = process.env.CHAPA_SECRET_KEY;
  if (!secretKey || !signature) {
    return true;
  }

  const expected = crypto
    .createHmac("sha256", secretKey)
    .update(JSON.stringify(body))
    .digest("hex");

  return expected === signature;
};

export const chapaCallback = catchAsync(async (req, res, next) => {
  const tx_ref =
    (req.body as { tx_ref?: string })?.tx_ref ||
    (req.query as { tx_ref?: string })?.tx_ref;
  const status =
    (req.body as { status?: string })?.status ||
    (req.query as { status?: string })?.status;

  if (!tx_ref) {
    return res.status(400).json({ status: "fail", message: "Missing tx_ref" });
  }

  const signature = req.get("x-chapa-signature") || req.get("x-signature");
  if (!validateChapaSignature(req.body, signature)) {
    return res
      .status(401)
      .json({ status: "fail", message: "Invalid signature" });
  }

  const payment = await prisma.payment.findFirst({
    where: { transactionId: tx_ref },
  });

  if (!payment) {
    return res
      .status(404)
      .json({ status: "fail", message: "Payment not found" });
  }

  if (payment.status === "PAID") {
    return res.status(200).json({
      status: "success",
      message: "Payment already confirmed",
    });
  }

  const { secretKey, baseUrl } = getChapaConfig();
  const verifyResponse = await fetch(`${baseUrl}/verify/${tx_ref}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${secretKey}`,
    },
  });

  const verifyData = (await verifyResponse.json()) as {
    status?: string;
    data?: { status?: string; amount?: string; currency?: string };
  };

  const decision = resolveChapaPaymentState(
    status,
    verifyData.data?.status,
    verifyResponse.ok && verifyData.status === "success",
  );

  const order = await prisma.order.findUnique({
    where: { id: payment.orderId },
    include: {
      items: true,
      user: {
        select: {
          email: true,
        },
      },
    },
  });

  if (!order) {
    return res.status(404).json({ status: "fail", message: "Order not found" });
  }

  if (decision.isSuccessful && order.paymentStatus !== "PAID") {
    await prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: { id: payment.id },
        data: { status: "PAID" },
      });

      await tx.order.update({
        where: { id: order.id },
        data: {
          status: "CONFIRMED",
          paymentStatus: "PAID",
        },
      });

      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            quantity: {
              decrement: item.quantity,
            },
          },
        });
      }
    });
  } else if (!decision.isSuccessful && order.paymentStatus !== "FAILED") {
    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: "FAILED" },
    });

    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: "CANCELLED",
        paymentStatus: "FAILED",
      },
    });
  }

  const userEmail = order.user?.email;
  if (decision.isSuccessful) {
    if (userEmail) {
      void notifyCustomerPaymentSuccess(userEmail, order.orderNumber);
    }
    void notifyAdminPaymentReceived(order.orderNumber);
  } else if (decision.paymentStatus === "FAILED") {
    if (userEmail) {
      void notifyCustomerPaymentFailed(userEmail, order.orderNumber);
    }
  }

  res.status(200).json({
    status: "success",
    message: decision.isSuccessful
      ? "Payment confirmed"
      : "Payment was not completed",
  });
});

export const chapaWebhook = catchAsync(async (req, res, next) => {
  const tx_ref =
    (req.body as { tx_ref?: string })?.tx_ref ||
    (req.query as { tx_ref?: string })?.tx_ref;

  if (!tx_ref) {
    return res.status(400).json({ status: "fail", message: "Missing tx_ref" });
  }

  return chapaCallback(req, res, next);
});
