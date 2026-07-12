export type ChapaInitPayload = {
    amount: number;
    email: string;
    fullName: string;
    phone: string;
    txRef: string;
    callbackUrl: string;
    returnUrl: string;
    orderNumber: string;
};
export type ChapaVerificationResult = {
    success: boolean;
    status: string | undefined;
    amount: string | undefined;
    currency: string | undefined;
    message: string | undefined;
};
export declare const initializeChapaPayment: ({ amount, email, fullName, phone, txRef, callbackUrl, returnUrl, orderNumber, }: ChapaInitPayload) => Promise<{
    checkoutUrl: string | undefined;
    txRef: string;
}>;
export declare const verifyChapaPayment: (txRef: string) => Promise<ChapaVerificationResult>;
//# sourceMappingURL=chapaService.d.ts.map