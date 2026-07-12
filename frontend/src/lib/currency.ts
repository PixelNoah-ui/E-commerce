export const CURRENCY_CODE = process.env.NEXT_PUBLIC_CURRENCY_CODE || "ETB";
export const CURRENCY_DISPLAY: "symbol" | "code" | "name" =
  (process.env.NEXT_PUBLIC_CURRENCY_DISPLAY as any) || "symbol";

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
