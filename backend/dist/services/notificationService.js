"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notifyCustomerOrderPlaced = notifyCustomerOrderPlaced;
exports.notifyCustomerPaymentSuccess = notifyCustomerPaymentSuccess;
exports.notifyCustomerPaymentFailed = notifyCustomerPaymentFailed;
exports.notifyAdminNewOrder = notifyAdminNewOrder;
exports.notifyAdminPaymentReceived = notifyAdminPaymentReceived;
const sendEmail_js_1 = __importDefault(require("../utils/sendEmail.js"));
async function notifyCustomerOrderPlaced(email, orderNumber) {
    await (0, sendEmail_js_1.default)({
        email,
        subject: `Your order ${orderNumber} has been received`,
        html: `<p>Hello,</p><p>Your order <strong>${orderNumber}</strong> has been received and is being processed.</p>`,
    });
}
async function notifyCustomerPaymentSuccess(email, orderNumber) {
    await (0, sendEmail_js_1.default)({
        email,
        subject: `Payment confirmed for ${orderNumber}`,
        html: `<p>Hello,</p><p>Your payment for order <strong>${orderNumber}</strong> was confirmed successfully.</p>`,
    });
}
async function notifyCustomerPaymentFailed(email, orderNumber) {
    await (0, sendEmail_js_1.default)({
        email,
        subject: `Payment issue for ${orderNumber}`,
        html: `<p>Hello,</p><p>There was an issue with the payment for order <strong>${orderNumber}</strong>.</p>`,
    });
}
async function notifyAdminNewOrder(orderNumber) {
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail)
        return;
    await (0, sendEmail_js_1.default)({
        email: adminEmail,
        subject: `New order received: ${orderNumber}`,
        html: `<p>A new order <strong>${orderNumber}</strong> has been placed.</p>`,
    });
}
async function notifyAdminPaymentReceived(orderNumber) {
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail)
        return;
    await (0, sendEmail_js_1.default)({
        email: adminEmail,
        subject: `Payment received for ${orderNumber}`,
        html: `<p>Payment was received for order <strong>${orderNumber}</strong>.</p>`,
    });
}
//# sourceMappingURL=notificationService.js.map