export type PaymentDecision = {
  isSuccessful: boolean;
  paymentStatus: "PAID" | "FAILED" | "PENDING";
  orderStatus: "CONFIRMED" | "CANCELLED" | "PENDING";
  reason: string;
};

export function resolveChapaPaymentState(
  callbackStatus?: string,
  verificationStatus?: string,
  verificationSuccess = false,
): PaymentDecision {
  const normalizedCallback = callbackStatus?.toLowerCase();
  const normalizedVerification = verificationStatus?.toLowerCase();

  const success =
    verificationSuccess ||
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

  if (
    normalizedCallback === "failed" ||
    normalizedCallback === "cancelled" ||
    normalizedCallback === "expired" ||
    normalizedVerification === "failed" ||
    normalizedVerification === "cancelled" ||
    normalizedVerification === "expired"
  ) {
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

export function buildInvoiceNumber(orderNumber: string) {
  const cleaned = orderNumber.replace(/^ORD-/, "").replace(/[^A-Z0-9]/gi, "");
  return `INV-${cleaned}`.toUpperCase();
}
