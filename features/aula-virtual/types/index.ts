export type TipoMaterial =
  "documento" | "presentacion" | "hoja_calculo" | "imagen" | "audio" | "video" | "enlace";

export type PlazoMaterial = "pendiente" | "a_tiempo" | "fuera_de_plazo" | "no_publicado";
export type EstadoSolicitudFecha = "solicitada" | "aprobada" | "rechazada";

export interface CursoAula {
  cursoSeccionId: string;
  cursoNombre: string;
  seccionNombre: string;
  docenteNombre: string | null;
}

export interface CambioFecha {
  id: string;
  fechaAnterior: string;
  fechaSolicitada: string;
  motivo: string;
  estado: EstadoSolicitudFecha;
  solicitadoEn: string;
  resueltoEn: string | null;
  respuesta: string | null;
}

export interface Material {
  id: string;
  unidadId: string;
  titulo: string;
  descripcion: string | null;
  tipo: TipoMaterial;
  url: string | null;
  archivoNombre: string | null;
  esPlanificado: boolean;
  esExtra: boolean;
  visible: boolean;
  vigente: boolean;
  fechaProgramada: string | null;
  fechaCongelada: boolean;
  publicadoEn: string | null;
  plazo: PlazoMaterial | null;
  horarioId: string | null;
  sesionClase: { id: string; fecha: string; tema: string | null } | null;
  solicitudAbierta: boolean;
  cambiosDeFecha: CambioFecha[];
}

export interface Unidad {
  id: string;
  periodoId: string | null;
  titulo: string;
  descripcion: string | null;
  orden: number;
  fechaInicio: string | null;
  fechaFin: string | null;
  publicada: boolean;
  materiales: Material[];
}

export interface BloqueCurso {
  id: string;
  diaSemana: number;
  horaInicio: string;
  horaFin: string;
}

export interface AulaVirtual {
  cursoSeccionId: string;
  cursoNombre: string;
  seccionNombre: string;
  puedeAdministrar: boolean;
  diasPlanificacion: number;
  tamanoMaximoMb: number;
  bloques: BloqueCurso[];
  unidades: Unidad[];
}

export interface MutacionMaterial {
  mensaje: string;
  material: Material;
}

export interface SolicitudCambio {
  id: string;
  materialId: string;
  materialTitulo: string;
  cursoNombre: string;
  seccionNombre: string;
  docenteNombre: string;
  fechaAnterior: string;
  fechaSolicitada: string;
  motivo: string;
  estado: EstadoSolicitudFecha;
  solicitadoEn: string;
  resueltoEn: string | null;
  respuesta: string | null;
}

export interface FilaSeguimiento {
  docenteId: string;
  docenteNombre: string;
  cursoSeccionId: string;
  cursoNombre: string;
  seccionNombre: string;
  planificados: number;
  aTiempo: number;
  fueraDePlazo: number;
  noPublicados: number;
  porcentajeATiempo: number;
  solicitudesPendientes: number;
}

export interface Seguimiento {
  periodoId: string;
  periodoNombre: string;
  filas: FilaSeguimiento[];
  totales: Omit<
    FilaSeguimiento,
    "docenteId" | "docenteNombre" | "cursoSeccionId" | "cursoNombre" | "seccionNombre"
  >;
}

export interface NuevaUnidad {
  titulo: string;
  descripcion?: string;
  periodoId: string;
  fechaInicio: string;
  fechaFin: string;
  publicada: boolean;
}

export interface PlanificarMaterial {
  titulo: string;
  descripcion?: string;
  tipo: TipoMaterial;
  horarioId?: string;
  fechaClase?: string;
  fechaProgramada?: string;
}

export interface ContenidoMaterial {
  enlace?: string;
  archivo?: File | null;
}

export interface MaterialExtra extends ContenidoMaterial {
  titulo: string;
  descripcion?: string;
  tipo: TipoMaterial;
}

// ==========================================
// RF-016: Tipos de tareas, entregas y libro de notas
// ==========================================

export type TipoTarea = "trabajo" | "proyecto" | "cuestionario" | "examen";
export type TipoPregunta = "opcion_unica" | "opcion_multiple" | "respuesta_corta";
export type CalculoNotaIntentos = "mas_alta" | "ultima" | "promedio";
export type RevelarRespuestas =
  "al_terminar_intentos" | "despues_fecha_limite" | "inmediato" | "nunca";
export type EstadoTarea = "borrador" | "publicada" | "cerrada";
export type EstadoEntrega = "en_progreso" | "borrador" | "entregada" | "calificada" | "devuelta";

export interface OpcionPregunta {
  id?: string;
  texto: string;
  esCorrecta: boolean;
  orden?: number;
}

export interface Pregunta {
  id?: string;
  enunciado: string;
  tipo: TipoPregunta;
  puntaje: number;
  orden?: number;
  opciones?: OpcionPregunta[];
}

export interface Entrega {
  id: string;
  tareaId: string;
  matriculaId: string;
  estudianteId?: string;
  estudianteNombre?: string;
  codigo?: string;
  intento: number;
  iniciadoEn: string;
  entregadaEn: string | null;
  texto: string | null;
  archivoUrl: string | null;
  archivoNombre: string | null;
  archivoTamanoBytes: number | null;
  enlaceUrl: string | null;
  respuestas: Record<string, unknown> | null;
  esTardia: boolean;
  estado: EstadoEntrega;
  nota: number | null;
  retroalimentacion: string | null;
  calificadaPorId: string | null;
  calificadaEn: string | null;
}

