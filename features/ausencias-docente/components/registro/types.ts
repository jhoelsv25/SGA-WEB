import type { MotivoAusencia } from "../../consts";

/**
 * Datos requeridos de la sesión de clase para contextualizar el registro de ausencia.
 */
export interface SesionParaRegistroAusencia {
  id: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  cursoNombre: string;
  seccionNombre: string;
  docenteNombre: string;
}

/**
 * Representación local de una foto adjunta antes de enviarse al servidor.
 */
export interface FotoEvidenciaLocal {
  id: string;
  archivo: File;
  previewUrl: string;
  tomadaEn: string; // ISO 8601
}

/**
 * Valores del formulario de registro de ausencia docente.
 */
export interface RegistrarAusenciaFormValues {
  horaDesde: string;
  horaHasta: string;
  motivo: MotivoAusencia;
  observacion?: string;
}
