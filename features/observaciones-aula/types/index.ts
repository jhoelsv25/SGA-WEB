/** Tipos de RF-023 V1: observación de aula y retroalimentación (espejo de la API). */

export type EstadoObservacion =
  | "programada"
  | "en_observacion"
  | "notas_cerradas"
  | "calificada"
  | "retroalimentada"
  | "cancelada";

export type EstadoCompromiso = "pendiente" | "cumplido" | "no_cumplido";
export type ResultadoCompromiso = "cumplido" | "no_cumplido";
export type Nivel = 1 | 2 | 3 | 4;

export interface Observacion {
  id: string;
  docenteId: string;
  docenteNombre: string;
  docenteApellido: string;
  docenteDocumento: string;
  cursoSeccionId: string;
  cursoNombre: string;
  seccionNombre: string;
  gradoNombre: string;
  periodoId: string;
  periodoNombre: string;
  periodoEstado: string;
  observadorUsuarioId: string;
  observadorNombre: string;
  instrumentoId: string;
  observacionAnteriorId: string | null;
  fecha: string;
  horaInicioProgramada: string;
  horaFinProgramada: string;
  estado: EstadoObservacion;
  horaInicioReal: string | null;
  horaFinReal: string | null;
  minutosTotales: number | null;
  estudiantesPresentes: number | null;
  retroFecha: string | null;
  retroHoraInicio: string | null;
  retroHoraFin: string | null;
  retroResumen: string | null;
  enteradoEn: string | null;
  motivoCancelacion: string | null;
  vencida?: boolean;
}

export interface NivelInstrumento {
  nivel: Nivel;
  nombre: string;
  grupo: "insatisfactorio" | "satisfactorio";
  descripcion: string;
}

export interface DesempenoInstrumento {
  numero: number;
  nombre: string;
  aspectos: string[];
  niveles: NivelInstrumento[];
}

export interface InstrumentoContenido {
  desempenos: DesempenoInstrumento[];
}

export interface Instrumento {
  id: string;
  codigo: string;
  nombre: string;
  fuente: string | null;
  contenido: InstrumentoContenido;
  vigente: boolean;
  creadoEn: string;
}

export interface Nota {
  id: string;
  desempeno: number;
  aspecto: string | null;
  texto: string;
  horaAproximada: string | null;
}

export interface Calificacion {
  desempeno: number;
  desempenoNombre: string | null;
  nivel: Nivel;
  nivelRomano: string;
  nivelNombre: string;
  grupo: "insatisfactorio" | "satisfactorio";
  descripcionNivel: string | null;
  fundamento: string;
  version: number;
}

export interface HistorialCalificacion {
  id: string;
  desempeno: number;
  nivel: Nivel;
  fundamento: string;
  version: number;
  vigente: boolean;
  motivoCambio: string | null;
  creadoEn: string;
}

export interface Compromiso {
  id: string;
  compromisoId: string;
  desempeno: number;
  descripcion: string;
  fechaRevision: string;
  estado: EstadoCompromiso;
  observacionCierre: string | null;
  version: number;
  vigente: boolean;
  motivoCambio: string | null;
  vencido?: boolean;
}

export interface Cambio {
  id: string;
  tipo: "reprogramacion" | "cancelacion";
  fechaAnterior: string | null;
  fechaNueva: string | null;
  motivo: string;
  creadoEn: string;
}

export interface ArchivoFirmado {
  id: string;
  url: string;
  nombreOriginal: string | null;
  retirado: boolean;
  creadoEn: string;
}

export interface ComentarioDocente {
  id: string;
  texto: string;
  creadoEn: string;
}

export interface DetalleObservacion {
  observacion: Observacion;
  instrumento: InstrumentoContenido;
  notas: Nota[];
  calificaciones: Calificacion[];
  historialCalificaciones: HistorialCalificacion[];
  compromisos: Compromiso[];
  historialCompromisos: Compromiso[];
  cambios: Cambio[];
  archivos: ArchivoFirmado[];
  comentario: ComentarioDocente | null;
}

export interface DesempenoFicha extends DesempenoInstrumento {
  notas: Nota[];
  calificacion: Calificacion | null;
}

export interface FichaCalificacion {
  observacion: Observacion;
  desempenos: DesempenoFicha[];
}

