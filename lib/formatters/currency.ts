export interface FormatCurrencyOptions {
  currency?: "PEN" | "USD" | "EUR";
  locale?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

/**
 * Formatea un valor numérico a moneda.
 * Por defecto usa Soles peruanos (PEN / S/).
 * Ejemplo: formatCurrency(1250.5) -> "S/ 1,250.50"
 */
export function formatCurrency(
  amount: number | string | null | undefined,
  options: FormatCurrencyOptions = {},
): string {
  if (amount === null || amount === undefined || amount === "") return "-";

  const num = typeof amount === "string" ? Number(amount) : amount;
  if (Number.isNaN(num)) return "-";

  const {
    currency = "PEN",
    locale = "es-PE",
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
  } = options;

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(num);
}
