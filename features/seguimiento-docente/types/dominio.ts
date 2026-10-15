/**
 * Definiciones de dominio y uniones literales para Consolidado y Seguimiento Docente (RF-013).
 */

/** Estados posibles de un consolidado docente */
export const ESTADOS_CONSOLIDADO = ["cerrado", "reabierto"] as const;
export type EstadoConsolidado = (typeof ESTADOS_CONSOLIDADO)[number];

/** Decisiones directivas aplicables sobre el consolidado docente */
export const DECISIONES_CONSOLIDADO = [
  "ninguna",
  "llamada_atencion",
  "compromiso_mejora",
  "derivado",
] as const;
export type DecisionConsolidado = (typeof DECISIONES_CONSOLIDADO)[number];

/** Estados del flujo de solicitudes de revisión de consolidado */
export const ESTADOS_SOLICITUD_REVISION = ["solicitada", "aceptada", "rechazada"] as const;
export type EstadoSolicitudRevision = (typeof ESTADOS_SOLICITUD_REVISION)[number];

/** Estados posibles de una sesión de clase en el consolidado */
export const ESTADOS_SESION_CONSOLIDADO = [
  "cumplida",
  "parcial",
  "no_cumplida",
  "justificada",
  "reprogramada",
] as const;
export type EstadoSesionConsolidado = (typeof ESTADOS_SESION_CONSOLIDADO)[number];
