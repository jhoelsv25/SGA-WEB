export type EstadoPlanificacion = "borrador" | "lista" | "ejecutada";
export type EstadoBloque = EstadoPlanificacion | "sin_planificar";
export type Momento = "inicio" | "desarrollo" | "cierre";

export interface Bloque {
  horarioId: string;
  cursoSeccionId: string;
  docenteId: string;
  diaSemana: number;
  horaInicio: string;
  horaFin: string;
  cursoNombre: string;
  areaCurricular: string;
  seccionNombre: string;
  gradoNumero: number;
  gradoNombre: string;
}

export interface BloqueSemana {
  fecha: string;
  bloque: Bloque;
  planificacionId: string | null;
  titulo: string | null;
  estado: EstadoBloque;
}

export interface Semana {
  desde: string;
  hasta: string;
  bloques: BloqueSemana[];
}

export interface DesempenoPlanificado {
  desempenoId: string | null;
  base: string | null;
  texto: string;
}

export interface CompetenciaPlanificada {
  orden: number;
  competenciaId: string;
  competenciaTexto: string;
  capacidades: string[];
  desempenos: DesempenoPlanificado[];
  campoTematico: string | null;
}

export interface MomentoPlanificado {
  momento: Momento;
  actividades: string | null;
  minutos: number | null;
}

export interface ComentarioPlanificacion {
  id: string;
  usuarioId: string;
  autor: string;
  texto: string;
  creadoEn: string;
}

export interface TransversalPlanificada {
  competenciaId: string;
  capacidades: string[];
  desempeno?: string;
}

export interface EnfoquePlanificado {
  enfoqueId: string;
  valores: string[];
  acciones: string[];
}

export interface Materiales {
  impresos?: string[];
  manipulativos?: string[];
  digitales?: string[];
}

export interface Planificacion {
  id: string;
  docenteId: string;
  docenteNombre: string;
  horarioId: string;
  sesionClaseId: string | null;
  fecha: string;
  numero: number | null;
  unidad: string | null;
  titulo: string;
  proposito: string | null;
  evidencia: string | null;
  criterios: string[];
  instrumentoCodigo: string | null;
  competenciasTransversales: TransversalPlanificada[];
  enfoques: EnfoquePlanificado[];
  materiales: Materiales;
  referencias: string[];
  estado: EstadoPlanificacion;
  bloque: Bloque;
  competencias: CompetenciaPlanificada[];
  momentos: MomentoPlanificado[];
  comentarios: ComentarioPlanificacion[];
}

export interface RespuestaPlanificacion {
  mensaje: string;
  planificacion: Planificacion;
}

// ─── Catálogo ───
export interface Area {
  id: string;
  codigo: string;
  nombre: string;
}

export interface CompetenciaCatalogo {
  id: string;
  numero: number;
  tipo: "area" | "transversal";
  nombre: string;
  areaCodigo: string | null;
  capacidades: string[];
}

export interface DesempenoCatalogo {
  id: string;
  competenciaId: string;
  grado: number;
  orden: number;
  texto: string;
}

export interface ValorEnfoque {
  id: string;
  nombre: string;
  acciones: string[];
}

export interface EnfoqueCatalogo {
  id: string;
  nombre: string;
  valores: ValorEnfoque[];
}

export interface OpcionCatalogo {
  tipo: string;
  codigo: string;
  nombre: string;
}

// ─── Payloads ───
export interface GuardarPlanificacionPayload {
  horarioId: string;
  fecha: string;
  numero?: number;
  unidad?: string;
  titulo: string;
  proposito?: string;
  evidencia?: string;
  criterios?: string[];
  instrumentoCodigo?: string;
  competencias?: {
    competenciaId: string;
    capacidades: string[];
    desempenos: { desempenoId?: string; texto: string }[];
    campoTematico?: string;
  }[];
  competenciasTransversales?: TransversalPlanificada[];
  enfoques?: EnfoquePlanificado[];
  materiales?: Materiales;
  referencias?: string[];
  momentos?: { momento: Momento; actividades?: string; minutos?: number }[];
}

export interface DocumentoSesion {
  institucion: string;
  director: string;
  docente: string;
  gradoSeccion: string;
  area: string;
  fecha: string;
  numero: number | null;
  unidad: string | null;
  titulo: string;
  proposito: string | null;
  competencias: CompetenciaPlanificada[];
  evidencia: string | null;
  criterios: string[];
  instrumento: string | null;
  transversales: { competencia: string; capacidades: string[]; desempeno: string | null }[];
  enfoques: { enfoque: string; valores: string[]; acciones: string[] }[];
  materiales: { impresos: string[]; manipulativos: string[]; digitales: string[] };
  momentos: MomentoPlanificado[];
  referencias: string[];
  borrador: boolean;
}

export interface SesionSupervision {
  sesionId: string;
  estadoSesion: string;
  horaInicio: string;
  horaFin: string;
  docenteNombre: string;
  cursoNombre: string;
  seccionNombre: string;
  gradoNombre: string;
  planificacionId: string | null;
  planificacionEstado: EstadoPlanificacion | null;
  planificacionTitulo: string | null;
  verificacionEnAula: boolean | null;
  sinPlanificacion: boolean;
}

export interface PanelSupervision {
  fecha: string;
  sesiones: SesionSupervision[];
}

export interface HorasRealesPayload {
  enAula: boolean;
  horaInicio?: string;
  horaFin?: string;
  observacion?: string;
}

export interface ArchivoDescargado {
  blob: Blob;
  nombre: string;
}
