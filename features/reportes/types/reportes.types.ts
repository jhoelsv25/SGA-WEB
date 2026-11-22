export type CategoriaReporte = "academico" | "asistencia" | "indicadores" | "padrones";

export interface PermisosReportes {
  esAdmin: boolean;
  esDirectivo: boolean;
  esSecretaria: boolean;
  esAuxiliar: boolean;
  puedeVerAcademico: boolean;
  puedeVerAsistencia: boolean;
  tieneAcceso: boolean;
}

export interface GradoOpcionReporte {
  id: string;
  numero: number;
  nombre: string;
}

export interface CursoSeccionOpcionReporte {
  id: string;
  cursoNombre: string;
  docenteNombre: string | null;
}

export interface FiltrosReporteState {
  anioId: string;
  anioNumero: number | null;
  periodoId: string;
  periodoNombre: string | null;
  gradoId: string;
  gradoNombre: string | null;
  seccionId: string;
  seccionNombre: string | null;
  cursoSeccionId: string;
  cursoNombre: string | null;
  estadoMatricula: string;
  tipoPersona: string;
  desde: string;
  hasta: string;
  usaFechasManuales: boolean;
  mes: string;
}

export interface DefinicionCategoriaReporte {
  id: CategoriaReporte;
  label: string;
  descripcion: string;
  grupo: "gestion" | "institucional";
}

export type TipoReporteCola =
  | "matriculas"
  | "marcaciones"
  | "libretas"
  | "asistencia-seccion"
  | "asistencia-personal"
  | "personas"
  | "estudiantes"
  | "docentes"
  | "apoderados"
  | "usuarios";

export type EstadoTrabajoReporte = "encolado" | "procesando" | "completado" | "fallido";

export interface SolicitarReportePayload {
  tipo: TipoReporteCola;
  anioAcademicoId?: string;
  periodoId?: string;
  gradoId?: string;
  seccionId?: string;
  estado?: string;
  tipoPersona?: string;
  desde?: string;
  hasta?: string;
  search?: string;
}

export interface TrabajoReporteItem {
  jobId: string;
  tipo: TipoReporteCola;
  etiqueta: string;
  estado: EstadoTrabajoReporte;
  progreso: number;
  mensajeEstado: string;
  nombreArchivo: string | null;
  tamanoBytes: number | null;
  totalFilas: number | null;
  disponibleDescarga: boolean;
  creadoEn: string;
  finalizadoEn: string | null;
  error: string | null;
}
