export type TipoPendiente =
  | "justificacion_sin_resolver"
  | "descargo_vencido"
  | "consolidado_sin_generar"
  | "consolidado_sin_decision"
  | "solicitud_revision_abierta"
  | "compromiso_vencido";

export interface PendienteItem {
  tipo: TipoPendiente;
  tipoEtiqueta: string;
  docenteId: string;
  docenteNombre: string;
  periodoId: string | null;
  periodoNombre: string | null;
  /** AAAA-MM-DD en que nació el pendiente. */
  fechaOrigen: string;
  /** Días calendario desde que venció (o desde que se pidió, si no tiene plazo). */
  diasAtraso: number;
  referenciaId: string;
  /** Ruta de la pantalla donde se atiende, con sus parámetros. */
  enlace: string;
}

export interface PendientesResponse {
  fecha: string;
  conteos: Record<TipoPendiente, number>;
  total: number;
  items: PendienteItem[];
  /** «No hay pendientes de seguimiento.» cuando no hay nada. */
  mensaje: string | null;
}

export interface PendientesQueryDto {
  periodoId?: string;
  docenteId?: string;
}

export interface ArchivoDescargado {
  blob: Blob;
  nombre: string;
}
