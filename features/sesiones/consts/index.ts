import type { EstadoJustificacion, EstadoSesion } from "../types";

export const MENU_SESIONES_HOY = "/admin/sesiones-hoy";
export const MENU_JUSTIFICACIONES_SESION = "/admin/justificaciones-sesion";
export const MENU_MIS_SESIONES = "/admin/mis-sesiones";

/** Código del motivo «Otro»: exige observación (RF-011 V3). */
export const MOTIVO_OTRO = "otro";

export const INTERVALO_PANEL_SESIONES_MS = 30_000;

export const SESIONES_ENDPOINTS = {
  BASE: "/sesiones-clase",
  HOY: "/sesiones-clase/hoy",
  JUSTIFICACIONES: "/sesiones-clase/justificaciones",
  MOTIVOS_JUSTIFICACION: "/sesiones-clase/justificaciones/motivos",
  DETALLE_JUSTIFICACION: (id: string) => `/sesiones-clase/justificaciones/${id}`,
  MIS_SESIONES: "/sesiones-clase/mis-sesiones",
  REEMPLAZO: (id: string) => `/sesiones-clase/${id}/reemplazo`,
  APROBAR_JUSTIFICACION: (id: string) => `/sesiones-clase/${id}/justificacion/aprobar`,
  RECHAZAR_JUSTIFICACION: (id: string) => `/sesiones-clase/${id}/justificacion/rechazar`,
  CORREGIR_TEMA: (id: string) => `/sesiones-clase/${id}/tema`,
  SOLICITAR_JUSTIFICACION: (id: string) => `/sesiones-clase/${id}/justificacion`,
  KIOSKO_SESIONES: "/sesiones-clase/kiosko/sesiones",
  KIOSKO_INGRESO: (sesionId: string) => `/sesiones-clase/kiosko/${sesionId}/ingreso`,
  KIOSKO_SALIDA: (sesionId: string) => `/sesiones-clase/kiosko/${sesionId}/salida`,
} as const;

export const ESTADOS_SESION_CONFIG: Record<
  EstadoSesion,
  { label: string; tone: "success" | "warning" | "danger" | "info" | "neutral" }
> = {
  pendiente: { label: "Pendiente", tone: "neutral" },
  en_curso: { label: "En curso", tone: "info" },
  cumplida: { label: "Cumplida", tone: "success" },
  parcial: { label: "Parcial", tone: "warning" },
  no_cumplida: { label: "No cumplida", tone: "danger" },
  justificada: { label: "Justificada", tone: "info" },
  reprogramada: { label: "Reprogramada", tone: "neutral" },
};

export const ESTADOS_JUSTIFICACION_LABEL: Record<EstadoJustificacion, string> = {
  solicitada: "Justificación solicitada",
  aprobada: "Justificación aprobada",
  rechazada: "Justificación rechazada",
};
