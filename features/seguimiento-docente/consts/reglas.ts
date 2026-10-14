/**
 * Reglas de negocio y constantes técnicas del módulo de Seguimiento Docente (RF-013).
 */

/** Rutas de menú para control de acceso en la navegación (Roles-Menú). */
export const MENU_CONSOLIDADO_BIMESTRE = "/admin/consolidado-bimestre";
export const MENU_SOLICITUDES_REVISION = "/admin/solicitudes-revision";
export const MENU_MI_SEGUIMIENTO = "/admin/mi-seguimiento";

/** Límites y especificaciones para archivos adjuntos en solicitudes de revisión. */
export const ADJUNTO_SOLICITUD_TAMANO_MAXIMO_BYTES = 5 * 1024 * 1024; // 5 MB
export const ADJUNTO_SOLICITUD_TAMANO_MAXIMO_MB = 5;

export const ADJUNTO_SOLICITUD_MIME_TYPES = ["application/pdf", "image/png", "image/jpeg"] as const;
export type AdjuntoSolicitudMimeType = (typeof ADJUNTO_SOLICITUD_MIME_TYPES)[number];

export const ADJUNTO_SOLICITUD_EXTENSIONES = [".pdf", ".png", ".jpg", ".jpeg"] as const;
export const ADJUNTO_SOLICITUD_ACCEPT = "application/pdf,image/png,image/jpeg";
