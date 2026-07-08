"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCheckout = void 0;
const Prisma_js_1 = require("../lib/Prisma.js");
const AppError_js_1 = require("../utils/AppError.js");
const catchAsync__js_1 = require("../utils/catchAsync .js");
exports.validateCheckout = (0, catchAsync__js_1.catchAsync)(async (req, res, next) => {
    var _a;
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
        return next(new AppError_js_1.AppError("Your cart is empty", 400));
    }
    const validatedItems = [];
    let subtotal = 0;
    for (const item of items) {
        const quantity = Number((_a = item === null || item === void 0 ? void 0 : item.quantity) !== null && _a !== void 0 ? _a : 0);
        const productId = item === null || item === void 0 ? void 0 : item.productId;
        if (!productId || !Number.isInteger(quantity) || quantity < 1) {
            return next(new AppError_js_1.AppError("Each cart item must have a valid product id and quantity", 400));
        }
        const product = await Prisma_js_1.prisma.product.findUnique({
            where: { id: productId },
        });
        if (!product) {
            return next(new AppError_js_1.AppError("One or more products in your cart were not found", 404));
        }
        if (!product.isActive) {
            return next(new AppError_js_1.AppError(`${product.name} is currently unavailable`, 400));
        }
        const unitPrice = Number(product.price);
        if (Number.isNaN(unitPrice)) {
            return next(new AppError_js_1.AppError(`${product.name} has an invalid price`, 400));
        }
        const maxAllowed = 10;
        if (quantity > maxAllowed) {
            return next(new AppError_js_1.AppError(`${product.name} quantity exceeds the allowed limit of ${maxAllowed}`, 400));
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
});
//# sourceMappingURL=checkoutController.js.map