export type EstadoLibreta = "pendiente" | "a_tiempo" | "fuera_de_plazo";
export type AlcanceLibreta = "tutoria" | "mis_secciones" | "colegio";
export type AsignacionLibreta = "automatica" | "manual";
export type MetodoReconocimientoLibreta = "nombre" | "ocr";

export interface PeriodoLibreta {
  id: string;
  nombre: string;
  fechaLimite: string | null;
  programada: boolean;
}

export interface SeccionLibreta {
  id: string;
  nombre: string;
  gradoNombre: string;
}

export interface ContextoLibretas {
  puedeProgramar: boolean;
  esAdministrador: boolean;
  alcance: AlcanceLibreta | null;
  periodos: PeriodoLibreta[];
  secciones: SeccionLibreta[];
}

export interface EstudianteLibreta {
  matriculaId: string;
  nombreCompleto: string;
  estado: EstadoLibreta | null;
}

export interface ArchivoAsignadoPreview {
  nombreArchivo: string;
  matriculaId: string;
  nombreCompleto: string;
  asignacion: AsignacionLibreta;
  metodoReconocimiento?: MetodoReconocimientoLibreta;
  estado: EstadoLibreta | null;
}

export interface ArchivoSinReconocer {
  nombreArchivo: string;
  mensaje: string;
}

export interface ArchivoOtraSeccion {
  nombreArchivo: string;
  nombreEstudiante: string;
  mensaje: string;
}

export interface VistaPreviaLibretas {
  mensaje: string;
  asignadas: ArchivoAsignadoPreview[];
  sinReconocer: ArchivoSinReconocer[];
  otraSeccion: ArchivoOtraSeccion[];
  estudiantes: EstudianteLibreta[];
}

export interface AsignacionManual {
  nombreArchivo: string;
  matriculaId: string;
  motivo?: string;
  origen?: "manual" | "ocr";
}

export interface ResultadoPublicacion {
  mensaje: string;
  cantidad: number;
}

export interface ResultadoProgramacion {
  mensaje: string;
  cantidad: number;
  periodoId: string;
  fechaLimite: string;
}

export interface AlcanceRol {
  rolId: string;
  rolNombre: string;
  alcance: AlcanceLibreta;
}

export interface SeguimientoSeccion {
  seccionId: string;
  seccionNombre: string;
  gradoNombre: string;
  aTiempo: number;
  fueraDePlazo: number;
  pendientes: number;
  vistas: number;
  programadas: number;
  porcentajeATiempo: number;
}

export interface DetalleLibreta {
  libretaId: string;
  matriculaId: string;
  codigo: string;
  nombreCompleto: string;
  estado: EstadoLibreta;
  vistoEn: string | null;
  fechaLimite: string;
}

export interface HistorialArchivo {
  id: string;
  nombreOriginal: string;
  asignacion: AsignacionLibreta;
  vigente: boolean;
  vigencia: 0 | 1;
  motivo: string | null;
  subidoPorNombre: string;
  subidoEn: string;
}

export interface HistorialLibreta {
  libretaId: string;
  bimestre: string;
  archivos: HistorialArchivo[];
}

export interface MiLibreta {
  id: string;
  periodoId: string;
  bimestre: string;
  estado: EstadoLibreta;
  fechaLimite: string;
  estudianteNombre: string;
  disponible: boolean;
  mensaje: string | null;
}
