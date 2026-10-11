import type { ResultadoMarcacionApi, TipoMarcacionApi } from "../types";

export const MENU_MARCACIONES_HOY = "/admin/marcaciones-hoy";
export const MENU_MARCACION_MANUAL = "/admin/marcacion-manual";

export const INTERVALO_PANEL_MS = 30_000;

export const RESULTADOS_MARCACION_CONFIG: Record<
  ResultadoMarcacionApi,
  { label: string; tone: "success" | "warning" | "danger" | "info" }
> = {
  puntual: { label: "Puntual", tone: "success" },
  tardanza: { label: "Tardanza", tone: "warning" },
  salida_anticipada: { label: "Salida anticipada", tone: "warning" },
  fuera_de_turno: { label: "Fuera de turno", tone: "danger" },
};

export const TIPOS_MARCACION_LABEL: Record<TipoMarcacionApi, string> = {
  entrada: "Entrada",
  salida: "Salida",
};

export const MENSAJE_MOTIVO_MANUAL = "Indique el motivo de la marcación manual.";
