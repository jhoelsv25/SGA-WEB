export type EstadoCompromiso = "pendiente" | "cumplido" | "no_cumplido";

export type ResultadoCompromiso = "cumplido" | "no_cumplido";

/** Una versión de un compromiso de mejora (RF-013 V2). */
export interface CompromisoItem {
  /** Identificador de esta versión. */
  id: string;
  /** Identificador estable del compromiso a través de sus versiones. */
  compromisoId: string;
  consolidadoId: string;
  /** Versión del consolidado en que se registró (se conserva al reabrir). */
  consolidadoVersion: number;
  docenteId: string;
  docenteNombre: string;
  version: number;
  vigente: boolean;
  descripcion: string;
  /** AAAA-MM-DD */
  fechaRevision: string;
  estado: EstadoCompromiso;
  /** Pendiente con fecha de revisión pasada. */
  vencido: boolean;
  observacionCierre: string | null;
  cerradoEn: string | null;
  enteradoEn: string | null;
  anulado: boolean;
  motivoAnulacion: string | null;
  anuladoEn: string | null;
  creadoPorId: string;
  creadoEn: string;
}

export interface DetalleCompromisoResponse {
  compromiso: CompromisoItem;
  /** Versiones anteriores y la vigente; el docente no la recibe (llega vacía). */
  historial: CompromisoItem[];
}

/** Respuesta de las acciones que devuelven el compromiso actualizado. */
export interface CompromisoAccionResponse {
  compromiso: CompromisoItem;
  /** Reprogramar y anular no devuelven mensaje. */
  mensaje?: string;
}

export interface RegistrarCompromisoDto {
  consolidadoId: string;
  descripcion: string;
  fechaRevision: string;
}

export interface CerrarCompromisoDto {
  resultado: ResultadoCompromiso;
  observacion: string;
}

export interface ReprogramarCompromisoDto {
  fechaRevision?: string;
  descripcion?: string;
}

export interface AnularCompromisoDto {
  motivo: string;
}