export interface CoberturaDocente {
  docenteId: string;
  docenteNombre: string;
  realizadas: number;
  programadas: number;
  meta: number;
  faltanParaMeta: number;
  faltanPorProgramar: number;
}

export interface Cronograma {
  anioAcademicoId: string;
  meta: number;
  docentes: CoberturaDocente[];
  total: { realizadas: number; programadas: number; meta: number; porcentaje: number };
}

export interface CompromisoPorRevisar extends Compromiso {
  observacionId: string;
  docenteId: string;
  docenteNombre: string;
  docenteApellido: string;
}

export interface FilaMatriz {
  docenteId: string;
  docenteNombre: string;
  niveles: Record<number, { nivel: Nivel; fecha: string } | null>;
}

export interface Matriz {
  anioAcademicoId: string;
  matriz: FilaMatriz[];
  cobertura: Cronograma;
}

export type EvolucionNivel = "sube" | "igual" | "baja";

export interface HistorialDocente {
  docenteId: string;
  observaciones: Array<{
    observacionId: string;
    fecha: string;
    observador: string;
    niveles: Record<number, Nivel>;
    evolucion?: Record<number, EvolucionNivel | null>;
  }>;
  mensaje?: string;
}

export interface ResumenConsolidado {
  observacion: null | {
    observacionId: string;
    fecha: string;
    niveles: Array<{ desempeno: number; nivel: Nivel; nivelRomano: string }>;
  };
}

/** Vista del docente (solo lo que la API deja ver). */
export interface AvisoObservacion {
  id: string;
  estado: EstadoObservacion;
  fecha: string;
  hora: string;
  curso: string;
  grado: string;
  seccion: string;
  observador: string;
  motivoCancelacion: string | null;
}

export interface MisObservaciones {
  proximas: AvisoObservacion[];
  retroalimentadas: Array<{
    id: string;
    fecha: string;
    curso: string;
    grado: string;
    seccion: string;
    observador: string;
    enteradoEn: string | null;
    niveles: Calificacion[];
    compromisos: Compromiso[];
  }>;
}

export interface MiObservacionDetalle {
  observacion: AvisoObservacion & {
    horaInicio?: string | null;
    horaFin?: string | null;
    minutos?: number | null;
    estudiantesPresentes?: number | null;
    reunion?: {
      fecha: string | null;
      horaInicio: string | null;
      horaFin: string | null;
      resumen: string | null;
    };
    enteradoEn?: string | null;
  };
  evidencias?: Array<{
    desempeno: number;
    aspecto: string | null;
    texto: string;
    horaAproximada: string | null;
  }>;
  calificaciones?: Calificacion[];
  compromisos?: Array<{
    compromisoId: string;
    desempeno: number;
    descripcion: string;
    fechaRevision: string;
    estado: EstadoCompromiso;
    observacionCierre: string | null;
    vencido: boolean;
  }>;
  comentario?: ComentarioDocente | null;
  fechaLimiteComentario?: string | null;
  puedeComentar?: boolean;
}

// ---- Cuerpos de las peticiones
export interface ProgramarPayload {
  docenteId: string;
  cursoSeccionId: string;
  fecha: string;
  horaInicio?: string;
  observadorUsuarioId?: string;
}
export interface ReprogramarPayload {
  fecha: string;
  horaInicio?: string;
  motivo: string;
}
export interface IniciarPayload {
  horaInicio: string;
  estudiantesPresentes: number;
}
export interface NotaPayload {
  desempeno: number;
  texto: string;
  horaAproximada?: string;
}
export interface CalificarPayload {
  nivel: number;
  fundamento: string;
}
export interface CorregirCalificacionPayload {
  nivel?: number;
  motivo: string;
}
export interface ReunionPayload {
  fecha: string;
  horaInicio: string;
  horaFin: string;
  resumen: string;
}
export interface CompromisoPayload {
  desempeno: number;
  descripcion: string;
  fechaRevision: string;
}
export interface InstrumentoPayload {
  codigo: string;
  nombre: string;
  vigente?: boolean;
  desempenos: Array<{
    numero: number;
    nombre: string;
    aspectos: string[];
    niveles: Array<{ nivel: number; descripcion: string }>;
  }>;
}

export interface FiltrosObservaciones {
  estado?: EstadoObservacion;
}

export interface FiltrosMatriz {
  nivel?: number;
  desempeno?: number;
}

export interface ArchivoDescargado {
  blob: Blob;
  nombre: string;
}
