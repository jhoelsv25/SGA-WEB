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

/**
 * Bandera para habilitar o deshabilitar la cola de marcaciones sin conexión en el kiosko.
 *
 * Desactivada por defecto (false) porque el backend del SGA aún no tiene habilitado
 * el endpoint de marcación (RF-010). Con false el kiosko se comporta como en T13.
 * Con true, las marcaciones sin conexión o con fallas de red se guardan en IndexedDB
 * y se retransmiten en orden FIFO al recuperarse la conectividad.
 */
export const COLA_SIN_CONEXION_HABILITADA = false;

/**
 * Nombre de la base de datos IndexedDB para la cola local del terminal Kiosko.
 */
export const NOMBRE_BD_KIOSKO = "sga-kiosko";

/**
 * Nombre del almacén de objetos (object store) en IndexedDB para marcaciones pendientes.
 */
export const NOMBRE_ALMACEN_PENDIENTES = "marcaciones-pendientes";

/**
 * Versión del esquema de la base de datos IndexedDB del kiosko.
 */
export const VERSION_BD_KIOSKO = 1;

/**
 * Intervalo de tiempo para revisar y procesar la cola mientras haya pendientes (30 segundos).
 */
export const INTERVALO_REVISION_COLA_MS = 30000;

/**
 * Tiempo de espera base inicial para el backoff exponencial de reintentos (1 segundo).
 */
export const BACKOFF_INICIAL_MS = 1000;

/**
 * Tiempo de espera máximo para el backoff exponencial de reintentos (60 segundos).
 */
export const BACKOFF_MAXIMO_MS = 60000;
