import {
  FOTO_MIME_TYPES,
  FOTO_TAMANO_MAXIMO_BYTES,
  LIMITE_MAXIMO_FOTOS,
  MENSAJES_AUSENCIA,
  type FotoMimeType,
  type MotivoAusencia,
} from "../consts";

/**
 * Valida que la hora final sea estrictamente posterior a la hora inicial y que,
 * si se provee el horario de la sesión, el tramo se encuentre dentro de dicho horario.
 * Retorna el mensaje de error correspondiente del RF o null si el tramo es válido.
 */
export function validarHorasAusencia(
  horaDesde: string,
  horaHasta: string,
  horarioSesion?: { horaInicio: string; horaFin: string },
): string | null {
  if (!horaDesde || !horaHasta) {
    return null;
  }

  // CP-RF012-05: Horas invertidas o iguales
  if (horaHasta <= horaDesde) {
    return MENSAJES_AUSENCIA.HORAS_INVERTIDAS;
  }

  // CP-RF012-04: Fuera del horario de la sesión
  if (horarioSesion) {
    if (horaDesde < horarioSesion.horaInicio || horaHasta > horarioSesion.horaFin) {
      return MENSAJES_AUSENCIA.FUERA_HORARIO_SESION(
        `${horarioSesion.horaInicio} a ${horarioSesion.horaFin}`,
      );
    }
  }

  return null;
}

/**
 * Valida la obligatoriedad de la observación según el motivo elegido.
 * Si el motivo es «otro», la observación no puede estar vacía.
 * CP-RF012-06.
 */
export function validarObservacionMotivo(
  motivo: MotivoAusencia,
  observacion?: string | null,
): string | null {
  if (motivo === "otro" && (!observacion || observacion.trim().length === 0)) {
    return MENSAJES_AUSENCIA.FALTA_OBSERVACION;
  }
  return null;
}

/**
 * Valida una evidencia fotográfica individual (formato PNG/JPEG y peso hasta 5 MB).
 * CP-RF012-07.
 */
export function validarArchivoFoto(archivo: File): string | null {
  if (archivo.size > FOTO_TAMANO_MAXIMO_BYTES) {
    return MENSAJES_AUSENCIA.FOTO_INVALIDA;
  }

  const tiposPermitidos: readonly string[] = FOTO_MIME_TYPES;
  if (!tiposPermitidos.includes(archivo.type as FotoMimeType)) {
    return MENSAJES_AUSENCIA.FOTO_INVALIDA;
  }

  return null;
}

/**
 * Valida una lista de evidencias fotográficas verificando límites y formatos.
 */
export function validarArchivosFotos(archivos: File[]): string | null {
  if (archivos.length > LIMITE_MAXIMO_FOTOS) {
    return `Solo se permite adjuntar hasta un máximo de ${LIMITE_MAXIMO_FOTOS} fotos.`;
  }

  for (const archivo of archivos) {
    const errorFoto = validarArchivoFoto(archivo);
    if (errorFoto) {
      return errorFoto;
    }
  }

  return null;
}

/**
 * Valida el motivo del cambio obligatorio al corregir una ausencia.
 * CP-RF012-11.
 */
export function validarMotivoCambio(motivoCambio?: string | null): string | null {
  if (!motivoCambio || motivoCambio.trim().length === 0) {
    return MENSAJES_AUSENCIA.CORRECCION_SIN_MOTIVO;
  }
  return null;
}

/**
 * Valida el motivo de anulación obligatorio.
 * CP-RF012-17.
 */
export function validarMotivoAnulacion(motivoAnulacion?: string | null): string | null {
  if (!motivoAnulacion || motivoAnulacion.trim().length === 0) {
    return MENSAJES_AUSENCIA.ANULACION_SIN_MOTIVO;
  }
  return null;
}

/**
 * Valida el texto del descargo obligatorio.
 */
export function validarTextoDescargo(descargo?: string | null): string | null {
  if (!descargo || descargo.trim().length === 0) {
    return MENSAJES_AUSENCIA.DESCARGO_OBLIGATORIO;
  }
  return null;
}
