export type TipoIncidencia = "merito" | "falta";
export type GravedadFalta = "leve" | "grave" | "muy_grave";
export type TipoObservacion = "academica" | "conductual" | "socioemocional" | "salud" | "familiar";

export interface IncidenciaItem {
  id: string;
  matriculaId: string;
  estudianteNombre?: string;
  codigoEstudiante?: string;
  seccionId?: string;
  seccionNombre?: string;
  periodoId: string;
  periodoNombre?: string;
  registradoPorId: string;
  registradoPorNombre?: string;
  fecha: string;
  tipo: TipoIncidencia;
  categoria: string;
  gravedad?: GravedadFalta | null;
  descripcion: string;
  lugar?: string | null;
  medidasTomadas?: string | null;
  apoderadoNotificado: boolean;
  fechaNotificacion?: string | null;
  creadoEn: string;
  actualizadoEn: string;
}

export interface ObservacionItem {
  id: string;
  matriculaId: string;
  estudianteNombre?: string;
  codigoEstudiante?: string;
  seccionId?: string;
  seccionNombre?: string;
  registradoPorId: string;
  registradoPorNombre?: string;
  fecha: string;
  tipo: TipoObservacion;
  observacion: string;
  seguimiento?: string | null;
  derivadoA?: string | null;
  esConfidencial: boolean;
  creadoEn: string;
  actualizadoEn: string;
}

export interface DesgloseBimestreConducta {
  periodoId: string;
  periodoNombre: string;
  numeroPeriodo: number;
  meritos: number;
  faltasLeves: number;
  faltasGraves: number;
  faltasMuyGraves: number;
  totalFaltas: number;
}

export interface ResumenConductaEstudiante {
  matriculaId: string;
  estudianteNombre: string;
  codigoEstudiante: string;
  gradoNombre: string;
  seccionNombre: string;
  totalMeritos: number;
  totalFaltas: number;
  desglosePorBimestre: DesgloseBimestreConducta[];
}

export interface QueryIncidenciasParams {
  matriculaId?: string;
  seccionId?: string;
  periodoId?: string;
  tipo?: TipoIncidencia | "all";
  gravedad?: GravedadFalta | "all";
  fechaDesde?: string;
  fechaHasta?: string;
  cursor?: string | null;
  limit?: number;
}

export interface QueryObservacionesParams {
  matriculaId?: string;
  seccionId?: string;
  cursor?: string | null;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  nextCursor: string | null;
  hasMore: boolean;
  limit?: number;
}

export interface CrearIncidenciaPayload {
  matriculaId: string;
  fecha: string;
  tipo: TipoIncidencia;
  categoria: string;
  gravedad?: GravedadFalta;
  descripcion: string;
  lugar?: string;
  medidasTomadas?: string;
}

export interface ActualizarIncidenciaPayload {
  categoria?: string;
  gravedad?: GravedadFalta;
  descripcion?: string;
  lugar?: string;
  medidasTomadas?: string;
}

export interface AnularIncidenciaPayload {
  motivo: string;
}

export interface CrearObservacionPayload {
  matriculaId: string;
  fecha: string;
  tipo: TipoObservacion;
  observacion: string;
  seguimiento?: string;
  derivadoA?: string;
  esConfidencial?: boolean;
}
