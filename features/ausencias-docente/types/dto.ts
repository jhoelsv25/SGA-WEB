import type { MotivoAusencia } from "../consts/motivos";

/**
 * Metadatos individuales de captura para cada foto adjunta.
 */
export interface MetadatoFotoItem {
  tomadaEn?: string; // Formato ISO 8601
}

/**
 * DTO para registrar una nueva ausencia docente en una sesión.
 */
export interface RegistrarAusenciaDto {
  sesionClaseId: string;
  horaDesde: string; // "HH:mm"
  horaHasta: string; // "HH:mm"
  motivo: MotivoAusencia;
  observacion?: string;
  metadatosFotos?: string; // JSON serializado de MetadatoFotoItem[]
}

/**
 * Carga útil para la llamada a la API de registro con archivos binarios.
 */
export interface RegistrarAusenciaPayload {
  datos: RegistrarAusenciaDto;
  fotos?: File[];
}

/**
 * DTO para corregir una ausencia existente dentro de las 24 horas.
 */
export interface CorregirAusenciaDto {
  horaDesde?: string;
  horaHasta?: string;
  motivo?: MotivoAusencia;
  observacion?: string;
  motivoCambio: string;
  fotosRetiradasIds?: string[];
  metadatosFotos?: string;
}

/**
 * Carga útil para la llamada a la API de corrección con archivos binarios.
 */
export interface CorregirAusenciaPayload {
  id: string;
  datos: CorregirAusenciaDto;
  fotos?: File[];
}

/**
 * DTO para anular una ausencia docente indicando el motivo.
 */
export interface AnularAusenciaDto {
  motivoAnulacion: string;
}

/**
 * DTO para que el docente presente su descargo único dentro de los 7 días.
 */
export interface RegistrarDescargoDto {
  descargo: string;
}

/**
 * Parámetros de consulta para filtrar el listado de ausencias del supervisor.
 */
export interface FiltroAusenciasQueryDto {
  periodoId?: string;
  docenteId?: string;
  fechaDesde?: string; // "YYYY-MM-DD"
  fechaHasta?: string; // "YYYY-MM-DD"
}
