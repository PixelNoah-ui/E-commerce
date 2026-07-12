"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chapaWebhook = exports.chapaCallback = exports.getOrder = exports.initializeCheckout = exports.validateCheckout = void 0;
const crypto_1 = __importDefault(require("crypto"));
const client_js_1 = require("../generated/prisma/client.js");
const Prisma_js_1 = require("../lib/Prisma.js");
const AppError_js_1 = require("../utils/AppError.js");
const catchAsync__js_1 = require("../utils/catchAsync .js");
const notificationService_js_1 = require("../services/notificationService.js");
const paymentLifecycle_js_1 = require("../utils/paymentLifecycle.js");
const MAX_ORDER_ITEMS = 20;
const MAX_ORDER_QUANTITY = 10;
const normalizePhone = (value) => value.trim().replace(/\s+/g, "");
const normalizeName = (value) => value.trim();
const normalizeText = (value) => (value === null || value === void 0 ? void 0 : value.trim()) || "";
const toDecimal = (value) => new client_js_1.Prisma.Decimal(value.toFixed(2));
const buildOrderNumber = () => `ORD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
const getChapaConfig = () => {
    const secretKey = process.env.CHAPA_SECRET_KEY;
    if (!secretKey) {
        throw new AppError_js_1.AppError("Chapa secret key is not configured", 500);
    }
    return {
        secretKey,
        baseUrl: process.env.CHAPA_BASE_URL || "https://api.chapa.co/v1/transaction",
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
    var _a;
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
        const address = await Prisma_js_1.prisma.userAddress.create({
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
        const order = await Prisma_js_1.prisma.order.create({
            data: {
                orderNumber,
                userId: req.user.id,
                addressId: address.id,
                subtotal: toDecimal(subtotal),
                shipping: toDecimal(shipping),
                tax: toDecimal(tax),
                total: toDecimal(total),
                notes: normalizeText(notes || (customer === null || customer === void 0 ? void 0 : customer.orderNotes)) || null,
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
        void (0, notificationService_js_1.notifyCustomerOrderPlaced)(req.user.email, order.orderNumber);
        void (0, notificationService_js_1.notifyAdminNewOrder)(order.orderNumber);
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
        const chapaData = (await chapaResponse.json());
        if (!chapaResponse.ok || chapaData.status !== "success") {
            await Prisma_js_1.prisma.payment.update({
                where: { orderId: order.id },
                data: { status: "FAILED" },
            });
            await Prisma_js_1.prisma.order.update({
                where: { id: order.id },
                data: { status: "CANCELLED", paymentStatus: "FAILED" },
            });
            return next(new AppError_js_1.AppError(chapaData.message || "Unable to initialize payment", 502));
        }
        await Prisma_js_1.prisma.payment.update({
            where: { orderId: order.id },
            data: { transactionId: txRef },
        });
        res.status(200).json({
            status: "success",
            data: {
                orderId: order.id,
                orderNumber: order.orderNumber,
                checkoutUrl: (_a = chapaData.data) === null || _a === void 0 ? void 0 : _a.checkout_url,
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
    const payment = await Prisma_js_1.prisma.payment.findFirst({
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
    const verifyData = (await verifyResponse.json());
    const decision = (0, paymentLifecycle_js_1.resolveChapaPaymentState)(status, (_e = verifyData.data) === null || _e === void 0 ? void 0 : _e.status, verifyResponse.ok && verifyData.status === "success");
    const order = await Prisma_js_1.prisma.order.findUnique({
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
        await Prisma_js_1.prisma.$transaction(async (tx) => {
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
    }
    else if (!decision.isSuccessful && order.paymentStatus !== "FAILED") {
        await Prisma_js_1.prisma.payment.update({
            where: { id: payment.id },
            data: { status: "FAILED" },
        });
        await Prisma_js_1.prisma.order.update({
            where: { id: order.id },
            data: {
                status: "CANCELLED",
                paymentStatus: "FAILED",
            },
        });
    }
    const userEmail = (_f = order.user) === null || _f === void 0 ? void 0 : _f.email;
    if (decision.isSuccessful) {
        if (userEmail) {
            void (0, notificationService_js_1.notifyCustomerPaymentSuccess)(userEmail, order.orderNumber);
        }
        void (0, notificationService_js_1.notifyAdminPaymentReceived)(order.orderNumber);
    }
    else if (decision.paymentStatus === "FAILED") {
        if (userEmail) {
            void (0, notificationService_js_1.notifyCustomerPaymentFailed)(userEmail, order.orderNumber);
        }
    }
    res.status(200).json({
        status: "success",
        message: decision.isSuccessful
            ? "Payment confirmed"
            : "Payment was not completed",
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