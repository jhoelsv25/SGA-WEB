import { formatRelativeTime } from "@/lib/formatters/date";
import { NOTIFICACION_TIPO_CONFIG } from "../constants";
import type { TipoNotificacion, NotificacionItem } from "../types";

/**
 * Formatea la fecha de una notificación al formato de tiempo relativo en español.
 * Ejemplo: "hace 5 minutos", "hace 2 horas", "hace 3 días".
 */
export function formatNotificacionFecha(fechaIso: string | null | undefined): string {
  if (!fechaIso) return "-";
  return formatRelativeTime(fechaIso, "Fecha no disponible");
}

/**
 * Obtiene la configuración visual (iconos, variantes de badge, estilos) según el tipo de notificación.
 */
export function getNotificacionVisualConfig(tipo: TipoNotificacion) {
  return NOTIFICACION_TIPO_CONFIG[tipo] || NOTIFICACION_TIPO_CONFIG.informacion;
}

/**
 * Cuenta cuántas notificaciones no están leídas en una lista dada.
 */
export function contarNoLeidas(notificaciones: NotificacionItem[]): number {
  return notificaciones.filter((n) => !n.leida).length;
}
