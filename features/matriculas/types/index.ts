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

export interface ApoderadoMatriculaResumen {
  id: string;
  nombreCompleto: string;
  tipoDocumento: string;
  numeroDocumento: string;
  parentesco: string;
  telefono?: string | null;
  esPrincipal: boolean;
}

export interface MatriculaItem {
  id: string;
  codigo: string;
  anioAcademicoId: string;
  anioNumero: number;
  estudiante: MatriculaEstudianteInfo;
  apoderados?: ApoderadoMatriculaResumen[];
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
  cursor?: string | null;
  anioAcademicoId?: string;
  gradoId?: string;
  seccionId?: string;
  tipo?: TipoMatricula;
  estado?: EstadoMatricula;
  search?: string;
  limit?: number;
}

export interface ResumenMatriculasResponse {
  totalMatriculados: number;
  totalRetirados: number;
  totalTrasladados: number;
  vacantesTotales: number;
  vacantesOcupadas: number;
  vacantesDisponibles: number;
}

export interface PaginatedMatriculasResponse {
  data: MatriculaItem[];
  nextCursor: string | null;
  hasMore: boolean;
  limit: number;
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
  esRepitente?: boolean;
}

export interface MatricularLotePayload {
  seccionId: string;
  estudianteIds: string[];
  tipo: TipoMatricula;
  fechaMatricula?: string;
}

export interface MatriculaNoProcesadaItem {
  estudianteId: string;
  estudianteNombre: string;
  motivo: string;
}

export interface MatriculaMasivaResponse {
  message: string;
  totalMatriculados: number;
  totalNoMatriculados: number;
  matriculados: MatriculaItem[];
  noMatriculados: MatriculaNoProcesadaItem[];
}

export interface PreviewEstudianteItem {
  estudianteId: string;
  nombreCompleto: string;
  numeroDocumento: string;
  tipoDocumento: string;
  motivo?: string;
}

export interface PreviewSeccionInfo {
  id: string;
  nombre: string;
  grado: string;
  anio: number;
  totalCulminados?: number;
  vacantesDisponibles?: number;
}

export interface PreviewPromocionResponse {
  seccionOrigen: PreviewSeccionInfo;
  seccionDestino: PreviewSeccionInfo;
  aPromover: PreviewEstudianteItem[];
  noPromovidos: PreviewEstudianteItem[];
  totalAPromover: number;
  totalNoPromovidos: number;
  sinVacantes: number;
}

export interface PreviewEgresoResponse {
  seccion: PreviewSeccionInfo;
  aEgresar: PreviewEstudianteItem[];
  noEgresables: PreviewEstudianteItem[];
  totalAEgresar: number;
  totalNoEgresables: number;
}

export interface EgresarSeccionPayload {
  seccionId: string;
  estudianteIds?: string[];
}

export interface EgresarSeccionResponse {
  message: string;
  totalEgresados: number;
  totalNoEgresados: number;
  egresados: Array<{ estudianteId: string; nombreCompleto: string }>;
  noEgresados: Array<{ estudianteId: string; nombreCompleto: string; motivo: string }>;
}

export interface ResumenSeccionPromocionItem {
  seccionId: string;
  gradoNumero: number;
  gradoNombre: string;
  nombre: string;
  totalCulminados: number;
  yaMatriculadosDestino: number;
  yaEgresados: number;
  pendientes: number;
}

export interface ResumenPromocionResponse {
  anioOrigenId: string;
  anioDestinoId: string | null;
  totalCulminados: number;
  totalMatriculadosDestino: number;
  totalEgresados: number;
  totalPendientes: number;
  secciones: ResumenSeccionPromocionItem[];
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
