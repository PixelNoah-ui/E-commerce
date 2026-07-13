"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chapaWebhook = exports.chapaCallback = exports.getOrder = exports.initializeCheckout = exports.validateCheckout = void 0;
const crypto_1 = __importDefault(require("crypto"));
const Prisma_js_1 = require("../lib/Prisma.js");
const AppError_js_1 = require("../utils/AppError.js");
const catchAsync__js_1 = require("../utils/catchAsync .js");
const notificationService_js_1 = require("../services/notificationService.js");
const chapaService_js_1 = require("../services/chapaService.js");
const paymentLifecycle_js_1 = require("../utils/paymentLifecycle.js");
const client_js_1 = require("../generated/prisma/client.js");
const MAX_ORDER_ITEMS = 20;
const MAX_ORDER_QUANTITY = 10;
const normalizePhone = (value) => value.trim().replace(/\s+/g, "");
const normalizeName = (value) => value.trim();
const normalizeText = (value) => (value === null || value === void 0 ? void 0 : value.trim()) || "";
const toDecimal = (value) => new client_js_1.Prisma.Decimal(value.toFixed(2));
const buildOrderNumber = () => `ORD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
const getChapaConfig = () => {
    return {
        callbackUrl: process.env.CHAPA_CALLBACK_URL ||
            `${process.env.BACKEND_URL || "http://localhost:8000"}/api/v1/checkout/chapa/callback`,
        returnUrl: process.env.CHAPA_RETURN_URL ||
            `${process.env.CLIENT_URL || "http://localhost:3000"}/checkout/success`,
    };
};
const validateCheckoutItems = async (items) => {
    var _a;
    if (!Array.isArray(items) || items.length === 0) {
        throw new AppError_js_1.AppError("Your cart is empty", 400);
    }
    if (items.length > MAX_ORDER_ITEMS) {
        throw new AppError_js_1.AppError("You can only checkout up to 20 items at once", 400);
    }
    const validatedItems = [];
    let subtotal = 0;
    for (const item of items) {
        const quantity = Number((_a = item === null || item === void 0 ? void 0 : item.quantity) !== null && _a !== void 0 ? _a : 0);
        const productId = item === null || item === void 0 ? void 0 : item.productId;
        if (!productId || !Number.isInteger(quantity) || quantity < 1) {
            throw new AppError_js_1.AppError("Each cart item must have a valid product id and quantity", 400);
        }
        if (quantity > MAX_ORDER_QUANTITY) {
            throw new AppError_js_1.AppError(`Each item quantity cannot exceed ${MAX_ORDER_QUANTITY}`, 400);
        }
        const product = await Prisma_js_1.prisma.product.findUnique({
            where: { id: productId },
        });
        if (!product) {
            throw new AppError_js_1.AppError("One or more products in your cart were not found", 404);
        }
        if (!product.isActive) {
            throw new AppError_js_1.AppError(`${product.name} is currently unavailable`, 400);
        }
        const unitPrice = Number(product.price);
        if (Number.isNaN(unitPrice)) {
            throw new AppError_js_1.AppError(`${product.name} has an invalid price`, 400);
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
exports.validateCheckout = (0, catchAsync__js_1.catchAsync)(async (req, res, next) => {
    const { items } = req.body;
    try {
        const { validatedItems, subtotal } = await validateCheckoutItems(items || []);
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
    }
    catch (error) {
        next(error);
    }
});
exports.initializeCheckout = (0, catchAsync__js_1.catchAsync)(async (req, res, next) => {
    const { items, customer, notes } = req.body;
    const fullName = normalizeName((customer === null || customer === void 0 ? void 0 : customer.fullName) || "");
    const phone = normalizePhone((customer === null || customer === void 0 ? void 0 : customer.phone) || "");
    const country = normalizeText(customer === null || customer === void 0 ? void 0 : customer.country);
    const city = normalizeText(customer === null || customer === void 0 ? void 0 : customer.city);
    const addressLine = normalizeText(customer === null || customer === void 0 ? void 0 : customer.address);
    const postalCode = normalizeText(customer === null || customer === void 0 ? void 0 : customer.postalCode);
    if (!fullName || !phone || !country || !city || !addressLine || !postalCode) {
        return next(new AppError_js_1.AppError("Please complete the delivery information", 400));
    }
    try {
        const { validatedItems, subtotal } = await validateCheckoutItems(items || []);
        const shipping = subtotal > 100 ? 0 : 10;
        const tax = Number((subtotal * 0.07).toFixed(2));
        const total = Number((subtotal + shipping + tax).toFixed(2));
        const orderNumber = buildOrderNumber();
        const txRef = `chapa-${orderNumber}`;
        const { callbackUrl, returnUrl } = getChapaConfig();
        await Prisma_js_1.prisma.checkoutSession.create({
            data: {
                userId: req.user.id,
                txRef,
                orderNumber, // ← store it so the callback can reuse the SAME orderNumber
                status: "INITIATED",
                customer: {
                    fullName,
                    phone,
                    country,
                    city,
                    address: addressLine,
                    postalCode,
                    orderNotes: normalizeText(notes || (customer === null || customer === void 0 ? void 0 : customer.orderNotes)) || null,
                },
                items: validatedItems,
                totals: {
                    subtotal,
                    shipping,
                    tax,
                    total,
                    currency: "ETB",
                },
                notes: normalizeText(notes || (customer === null || customer === void 0 ? void 0 : customer.orderNotes)) || null,
            },
        });
        const chapaCheckout = await (0, chapaService_js_1.initializeChapaPayment)({
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
    }
    catch (error) {
        next(error);
    }
});
exports.getOrder = (0, catchAsync__js_1.catchAsync)(async (req, res, next) => {
    const { orderId } = req.params;
    if (!orderId) {
        return next(new AppError_js_1.AppError("Order id is required", 400));
    }
    const order = await Prisma_js_1.prisma.order.findFirst({
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
        const session = await Prisma_js_1.prisma.checkoutSession.findFirst({
            where: { orderNumber: orderId },
        });
        if (session) {
            const verification = await (0, chapaService_js_1.verifyChapaPayment)(session.txRef);
            const decision = (0, paymentLifecycle_js_1.resolveChapaPaymentState)(undefined, verification.status, verification.success);
            if (decision.isSuccessful) {
                const successfulOrder = await finalizeSuccessfulCheckout(session, session.txRef);
                if (successfulOrder) {
                    const invoiceNumber = (0, paymentLifecycle_js_1.buildInvoiceNumber)(successfulOrder.orderNumber);
                    const estimatedDelivery = new Date(new Date(successfulOrder.createdAt).getTime() + 5 * 86400000).toISOString();
                    return res.status(200).json({
                        status: "success",
                        data: {
                            order: {
                                ...successfulOrder,
                                invoiceNumber,
                                estimatedDelivery,
                                discount: 0,
                                currency: "ETB",
                                billingAddress: successfulOrder.address,
                            },
                        },
                    });
                }
            }
            return res.status(200).json({
                status: "success",
                data: {
                    order: null,
                    sessionStatus: session.status,
                    message: session.status === "FAILED"
                        ? "Payment for this order was not completed"
                        : "Payment for this order is still processing",
                },
            });
        }
        return next(new AppError_js_1.AppError("Order not found", 404));
    }
    if (order.userId !== req.user.id) {
        return next(new AppError_js_1.AppError("Unauthorized access to this order", 403));
    }
    const invoiceNumber = (0, paymentLifecycle_js_1.buildInvoiceNumber)(order.orderNumber);
    const estimatedDelivery = new Date(new Date(order.createdAt).getTime() + 5 * 86400000).toISOString();
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
const validateChapaSignature = (body, signature) => {
    const secretKey = process.env.CHAPA_SECRET_KEY;
    if (!secretKey || !signature) {
        return true;
    }
    const expected = crypto_1.default
        .createHmac("sha256", secretKey)
        .update(JSON.stringify(body))
        .digest("hex");
    return expected === signature;
};
const finalizeSuccessfulCheckout = async (checkoutSession, txRef) => {
    const sessionItems = checkoutSession.items;
    const sessionTotals = checkoutSession.totals;
    const customerData = checkoutSession.customer;
    return Prisma_js_1.prisma.$transaction(async (tx) => {
        var _a;
        const existingPayment = await tx.payment.findFirst({
            where: { transactionId: txRef },
        });
        if (existingPayment) {
            const existingOrder = await tx.order.findUnique({
                where: { id: existingPayment.orderId },
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
            if (existingOrder) {
                return existingOrder;
            }
        }
        if ((existingPayment === null || existingPayment === void 0 ? void 0 : existingPayment.status) === "PAID") {
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
        const savedAddress = address ||
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
        const orderNumber = (_a = checkoutSession.orderNumber) !== null && _a !== void 0 ? _a : buildOrderNumber();
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
        await tx.payment.create({
            data: {
                orderId: createdOrder.id,
                transactionId: txRef,
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
};
exports.chapaCallback = (0, catchAsync__js_1.catchAsync)(async (req, res, next) => {
    var _a, _b, _c, _d, _e, _f;
    const tx_ref = ((_a = req.body) === null || _a === void 0 ? void 0 : _a.tx_ref) ||
        ((_b = req.query) === null || _b === void 0 ? void 0 : _b.tx_ref);
    const status = ((_c = req.body) === null || _c === void 0 ? void 0 : _c.status) ||
        ((_d = req.query) === null || _d === void 0 ? void 0 : _d.status);
    if (!tx_ref) {
        return res.status(400).json({ status: "fail", message: "Missing tx_ref" });
    }
    const signature = req.get("x-chapa-signature") || req.get("x-signature");
    if (!validateChapaSignature(req.body, signature)) {
        return res
            .status(401)
            .json({ status: "fail", message: "Invalid signature" });
    }
    const checkoutSession = await Prisma_js_1.prisma.checkoutSession.findUnique({
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
    const verification = await (0, chapaService_js_1.verifyChapaPayment)(tx_ref);
    // TEMP diagnostic log — remove once payment-failure cause is confirmed
    console.log("CHAPA VERIFY RESULT:", JSON.stringify(verification, null, 2));
    const decision = (0, paymentLifecycle_js_1.resolveChapaPaymentState)(status, verification.status, verification.success);
    if (!decision.isSuccessful) {
        await Prisma_js_1.prisma.checkoutSession.update({
            where: { id: checkoutSession.id },
            data: { status: "FAILED" },
        });
        const customerData = checkoutSession.customer;
        // notify the customer their payment failed, if you have their email/user id
        void (notificationService_js_1.notifyCustomerPaymentFailed === null || notificationService_js_1.notifyCustomerPaymentFailed === void 0 ? void 0 : (0, notificationService_js_1.notifyCustomerPaymentFailed)(checkoutSession.userId, (_e = checkoutSession.orderNumber) !== null && _e !== void 0 ? _e : tx_ref));
        return res.status(200).json({
            status: "success",
            message: "Payment was not completed",
        });
    }
    const order = await finalizeSuccessfulCheckout(checkoutSession, tx_ref);
    if (!order) {
        await Prisma_js_1.prisma.checkoutSession.update({
            where: { id: checkoutSession.id },
            data: { status: "COMPLETED" },
        });
        return res.status(200).json({
            status: "success",
            message: "Payment already confirmed",
        });
    }
    const userEmail = (_f = order.user) === null || _f === void 0 ? void 0 : _f.email;
    if (userEmail) {
        void (0, notificationService_js_1.notifyCustomerPaymentSuccess)(userEmail, order.orderNumber);
    }
    void (0, notificationService_js_1.notifyAdminPaymentReceived)(order.orderNumber);
    res.status(200).json({
        status: "success",
        message: "Payment confirmed",
    });
});
exports.chapaWebhook = (0, catchAsync__js_1.catchAsync)(async (req, res, next) => {
    var _a, _b;
    const tx_ref = ((_a = req.body) === null || _a === void 0 ? void 0 : _a.tx_ref) ||
        ((_b = req.query) === null || _b === void 0 ? void 0 : _b.tx_ref);
    if (!tx_ref) {
        return res.status(400).json({ status: "fail", message: "Missing tx_ref" });
    }
    return (0, exports.chapaCallback)(req, res, next);
});
//# sourceMappingURL=checkoutController.js.map