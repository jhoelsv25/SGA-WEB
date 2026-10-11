import type { EstadoJustificacion, EstadoSesion } from "../types";

export const MENU_SESIONES_HOY = "/admin/sesiones-hoy";
export const MENU_JUSTIFICACIONES_SESION = "/admin/justificaciones-sesion";
export const MENU_MIS_SESIONES = "/admin/mis-sesiones";

export const INTERVALO_PANEL_SESIONES_MS = 30_000;

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
