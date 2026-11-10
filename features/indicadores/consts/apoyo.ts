import type { IndicadorApoyo } from "../types";

/**
 * Columnas de los indicadores de apoyo del seguimiento docente (RF-020 V2).
 * Son informativos: no tienen meta, semáforo ni calificación.
 */
export const COLUMNAS_APOYO: ReadonlyArray<{ clave: IndicadorApoyo; titulo: string }> = [
  { clave: "jornadasEfectivas", titulo: "Jornadas efectivas" },
  { clave: "minutosPerdidos", titulo: "Minutos perdidos" },
  { clave: "promedioMinutosPerdidos", titulo: "Promedio por sesión" },
  { clave: "puntualidad", titulo: "Puntualidad" },
  { clave: "minutosFueraAula", titulo: "Minutos fuera del aula" },
  { clave: "tiempoResolucion", titulo: "Tiempo de resolución" },
];

export const TITULO_SECCION_APOYO = "Indicadores de apoyo";
