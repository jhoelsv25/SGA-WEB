import {
  DIMENSIONES_INDICADORES,
  FORMULAS_INDICADORES,
  FUENTES_INDICADORES,
  NOMBRES_INDICADORES,
} from "../consts";
import type { Indicador } from "../types";

/**
 * Formatea un número como porcentaje con 2 decimales y sufijo " %".
 * Si el valor es nulo, indefinido o no numérico, retorna "Sin datos".
 *
 * Ejemplos:
 *   96.6101 -> "96.61 %"
 *   null -> "Sin datos"
 */
export function formatearPorcentaje(
  valor: number | null | undefined,
  textoSinDatos = "Sin datos",
): string {
  if (valor === null || valor === undefined || Number.isNaN(valor)) {
    return textoSinDatos;
  }
  return `${valor.toFixed(2)} %`;
}

/**
 * Formatea la variación en puntos porcentuales entre dos mediciones con signo explícito y sufijo " pp".
 * Si no hay comparación válida, retorna "Sin pretest".
 *
 * Ejemplos:
 *   15.7 -> "+15.70 pp"
 *   -3.25 -> "-3.25 pp"
 *   0 -> "+0.00 pp"
 *   null -> "Sin pretest"
 */
export function formatearVariacionPuntos(
  valor: number | null | undefined,
  textoSinDato = "Sin pretest",
): string {
  if (valor === null || valor === undefined || Number.isNaN(valor)) {
    return textoSinDato;
  }
  const signo = valor >= 0 ? "+" : "";
  return `${signo}${valor.toFixed(2)} pp`;
}

/**
 * Retorna el nombre completo oficial del indicador en español.
 */
export function obtenerEtiquetaIndicador(indicador: Indicador): string {
  return NOMBRES_INDICADORES[indicador] ?? indicador;
}

/**
 * Retorna la dimensión académica de la tesis correspondiente al indicador.
 */
export function obtenerDimensionIndicador(indicador: Indicador): string {
  return DIMENSIONES_INDICADORES[indicador] ?? "";
}

/**
 * Retorna el módulo o fuente del sistema donde se originan los datos del indicador.
 */
export function obtenerFuenteIndicador(indicador: Indicador): string {
  return FUENTES_INDICADORES[indicador] ?? "";
}

/**
 * Retorna la fórmula matemática textual del indicador.
 */
export function obtenerFormulaIndicador(indicador: Indicador): string {
  return FORMULAS_INDICADORES[indicador] ?? "";
}
