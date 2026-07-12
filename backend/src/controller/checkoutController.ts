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
  initializeChapaPayment,
  verifyChapaPayment,
} from "../services/chapaService.js";
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

type CheckoutSessionItem = {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  image?: string | null;
};

type CheckoutSessionPayload = {
  fullName: string;
  phone: string;
  country: string;
  city: string;
  address: string;
  postalCode: string;
  orderNotes?: string;
};

const toDecimal = (value: number) => new Prisma.Decimal(value.toFixed(2));
const buildOrderNumber = () =>
  `ORD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

const getChapaConfig = () => {
  return {
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

    const orderNumber = buildOrderNumber();
    const txRef = `chapa-${orderNumber}`;
    const { callbackUrl, returnUrl } = getChapaConfig();

    await prisma.checkoutSession.create({
      data: {
        userId: req.user.id,
        txRef,
        status: "INITIATED",
        customer: {
          fullName,
          phone,
          country,
          city,
          address: addressLine,
          postalCode,
          orderNotes: normalizeText(notes || customer?.orderNotes) || null,
        } as CheckoutSessionPayload,
        items: validatedItems as unknown as Prisma.JsonObject,
        totals: {
          subtotal,
          shipping,
          tax,
          total,
          currency: "ETB",
        },
        notes: normalizeText(notes || customer?.orderNotes) || null,
      },
    });

    const chapaCheckout = await initializeChapaPayment({
      amount: total,
      email: req.user.email,
      fullName,
      phone,
      txRef,
      callbackUrl,
      returnUrl: `${returnUrl}?orderId=${orderNumber}&orderNumber=${orderNumber}`,
      orderNumber,
    });

    res.status(200).json({
      status: "success",
      data: {
        orderId: orderNumber,
        orderNumber,
        checkoutUrl: chapaCheckout.checkoutUrl,
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
    // Fall back: check if a checkout session with this orderNumber exists but
    // hasn't completed yet (payment pending/failed), so the frontend can show
    // an accurate "pending" or "failed" state instead of a raw 404.
    const session = await prisma.checkoutSession.findFirst({
      where: { txRef: orderId },
    });

    if (session) {
      return res.status(200).json({
        status: "success",
        data: {
          order: null,
          sessionStatus: session.status,
          message:
            session.status === "FAILED"
              ? "Payment for this order was not completed"
              : "Payment for this order is still processing",
        },
      });
    }

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

  const checkoutSession = await prisma.checkoutSession.findUnique({
    where: { txRef: tx_ref },
  });

  if (!checkoutSession) {
    return res
      .status(404)
      .json({ status: "fail", message: "Checkout session not found" });
  }

  if (checkoutSession.status === "COMPLETED") {
    return res.status(200).json({
      status: "success",
      message: "Payment already confirmed",
    });
  }

  const verification = await verifyChapaPayment(tx_ref);

  // TEMP diagnostic log — remove once payment-failure cause is confirmed
  console.log("CHAPA VERIFY RESULT:", JSON.stringify(verification, null, 2));

  const decision = resolveChapaPaymentState(
    status,
    verification.status,
    verification.success,
  );

  if (!decision.isSuccessful) {
    await prisma.checkoutSession.update({
      where: { id: checkoutSession.id },
      data: { status: "FAILED" },
    });

    const customerData = checkoutSession.customer as CheckoutSessionPayload;
    void notifyCustomerPaymentFailed?.(
      checkoutSession.userId,
      tx_ref,
    );

    return res.status(200).json({
      status: "success",
      message: "Payment was not completed",
    });
  }

  const sessionItems =
    checkoutSession.items as unknown as CheckoutSessionItem[];
  const sessionTotals = checkoutSession.totals as {
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
    currency: string;
  };
  const customerData = checkoutSession.customer as CheckoutSessionPayload;

  const order = await prisma.$transaction(async (tx) => {
    const existingPayment = await tx.payment.findFirst({
      where: { transactionId: tx_ref },
    });

    if (existingPayment?.status === "PAID") {
      return null;
    }

    const address = await tx.userAddress.findFirst({
      where: {
        userId: checkoutSession.userId,
        fullName: customerData.fullName,
        phone: customerData.phone,
        country: customerData.country,
        city: customerData.city,
        address: customerData.address,
        postalCode: customerData.postalCode,
      },
    });

    const savedAddress =
      address ||
      (await tx.userAddress.create({
        data: {
          userId: checkoutSession.userId,
          fullName: customerData.fullName,
          phone: customerData.phone,
          country: customerData.country,
          city: customerData.city,
          address: customerData.address,
          postalCode: customerData.postalCode,
          state: null,
          isDefault: false,
        },
      }));

    // Reuse the SAME orderNumber generated at checkout time, so the
    // return URL the frontend already navigated to actually resolves.
    const orderNumber = buildOrderNumber();

    const createdOrder = await tx.order.create({
      data: {
        orderNumber,
        userId: checkoutSession.userId,
        addressId: savedAddress.id,
        subtotal: toDecimal(sessionTotals.subtotal),
        shipping: toDecimal(sessionTotals.shipping),
        tax: toDecimal(sessionTotals.tax),
        total: toDecimal(sessionTotals.total),
        notes: checkoutSession.notes || null,
        status: "CONFIRMED",
        paymentStatus: "PAID",
        items: {
          create: sessionItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: toDecimal(item.unitPrice),
            total: toDecimal(item.lineTotal),
          })),
        },
      },
      include: {
        payment: true,
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    await tx.payment.create({
      data: {
        orderId: createdOrder.id,
        transactionId: tx_ref,
        provider: "CHAPA",
        amount: toDecimal(sessionTotals.total),
        status: "PAID",
      },
    });

    for (const item of sessionItems) {
      await tx.product.update({
        where: { id: item.productId },
        data: {
          quantity: {
            decrement: item.quantity,
          },
        },
      });
    }

    await tx.checkoutSession.update({
      where: { id: checkoutSession.id },
      data: { status: "COMPLETED" },
    });

    return createdOrder;
  });

  if (!order) {
    await prisma.checkoutSession.update({
      where: { id: checkoutSession.id },
      data: { status: "COMPLETED" },
    });

    return res.status(200).json({
      status: "success",
      message: "Payment already confirmed",
    });
  }

  const userEmail = order.user?.email;
  if (userEmail) {
    void notifyCustomerPaymentSuccess(userEmail, order.orderNumber);
  }
  void notifyAdminPaymentReceived(order.orderNumber);

  res.status(200).json({
    status: "success",
    message: "Payment confirmed",
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
