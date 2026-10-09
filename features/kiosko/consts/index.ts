import type { EstadoMarcacion } from "../types";

/**
 * Tiempo de visibilidad del aviso de marcación exitosa antes de cerrarse automáticamente (4.5 segundos).
 */
export const TIEMPO_AUTO_CIERRE_AVISO_MS = 4500;

/**
 * Tiempo de visibilidad del aviso de error antes de limpiarse y reiniciar el formulario (3.5 segundos).
 */
export const TIEMPO_AUTO_LIMPIEZA_ERROR_MS = 3500;

/**
 * Tiempo de inactividad tras el cual se borra el código ingresado para proteger privacidad (20 segundos).
 */
export const TIEMPO_INACTIVIDAD_REINICIO_MS = 20000;

/**
 * Longitud por defecto esperada para códigos escolares o DNI (8 dígitos).
 */
export const LONGITUD_CODIGO_DEFECTO = 8;

/**
 * Longitud máxima permitida en la entrada de código.
 */
export const LONGITUD_CODIGO_MAXIMA = 12;

/**
 * Longitud por defecto para PIN de seguridad docente o administrativo.
 */
export const LONGITUD_PIN_DEFECTO = 4;

/**
 * Mapeo de estados de marcación a etiquetas legibles y tonos semánticos de StatusBadge.
 */
export const ESTADOS_MARCACION_CONFIG: Record<
  EstadoMarcacion,
  { label: string; tone: "success" | "warning" | "danger" | "info" }
> = {
  a_tiempo: {
    label: "A tiempo",
    tone: "success",
  },
  tardanza: {
    label: "Tardanza",
    tone: "warning",
  },
  fuera_de_horario: {
    label: "Fuera de horario",
    tone: "danger",
  },
  ya_marco: {
    label: "Ya marcó hoy",
    tone: "info",
  },
};
