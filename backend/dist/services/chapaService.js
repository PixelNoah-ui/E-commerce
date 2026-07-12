"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyChapaPayment = exports.initializeChapaPayment = void 0;
const AppError_js_1 = require("../utils/AppError.js");
const isValidChapaUrl = (value) => {
    if (!value)
        return false;
    try {
        const parsed = new URL(value);
        const isLocalhost = ["localhost", "127.0.0.1", "::1"].includes(parsed.hostname);
        if (parsed.protocol === "https:" && !!parsed.hostname) {
            return true;
        }
        if (parsed.protocol === "http:" &&
            isLocalhost &&
            process.env.NODE_ENV !== "production") {
            return true;
        }
        return false;
    }
    catch {
        return false;
    }
};
const getChapaConfig = (callbackUrl, returnUrl) => {
    const secretKey = process.env.CHAPA_SECRET_KEY;
    if (!secretKey) {
        throw new AppError_js_1.AppError("Chapa secret key is not configured", 500);
    }
    const baseUrl = (process.env.CHAPA_BASE_URL || "https://api.chapa.co/v1/transaction").replace(/\/$/, "");
    const effectiveCallbackUrl = callbackUrl || process.env.CHAPA_CALLBACK_URL || process.env.CALLBACK_URL;
    const effectiveReturnUrl = returnUrl || process.env.CHAPA_RETURN_URL || process.env.RETURN_URL;
    if (!isValidChapaUrl(effectiveCallbackUrl)) {
        throw new AppError_js_1.AppError("CHAPA_CALLBACK_URL must be a public HTTPS URL, or localhost for local development", 500);
    }
    if (!isValidChapaUrl(effectiveReturnUrl)) {
        throw new AppError_js_1.AppError("CHAPA_RETURN_URL must be a public HTTPS URL, or localhost for local development", 500);
    }
    return {
        secretKey,
        baseUrl,
        callbackUrl: effectiveCallbackUrl,
        returnUrl: effectiveReturnUrl,
    };
};
const initializeChapaPayment = async ({ amount, email, fullName, phone, txRef, callbackUrl, returnUrl, orderNumber, }) => {
    var _a;
    const { secretKey, baseUrl, callbackUrl: configuredCallbackUrl, returnUrl: configuredReturnUrl, } = getChapaConfig(callbackUrl, returnUrl);
    const response = await fetch(`${baseUrl}/initialize`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${secretKey}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            amount: amount.toFixed(2),
            currency: "ETB",
            email,
            first_name: fullName.split(" ")[0] || fullName,
            last_name: fullName.split(" ").slice(1).join(" ") || "Customer",
            phone_number: phone,
            tx_ref: txRef,
            callback_url: configuredCallbackUrl || callbackUrl,
            return_url: configuredReturnUrl || returnUrl,
            customization: {
                title: "Abdu Electronics",
                description: `Order ${orderNumber}`,
            },
        }),
    });
    const responseText = await response.text();
    let data = null;
    if (responseText) {
        try {
            data = JSON.parse(responseText);
        }
        catch {
            data = { message: responseText };
        }
    }
    if (!response.ok || (data === null || data === void 0 ? void 0 : data.status) !== "success") {
        throw new AppError_js_1.AppError((data === null || data === void 0 ? void 0 : data.message) || `Chapa initialize failed with status ${response.status}`, 502);
    }
    return {
        checkoutUrl: (_a = data.data) === null || _a === void 0 ? void 0 : _a.checkout_url,
        txRef,
    };
};
exports.initializeChapaPayment = initializeChapaPayment;
const verifyChapaPayment = async (txRef) => {
    var _a, _b, _c, _d, _e, _f;
    const { secretKey, baseUrl } = getChapaConfig();
    const response = await fetch(`${baseUrl}/verify/${txRef}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${secretKey}`,
        },
    });
    const data = (await response.json());
    if (!response.ok) {
        return {
            success: false,
            status: (_a = data.data) === null || _a === void 0 ? void 0 : _a.status,
            amount: (_b = data.data) === null || _b === void 0 ? void 0 : _b.amount,
            currency: (_c = data.data) === null || _c === void 0 ? void 0 : _c.currency,
            message: data.message || "Unable to verify payment",
        };
    }
    return {
        success: data.status === "success",
        status: (_d = data.data) === null || _d === void 0 ? void 0 : _d.status,
        amount: (_e = data.data) === null || _e === void 0 ? void 0 : _e.amount,
        currency: (_f = data.data) === null || _f === void 0 ? void 0 : _f.currency,
        message: data.message,
    };
};
exports.verifyChapaPayment = verifyChapaPayment;
//# sourceMappingURL=chapaService.js.map