/**
 * Utilidades de formato de tiempo y etiquetas de dominio en español (RF-013).
 */

import type {
  DecisionConsolidado,
  EstadoConsolidado,
  EstadoSesionConsolidado,
  EstadoSolicitudRevision,
} from "../types";

/**
 * Convierte un total de minutos a la representación textual obligatoria del RF-013:
 * Formato exacto: 'X h Y min' (ej. 100 -> '1 h 40 min', 40 -> '0 h 40 min', 0 -> '0 h 0 min').
 */
export function formatearTiempoMinutos(minutosTotales?: number | null): string {
  const min = Math.max(0, Math.floor(minutosTotales || 0));
  const horas = Math.floor(min / 60);
  const minutosRestantes = min % 60;
  return `${horas} h ${minutosRestantes} min`;
}

/** Alias con la misma firma y comportamiento exacto. */
export const formatearMinutosAHrsMin = formatearTiempoMinutos;

// ========================================================
// Etiquetas y Badges en Español
// ========================================================

/** Etiquetas en español para decisiones directivas del Director */
export const ETIQUETAS_DECISION: Record<DecisionConsolidado, string> = {
  ninguna: "Ninguna",
  llamada_atencion: "Llamada de atención",
  compromiso_mejora: "Compromiso de mejora",
  derivado: "Derivado",
};

/** Variantes visuales para badges de decisión */
export const VARIANTES_DECISION: Record<
  DecisionConsolidado,
  { label: string; tone: "neutral" | "warning" | "brand" | "danger" }
> = {
  ninguna: { label: "Ninguna", tone: "neutral" },
  llamada_atencion: { label: "Llamada de atención", tone: "warning" },
  compromiso_mejora: { label: "Compromiso de mejora", tone: "brand" },
  derivado: { label: "Derivado", tone: "danger" },
};

/** Obtiene la etiqueta amigable de una decisión directiva */
export function obtenerEtiquetaDecision(decision?: DecisionConsolidado | null): string {
  if (!decision) return "Sin decisión";
  return ETIQUETAS_DECISION[decision] ?? decision;
}

/** Etiquetas en español para los estados del consolidado docente */
export const ETIQUETAS_ESTADO_CONSOLIDADO: Record<EstadoConsolidado, string> = {
  cerrado: "Cerrado",
  reabierto: "Reabierto",
};

/** Variantes visuales para badges de estado del consolidado */
export const VARIANTES_ESTADO_CONSOLIDADO: Record<
  EstadoConsolidado,
  { label: string; tone: "neutral" | "brand" }
> = {
  cerrado: { label: "Cerrado", tone: "neutral" },
  reabierto: { label: "Reabierto", tone: "brand" },
};

/** Obtiene la etiqueta en español del estado de un consolidado */
export function obtenerEtiquetaEstadoConsolidado(estado?: EstadoConsolidado | null): string {
  if (!estado) return "Desconocido";
  return ETIQUETAS_ESTADO_CONSOLIDADO[estado] ?? estado;
}

/** Etiquetas en español para los estados de solicitudes de revisión */
export const ETIQUETAS_ESTADO_SOLICITUD: Record<EstadoSolicitudRevision, string> = {
  solicitada: "Solicitada",
  aceptada: "Aceptada",
  rechazada: "Rechazada",
};

/** Variantes visuales para badges de solicitud de revisión */
export const VARIANTES_ESTADO_SOLICITUD: Record<
  EstadoSolicitudRevision,
  { label: string; tone: "warning" | "brand" | "danger" }
> = {
  solicitada: { label: "Solicitada", tone: "warning" },
  aceptada: { label: "Aceptada", tone: "brand" },
  rechazada: { label: "Rechazada", tone: "danger" },
};

/** Obtiene la etiqueta en español de una solicitud de revisión */
export function obtenerEtiquetaEstadoSolicitud(estado?: EstadoSolicitudRevision | null): string {
  if (!estado) return "Desconocido";
  return ETIQUETAS_ESTADO_SOLICITUD[estado] ?? estado;
}

/** Etiquetas en español para estados de sesión de clase */
export const ETIQUETAS_ESTADO_SESION: Record<EstadoSesionConsolidado, string> = {
  cumplida: "Cumplida",
  parcial: "Parcial",
  no_cumplida: "No cumplida",
  justificada: "Justificada",
  reprogramada: "Reprogramada",
};

/** Obtiene la etiqueta en español del estado de una sesión de clase */
export function obtenerEtiquetaEstadoSesion(estado?: string | null): string {
  if (!estado) return "Sin estado";
  return ETIQUETAS_ESTADO_SESION[estado as EstadoSesionConsolidado] ?? estado.replace(/_/g, " ");
}
