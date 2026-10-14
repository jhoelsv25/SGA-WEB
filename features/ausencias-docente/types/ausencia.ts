import type { MotivoAusencia } from "../consts/motivos";

/**
 * Representa una evidencia fotográfica adjunta a una ausencia.
 */
export interface AusenciaFotoDto {
  id: string;
  archivoUrl: string;
  tomadaEn: string | null;
  orden: number;
}

/**
 * Resumen de la sesión de clase vinculada a la ausencia.
 */
export interface SesionResumenAusenciaDto {
  id: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  cursoNombre: string;
  seccionNombre: string;
  docenteId: string;
  docenteNombre: string;
}

/**
 * Información de autoría de la ausencia.
 */
export interface RegistradorAusenciaDto {
  id: string;
  nombreCompleto: string;
}

/**
 * Representación completa de una ausencia docente en el sistema.
 */
export interface AusenciaResponseDto {
  id: string;
  ausenciaRaizId: string;
  sesionClaseId: string;
  sesion: SesionResumenAusenciaDto;
  horaDesde: string; // "HH:mm"
  horaHasta: string; // "HH:mm"
  minutos: number;
  motivo: MotivoAusencia;
  observacion: string | null;
  version: number;
  motivoCambio?: string | null;
  vigente: boolean;
  anulada: boolean;
  anuladaEn: string | null;
  motivoAnulacion: string | null;
  descargo: string | null;
  descargoEn: string | null;
  fechaLimiteDescargo: string | null; // ISO 8601
  fechaLimiteDescargoFormateada: string | null; // "DD/MM/YYYY"
  puedeDescargar: boolean;
  puedeCorregir: boolean;
  puedeAnular: boolean;
  fotos: AusenciaFotoDto[];
  registradoPor: RegistradorAusenciaDto;
  registradoEn: string; // ISO 8601
}

/**
 * Mensaje simple de respuesta de acciones de mutación.
 */
export interface MensajeAusenciaResponseDto {
  mensaje: string;
  id?: string;
  minutos?: number;
}

/**
 * Respuesta del backend al registrar una nueva ausencia docente.
 */
export type RegistroAusenciaResponseDto = MensajeAusenciaResponseDto & {
  ausencia: AusenciaResponseDto;
};

/**
 * Elemento de versión individual dentro del historial de una ausencia.
 */
export interface AusenciaHistorialItemDto {
  version: number;
  vigente: boolean;
  horaDesde: string;
  horaHasta: string;
  minutos: number;
  motivo: string;
  observacion: string | null;
  motivoCambio: string | null;
  registradoPor: RegistradorAusenciaDto;
  registradoEn: string;
  fotos: AusenciaFotoDto[];
}

/**
 * Respuesta con el historial completo de versiones de una ausencia.
 */
export interface HistorialAusenciaResponseDto {
  ausenciaRaizId: string;
  versiones: AusenciaHistorialItemDto[];
}

/**
 * Respuesta resumida para el listado de ausencias del supervisor.
 */
export interface ResumenAusenciasSupervisorResponseDto {
  data: AusenciaResponseDto[];
  totalMinutos: number; // Suma de minutos SOLO de las vigentes no anuladas
  totalAusencias: number;
  totalAnuladas: number;
}
