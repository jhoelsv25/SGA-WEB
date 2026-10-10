export type EstadoMatricula = "matriculado" | "retirado" | "trasladado" | "culminado";
export type TipoMatricula = "nuevo" | "continuador" | "traslado";

export interface MatriculaEstudianteInfo {
  id: string;
  nombres: string;
  apellidos: string;
  numeroDocumento: string;
  tipoDocumento?: string;
  codigo: string | null;
  estado?: string;
}

export interface MatriculaItem {
  id: string;
  codigo: string;
  anioAcademicoId: string;
  anioNumero: number;
  estudiante: MatriculaEstudianteInfo;
  gradoId: string;
  gradoNumero: number;
  gradoNombre: string;
  seccionId: string;
  seccionNombre: string;
  fechaMatricula: string;
  tipo: TipoMatricula;
  estado: EstadoMatricula;
  esRepitente: boolean;
  colegioProcedencia: string | null;
  fechaRetiro: string | null;
  motivoRetiro: string | null;
  observaciones: string | null;
  registradoPorId: string;
  creadoEn: string;
  actualizadoEn: string;
}

export interface MatriculaQueryParams {
  anioAcademicoId?: string;
  gradoId?: string;
  seccionId?: string;
  tipo?: TipoMatricula;
  estado?: EstadoMatricula;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface CrearMatriculaPayload {
  estudianteId: string;
  seccionId: string;
  anioAcademicoId: string;
  fechaMatricula?: string;
  tipo: TipoMatricula;
  esRepitente?: boolean;
  colegioProcedencia?: string;
  observaciones?: string;
}

export interface CrearMatriculaResponse {
  matricula: MatriculaItem;
  advertencia: string | null;
}

export interface MatriculaMasivaPayload {
  seccionOrigenId: string;
  seccionDestinoId: string;
  estudianteIds?: string[];
  fechaMatricula?: string;
}

export interface MatriculaNoProcesadaItem {
  estudianteId: string;
  estudianteNombre: string;
  motivo: string;
}

export interface MatriculaMasivaResponse {
  mensaje: string;
  totalProcesados: number;
  totalExitosos: number;
  totalFallidos: number;
  matriculados: MatriculaItem[];
  noMatriculados: MatriculaNoProcesadaItem[];
}

export interface RetirarMatriculaPayload {
  fechaRetiro: string;
  motivoRetiro: string;
}

export interface TrasladarMatriculaPayload {
  fechaRetiro: string;
  colegioDestino: string;
  motivo?: string;
}

export interface CambiarSeccionPayload {
  nuevaSeccionId: string;
  motivo: string;
}
