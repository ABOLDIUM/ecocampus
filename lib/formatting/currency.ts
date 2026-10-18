/**
 * EcoCampus Fixed-Precision Money Formatting Utility
 * All monetary amounts in EcoCampus are stored in integer minor units (kobo / cents)
 * to prevent floating-point rounding errors.
 */

export function formatKoboToNaira(amountKobo: number, hideBalance = false): string {
  if (hideBalance) {
    return "₦ ••••••";
  }
  const naira = amountKobo / 100;
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(naira);
}

export function formatCentsToUsd(amountCents: number, hideBalance = false): string {
  if (hideBalance) {
    return "$ ••••••";
  }
  const usd = amountCents / 100;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(usd);
}
