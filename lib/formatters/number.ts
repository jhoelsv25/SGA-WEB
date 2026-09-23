export interface FormatNumberOptions {
  locale?: string;
  decimals?: number;
}

export interface FormatPercentOptions {
  isDecimal?: boolean;
  decimals?: number;
  locale?: string;
}

/**
 * Formatea números con separadores de miles y decimales.
 * Ejemplo: formatNumber(10500) -> "10,500"
 */
export function formatNumber(
  value: number | string | null | undefined,
  options: FormatNumberOptions = {},
): string {
  if (value === null || value === undefined || value === "") return "-";

  const num = typeof value === "string" ? Number(value) : value;
  if (Number.isNaN(num)) return "-";

  const { locale = "es-PE", decimals } = options;

  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

/**
 * Formatea un valor decimal o porcentaje a string porcentual.
 * @param value Valor decimal (ej: 0.15) o número entero si isDecimal es false
 * @param isDecimal Si es true (por defecto), 0.15 -> 15%
 */
export function formatPercent(
  value: number | string | null | undefined,
  options: FormatPercentOptions = {},
): string {
  if (value === null || value === undefined || value === "") return "-";

  const rawNum = typeof value === "string" ? Number(value) : value;
  if (Number.isNaN(rawNum)) return "-";

  const { isDecimal = true, decimals = 1, locale = "es-PE" } = options;
  const num = isDecimal ? rawNum * 100 : rawNum;

  return `${new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num)}%`;
}
