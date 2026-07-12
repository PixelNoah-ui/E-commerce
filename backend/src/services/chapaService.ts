import { AppError } from "../utils/AppError.js";

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

const isValidChapaUrl = (value: string | undefined) => {
  if (!value) return false;

  try {
    const parsed = new URL(value);
    const isLocalhost = ["localhost", "127.0.0.1", "::1"].includes(
      parsed.hostname,
    );

    if (parsed.protocol === "https:" && !!parsed.hostname) {
      return true;
    }

    if (
      parsed.protocol === "http:" &&
      isLocalhost &&
      process.env.NODE_ENV !== "production"
    ) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
};

const getChapaConfig = (callbackUrl?: string, returnUrl?: string) => {
  const secretKey = process.env.CHAPA_SECRET_KEY;
  if (!secretKey) {
    throw new AppError("Chapa secret key is not configured", 500);
  }

  const baseUrl = (
    process.env.CHAPA_BASE_URL || "https://api.chapa.co/v1/transaction"
  ).replace(/\/$/, "");
  const effectiveCallbackUrl =
    callbackUrl || process.env.CHAPA_CALLBACK_URL || process.env.CALLBACK_URL;
  const effectiveReturnUrl =
    returnUrl || process.env.CHAPA_RETURN_URL || process.env.RETURN_URL;

  if (!isValidChapaUrl(effectiveCallbackUrl)) {
    throw new AppError(
      "CHAPA_CALLBACK_URL must be a public HTTPS URL, or localhost for local development",
      500,
    );
  }

  if (!isValidChapaUrl(effectiveReturnUrl)) {
    throw new AppError(
      "CHAPA_RETURN_URL must be a public HTTPS URL, or localhost for local development",
      500,
    );
  }

  return {
    secretKey,
    baseUrl,
    callbackUrl: effectiveCallbackUrl as string,
    returnUrl: effectiveReturnUrl as string,
  };
};

export const initializeChapaPayment = async ({
  amount,
  email,
  fullName,
  phone,
  txRef,
  callbackUrl,
  returnUrl,
  orderNumber,
}: ChapaInitPayload) => {
  const {
    secretKey,
    baseUrl,
    callbackUrl: configuredCallbackUrl,
    returnUrl: configuredReturnUrl,
  } = getChapaConfig(callbackUrl, returnUrl);
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
  let data: {
    status?: string;
    message?: string;
    data?: { checkout_url?: string };
  } | null = null;

  if (responseText) {
    try {
      data = JSON.parse(responseText) as {
        status?: string;
        message?: string;
        data?: { checkout_url?: string };
      };
    } catch {
      data = { message: responseText };
    }
  }

  if (!response.ok || data?.status !== "success") {
    throw new AppError(
      data?.message || `Chapa initialize failed with status ${response.status}`,
      502,
    );
  }

  return {
    checkoutUrl: data.data?.checkout_url,
    txRef,
  };
};

export const verifyChapaPayment = async (
  txRef: string,
): Promise<ChapaVerificationResult> => {
  const { secretKey, baseUrl } = getChapaConfig();
  const response = await fetch(`${baseUrl}/verify/${txRef}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${secretKey}`,
    },
  });

  const data = (await response.json()) as {
    status?: string;
    message?: string;
    data?: { status?: string; amount?: string; currency?: string };
  };

  if (!response.ok) {
    return {
      success: false,
      status: data.data?.status,
      amount: data.data?.amount,
      currency: data.data?.currency,
      message: data.message || "Unable to verify payment",
    };
  }

  return {
    success: data.status === "success",
    status: data.data?.status,
    amount: data.data?.amount,
    currency: data.data?.currency,
    message: data.message,
  };
};
