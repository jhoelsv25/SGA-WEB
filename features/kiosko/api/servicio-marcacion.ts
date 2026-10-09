import type { DatosRegistroMarcacion, ResultadoMarcacion, ResultadoResolucion } from "../types";

/**
 * Error tipado emitido cuando el servicio de marcación no está disponible,
 * o cuando el endpoint de backend RF-010 aún no ha sido implementado en la API del SGA.
 */
export class MarcacionNoDisponibleError extends Error {
  readonly codigo = "RF-010_PENDIENTE";

  constructor(message = "El registro de asistencia todavía no está habilitado en este equipo.") {
    super(message);
    this.name = "MarcacionNoDisponibleError";
  }
}

/**
 * Contrato tipado del servicio de marcación para el terminal Kiosko.
 *
 * @remarks
 * Diseñado para conectarse con el Requerimiento Funcional RF-010 (Registro de Asistencia
 * y Marcación de Entrada/Salida). Esta interfaz servirá como base para la integración
 * de la cola sin conexión (offline queue) en la tarea T14.
 */
export interface ServicioMarcacion {
  /**
   * Resuelve el código o DNI de una persona ingresado en el kiosko.
   * Retorna los datos básicos de la persona, rol, sugerencia de tipo de marcación
   * y si se requiere validación por PIN.
   *
   * @param codigo Código de identificación institucional o DNI.
   * @throws {MarcacionNoDisponibleError} Si el backend no tiene habilitado el endpoint RF-010.
   */
  resolverCodigo(codigo: string): Promise<ResultadoResolucion>;

  /**
   * Registra formalmente el evento de marcación (entrada o salida).
   *
   * @param datos Objeto con código, PIN opcional, tipo de marcación y metadatos del equipo.
   * @throws {MarcacionNoDisponibleError} Si el backend no tiene habilitado el endpoint RF-010.
   */
  registrarMarcacion(datos: DatosRegistroMarcacion): Promise<ResultadoMarcacion>;
}

/**
 * Implementación del servicio de marcación de asistencia.
 *
 * @remarks
 * Conecta conceptualmente con el Requerimiento Funcional RF-010 (Registro de Asistencia).
 * Actualmente el endpoint de backend no existe en la API del SGA (solo se encuentra disponible
 * GET /equipos/validar-kiosko). Por lo tanto, esta implementación lanza un error tipado
 * MarcacionNoDisponibleError, permitiendo que la interfaz informe en lenguaje claro al usuario
 * sin inventar llamadas ficticias a endpoints inexistentes ni usar alert().
 *
 * Esta clase e interfaz quedan listas para que la tarea T14 (cola sin conexión) las extienda
 * o implemente almacenamiento local en IndexedDB cuando no haya conectividad de red.
 */
export class ServicioMarcacionKiosko implements ServicioMarcacion {
  async resolverCodigo(_codigo: string): Promise<ResultadoResolucion> {
    // RF-010: pendiente de desarrollo en el backend SGA
    throw new MarcacionNoDisponibleError();
  }

  async registrarMarcacion(_datos: DatosRegistroMarcacion): Promise<ResultadoMarcacion> {
    // RF-010: pendiente de desarrollo en el backend SGA
    throw new MarcacionNoDisponibleError();
  }
}

/**
 * Instancia singleton exportada del servicio de marcación.
 */
export const servicioMarcacion: ServicioMarcacion = new ServicioMarcacionKiosko();