export interface Tarea {
  id: string;
  cursoSeccionId: string;
  periodoId: string | null;
  unidadId: string | null;
  sesionClaseId: string | null;
  titulo: string;
  instrucciones: string | null;
  tipo: TipoTarea;
  puntajeMaximo: number;
  publicadaEn: string | null;
  fechaLimite: string;
  permiteEntregaTardia: boolean;
  intentosMaximos: number;
  limiteTiempoMinutos: number | null;
  calculoNotaIntentos: CalculoNotaIntentos;
  revelarRespuestas: RevelarRespuestas;
  tiposArchivo: string | null;
  estado: EstadoTarea;
  creadoEn: string;
  preguntas?: Pregunta[];
  miEntrega?: Entrega | null;
  intentosRestantes?: number;
}

export interface FilaEstudianteLibro {
  matriculaId: string;
  estudianteId: string;
  codigo: string;
  estudianteNombre: string;
  notasPorTarea: Record<
    string,
    {
      nota: number | null;
      estado: string;
      esTardia: boolean;
    }
  >;
  promediosPorTipo: Record<string, number | null>;
  notaFinal: number;
  notaLiteral: "AD" | "A" | "B" | "C";
}

export interface LibroNotas {
  cursoSeccionId: string;
  cursoNombre: string;
  seccionNombre: string;
  periodoId: string;
  periodoNombre: string;
  pesosConfig: Record<string, number>;
  pesosEfectivos: Record<string, number>;
  tareas: Array<{
    id: string;
    titulo: string;
    tipo: TipoTarea;
    fechaLimite: string;
  }>;
  estudiantes: FilaEstudianteLibro[];
}

export interface CrearTareaPayload {
  titulo: string;
  instrucciones?: string;
  tipo: TipoTarea;
  unidadId?: string;
  periodoId?: string;
  fechaLimite: string;
  permiteEntregaTardia?: boolean;
  intentosMaximos?: number;
  limiteTiempoMinutos?: number;
  calculoNotaIntentos?: CalculoNotaIntentos;
  revelarRespuestas?: RevelarRespuestas;
  tiposArchivo?: string;
  publicar?: boolean;
  preguntas?: Pregunta[];
}

export interface CalificarEntregaPayload {
  nota?: number;
  retroalimentacion?: string;
  calificacionesPreguntas?: Record<string, { puntajeObtenido: number; comentario?: string }>;
  devolver?: boolean;
}

export interface TareaEstudianteNota {
  tareaId: string;
  titulo: string;
  tipo: TipoTarea;
  fechaLimite: string;
  nota: number | null;
  estadoEntrega: string;
  esTardia?: boolean;
  retroalimentacion?: string | null;
}

export interface CursoNotasEstudiante {
  cursoSeccionId: string;
  cursoNombre: string;
  seccionNombre: string;
  docenteNombre?: string | null;
  notaFinal: number | null;
  notaLiteral: "AD" | "A" | "B" | "C" | null;
  tareas?: TareaEstudianteNota[];
}

export type TipoModeracion = "publicacion" | "comentario" | "chat";

export interface PublicacionMuro {
  id: string;
  cursoSeccionId: string;
  autorId: string;
  autorNombre: string;
  autorRol?: string;
  contenido: string;
  adjuntoUrl: string | null;
  fijada: boolean;
  vigente: boolean;
  creadoEn: string;
  actualizadoEn: string;
  ocultadoPorId: string | null;
  ocultadoEn: string | null;
  motivoOcultamiento: string | null;
  comentariosCount?: number;
}

export interface ComentarioMuro {
  id: string;
  publicacionId: string;
  autorId: string;
  autorNombre: string;
  autorRol?: string;
  contenido: string;
  vigente: boolean;
  creadoEn: string;
  actualizadoEn: string;
  ocultadoPorId: string | null;
  ocultadoEn: string | null;
  motivoOcultamiento: string | null;
}

export interface MensajeChat {
  id: string;
  cursoSeccionId: string;
  emisorId: string;
  emisorNombre: string;
  emisorRol?: string;
  contenido: string;
  adjuntoUrl: string | null;
  vigente: boolean;
  enviadoEn: string;
  actualizadoEn?: string | null;
  ocultadoPorId: string | null;
  ocultadoEn: string | null;
  motivoOcultamiento: string | null;
}

export interface HistorialModeracion {
  id: string;
  tipo: TipoModeracion;
  cursoSeccionId: string;
  contenido: string | null;
  adjuntoUrl: string | null;
  autorNombre: string;
  ocultadoPorNombre: string;
  ocultadoEn: string;
  motivoOcultamiento: string;
}

export interface ActividadMaterialEstudiante {
  matriculaId: string;
  estudianteId: string;
  codigo: string;
  nombreCompleto: string;
  visualizo: boolean;
  visualizoEn: string | null;
  descargo: boolean;
  descargoEn: string | null;
}

export interface ActividadTareaEstudiante {
  matriculaId: string;
  estudianteId: string;
  codigo: string;
  nombreCompleto: string;
  abrio: boolean;
  abrioEn: string | null;
  completo: boolean;
  completoEn: string | null;
}
