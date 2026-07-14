// Force ETB as the display currency. If an env var is present and set to AED,
// prefer ETB instead so the UI doesn't show AED unexpectedly.
export const CURRENCY_CODE =
  (process.env.NEXT_PUBLIC_CURRENCY_CODE === "AED"
    ? "ETB"
    : process.env.NEXT_PUBLIC_CURRENCY_CODE) || "ETB";

// Use the currency code (ETB) so it's explicit in the UI instead of a symbol.
export const CURRENCY_DISPLAY: "symbol" | "code" | "name" =
  (process.env.NEXT_PUBLIC_CURRENCY_DISPLAY as any) || "code";

export function formatPrice(
  amount: number | string | undefined | null,
  options?: { minimumFractionDigits?: number; maximumFractionDigits?: number },
) {
  const value = amount == null || amount === "" ? 0 : Number(amount);
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: CURRENCY_CODE,
      currencyDisplay: CURRENCY_DISPLAY,
      minimumFractionDigits: options?.minimumFractionDigits ?? 2,
      maximumFractionDigits: options?.maximumFractionDigits ?? 2,
    }).format(value);
  } catch (e) {
    // fallback: simple formatted number with two decimals and label
    return `${Number(value).toLocaleString(undefined, {
      minimumFractionDigits: options?.minimumFractionDigits ?? 2,
      maximumFractionDigits: options?.maximumFractionDigits ?? 2,
    })} ${CURRENCY_CODE}`;
  }
}

export default formatPrice;
