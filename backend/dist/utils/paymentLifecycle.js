"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveChapaPaymentState = resolveChapaPaymentState;
exports.buildInvoiceNumber = buildInvoiceNumber;
function resolveChapaPaymentState(callbackStatus, verificationStatus, verificationSuccess = false) {
    const normalizedCallback = callbackStatus === null || callbackStatus === void 0 ? void 0 : callbackStatus.toLowerCase();
    const normalizedVerification = verificationStatus === null || verificationStatus === void 0 ? void 0 : verificationStatus.toLowerCase();
    const success = verificationSuccess ||
        normalizedVerification === "success" ||
        normalizedCallback === "success";
    if (success) {
        return {
            isSuccessful: true,
            paymentStatus: "PAID",
            orderStatus: "CONFIRMED",
            reason: "Payment verified successfully",
        };
    }
    if (normalizedCallback === "failed" ||
        normalizedCallback === "cancelled" ||
        normalizedCallback === "expired" ||
        normalizedVerification === "failed" ||
        normalizedVerification === "cancelled" ||
        normalizedVerification === "expired") {
        return {
            isSuccessful: false,
            paymentStatus: "FAILED",
            orderStatus: "CANCELLED",
            reason: "Payment was not completed",
        };
    }
    return {
        isSuccessful: false,
        paymentStatus: "PENDING",
        orderStatus: "PENDING",
        reason: "Payment is still pending verification",
    };
}
function buildInvoiceNumber(orderNumber) {
    const cleaned = orderNumber.replace(/^ORD-/, "").replace(/[^A-Z0-9]/gi, "");
    return `INV-${cleaned}`.toUpperCase();
}
//# sourceMappingURL=paymentLifecycle.js.map