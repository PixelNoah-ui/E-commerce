export type PaymentDecision = {
    isSuccessful: boolean;
    paymentStatus: "PAID" | "FAILED" | "PENDING";
    orderStatus: "CONFIRMED" | "CANCELLED" | "PENDING";
    reason: string;
};
export declare function resolveChapaPaymentState(callbackStatus?: string, verificationStatus?: string, verificationSuccess?: boolean): PaymentDecision;
export declare function buildInvoiceNumber(orderNumber: string): string;
//# sourceMappingURL=paymentLifecycle.d.ts.map