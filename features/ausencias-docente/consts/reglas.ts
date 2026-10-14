/**
 * Reglas de negocio y límites técnicos del módulo de Ausencias Docentes (RF-012).
 */
export const FOTO_TAMANO_MAXIMO_BYTES = 5 * 1024 * 1024; // 5 MB
export const FOTO_TAMANO_MAXIMO_MB = 5;

export const FOTO_MIME_TYPES = ["image/png", "image/jpeg"] as const;
export type FotoMimeType = (typeof FOTO_MIME_TYPES)[number];

export const FOTO_EXTENSIONES_PERMITIDAS = [".png", ".jpg", ".jpeg"] as const;
export const FOTO_ACCEPT = "image/png,image/jpeg";
export const LIMITE_MAXIMO_FOTOS = 5;

/** Valores por defecto para plazos de corrección y descargo (RF-012 V2.0). */
export const VALORES_DEFECTO_AUSENCIA = {
  PLAZO_CORRECCION_HORAS: 24,
  PLAZO_DESCARGO_DIAS: 7,
} as const;

/** Rutas de menú para control de acceso en la navegación (Roles-Menú). */
export const MENU_AUSENCIAS_DOCENTES = "/admin/ausencias-docentes";
export const MENU_MIS_AUSENCIAS = "/admin/mis-ausencias";
