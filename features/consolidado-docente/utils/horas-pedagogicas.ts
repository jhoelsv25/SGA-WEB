import { formatNumber } from "@/lib/formatters/number";

/** Sin dato en los consolidados anteriores a las horas pedagógicas (RF-013 V2). */
export const SIN_DATO_HORAS = "—";

/**
 * Horas pedagógicas con un decimal y coma decimal, como en el RF (17,3).
 * Devuelve «—» cuando el consolidado es anterior a la V2 y no trae el dato.
 */
export function formatearHoras(valor: number | null | undefined): string {
  if (valor === null || valor === undefined) return SIN_DATO_HORAS;
  return formatNumber(valor, { locale: "es-ES", decimals: 1 });
}

export function formatearMinutos(valor: number | null | undefined): string {
  if (valor === null || valor === undefined) return SIN_DATO_HORAS;
  return `${formatNumber(valor, { locale: "es-ES", decimals: 0 })} min`;
}
