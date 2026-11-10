/**
 * Tipos y contratos TypeScript para el módulo de Indicadores de la Tesis (RF-020).
 * Reflejan exactamente el contrato inmutable del backend.
 */

export type Indicador = "CSP" | "ISA" | "IGM";

export interface MetadataIndicador {
  readonly codigo: Indicador;
  readonly nombre: string;
  readonly dimension: string;
  readonly fuente: string;
  readonly formula: string;
}

// ============================================================================
// DTOs de Entrada (Filtros y payloads de mutación)
// ============================================================================

export interface FiltroIndicadoresQueryDto {
  periodoId?: string;
  fechaInicio?: string;
  fechaFin?: string;
  docenteId?: string;
  cursoId?: string;
  seccionId?: string;
}

/** Columnas del ranking de indicadores de apoyo (RF-020 V2). */
export type IndicadorApoyo =
  | "jornadasEfectivas"
  | "minutosPerdidos"
  | "promedioMinutosPerdidos"
  | "puntualidad"
  | "minutosFueraAula"
  | "tiempoResolucion";

export interface FiltroApoyoQueryDto extends FiltroIndicadoresQueryDto {
  ordenarPor?: IndicadorApoyo;
  orden?: "asc" | "desc";
}

export interface RegistrarPretestDto {
  indicador: Indicador;
  periodoDescrito: string;
  fechaInicio: string;
  fechaFin: string;
  numerador: number;
  denominador: number;
  fuente: string;
}

export interface CerrarMedicionDto {
  periodoId: string;
}

export interface NuevaVersionMedicionDto {
  motivoCambio: string;
}

export interface ExportarIndicadoresQueryDto {
  periodoId?: string;
  indicador?: Indicador;
  fechaInicio?: string;
  fechaFin?: string;
  docenteId?: string;
}

// ============================================================================
// DTOs de Respuesta: Tablero y Desgloses
// ============================================================================

export interface DesgloseCspDto {
  planificadas: number;
  cumplidas: number;
  parciales: number;
  noCumplidas: number;
  justificadas: number;
  denominadorEfectivo: number;
}

export interface DesgloseIsaDto {
  programadas: number;
  publicadasATiempo: number;
  publicadasFueraDePlazo: number;
  pendientes: number;
  vistasPorFamilia: number;
  porcentajeVistasFamilia: number;
}

export interface DesgloseIgmDto {
  planificados: number;
  publicadosATiempo: number;
  publicadosFueraDePlazo: number;
  pendientes: number;
  extras: number;
}

export interface IndicadorCalculadoDto<
  TDesglose = DesgloseCspDto | DesgloseIsaDto | DesgloseIgmDto,
> {
  indicador: Indicador;
  nombre: string;
  dimension: string;
  formula: string;
  numerador: number;
  denominador: number;
  porcentaje: number | null;
  porcentajeTexto: string;
  enCurso: boolean;
  sinDatos: boolean;
  mensajeSinDatos?: string;
  desglose: TDesglose;
}

export interface DetalleCursoDocenteIndicadorDto {
  cursoId: string;
  cursoNombre: string;
  seccionId: string;
  seccionNombre: string;
  gradoNombre: string;
  csp: IndicadorCalculadoDto<DesgloseCspDto>;
  igm: IndicadorCalculadoDto<DesgloseIgmDto>;
}

export interface TableroIndicadoresResponseDto {
  periodoId: string | null;
  periodoNombre: string | null;
  enCurso: boolean;
  csp: IndicadorCalculadoDto<DesgloseCspDto>;
  isa: IndicadorCalculadoDto<DesgloseIsaDto>;
  igm: IndicadorCalculadoDto<DesgloseIgmDto>;
  detallePorCursos?: DetalleCursoDocenteIndicadorDto[];
}

export interface MisIndicadoresDocenteResponseDto {
  docenteId: string;
  docenteNombre: string;
  periodoId: string | null;
  periodoNombre: string | null;
  enCurso: boolean;
  csp: IndicadorCalculadoDto<DesgloseCspDto>;
  igm: IndicadorCalculadoDto<DesgloseIgmDto>;
  cursos: DetalleCursoDocenteIndicadorDto[];
}

// ============================================================================
// DTOs de Respuesta: Pretest y Mediciones Congeladas
// ============================================================================

export interface PretestResponseDto {
  id: string;
  indicador: Indicador;
  periodoDescrito: string;
  fechaInicio: string;
  fechaFin: string;
  numerador: number;
  denominador: number;
  porcentaje: number;
  porcentajeTexto: string;
  fuente: string;
  vigente: boolean;
  registradoPorId: string;
  registradoPorNombre?: string;
  creadoEn: string;
}

export interface MedicionIndicadorItemDto {
  indicador: Indicador;
  numerador: number;
  denominador: number;
  porcentaje: number;
  porcentajeTexto: string;
  desglose: DesgloseCspDto | DesgloseIsaDto | DesgloseIgmDto;
}

export interface MedicionBimestreResponseDto {
  id: string;
  periodoId: string;
  periodoNombre: string;
  version: number;
  vigente: boolean;
  motivoCambio: string | null;
  cerradaPorId: string;
  cerradaPorNombre?: string;
  cerradaEn: string;
  indicadores: MedicionIndicadorItemDto[];
}

export interface HistorialMedicionResponseDto {
  periodoId: string;
  periodoNombre: string;
  versiones: MedicionBimestreResponseDto[];
}

// ============================================================================
// DTOs de Respuesta: Comparación y Evolución
// ============================================================================

export interface ComparacionItemPretestDto {
  registrado: boolean;
  porcentaje: number | null;
  porcentajeTexto: string;
  fuente?: string;
  periodoDescrito?: string;
  mensaje?: string;
}

export interface ComparacionItemPostestDto {
  medido: boolean;
  porcentaje: number | null;
  porcentajeTexto: string;
  version?: number;
  cerradaEn?: string;
}

export interface ComparacionIndicadorItemDto {
  indicador: Indicador;
  nombre: string;
  dimension: string;
  pretest: ComparacionItemPretestDto;
  postest: ComparacionItemPostestDto;
  variacionPuntos: number | null;
  variacionPuntosTexto: string;
}

export interface EvolucionBimestreItemDto {
  periodoId: string;
  periodoNombre: string;
  numero: number;
  csp: number | null;
  isa: number | null;
  igm: number | null;
}

export interface ComparacionBimestreResponseDto {
  periodoId: string;
  periodoNombre: string;
  comparaciones: ComparacionIndicadorItemDto[];
  evolucionBimestres: EvolucionBimestreItemDto[];
}

// ============================================================================
// DTOs de Respuesta: Panel General Directivo
// ============================================================================

export interface ResumenAsistenciaHoyDto {
  totalEstudiantesMatriculados: number;
  estudiantesConIngreso: number;
  porcentajeAsistencia: number;
  porcentajeAsistenciaTexto: string;
}

export interface ResumenTardanzasHoyDto {
  totalTardanzas: number;
}

export interface ResumenSesionesHoyDto {
  totalSesiones: number;
  cumplidas: number;
  enCurso: number;
  pendientes: number;
  noCumplidas: number;
  justificadas: number;
}

export interface ResumenLibretasPendientesDto {
  totalPendientes: number;
  vencidas: number;
  porVencer: number;
}

export interface IndicadoresBimestreActualDto {
  periodoId: string | null;
  periodoNombre: string | null;
  enCurso: boolean;
  cspPorcentaje: number | null;
  isaPorcentaje: number | null;
  igmPorcentaje: number | null;
}

export interface PanelGeneralResponseDto {
  fecha: string;
  asistenciaHoy: ResumenAsistenciaHoyDto;
  tardanzasHoy: ResumenTardanzasHoyDto;
  sesionesHoy: ResumenSesionesHoyDto;
  libretasPendientes: ResumenLibretasPendientesDto;
  indicadoresBimestreActual: IndicadoresBimestreActualDto;
}

// ============================================================================
// DTO de Mensajes del Backend
// ============================================================================

export interface MensajeIndicadoresResponseDto {
  mensaje: string;
  id?: string;
  version?: number;
}

// ============================================================================
// DTOs de Respuesta: Indicadores de apoyo del seguimiento docente (RF-020 V2)
// Informativos: sin meta, semáforo ni calificación; no se congelan.
// ============================================================================

export interface JornadasEfectivasApoyoDto {
  sinDatos: boolean;
  valor: number | null;
  minutosProgramados: number;
  minutosEfectivos: number;
}

export interface MinutosPerdidosApoyoDto {
  sinDatos: boolean;
  total: number | null;
  promedioPorSesion: number | null;
  sesionesEjecutadas: number;
}

export interface PuntualidadApoyoDto {
  sinDatos: boolean;
  valor: number | null;
  puntuales: number;
  sesionesConIngreso: number;
}

export interface MinutosFueraAulaApoyoDto {
  sinDatos: boolean;
  minutos: number | null;
  supervisiones: number;
}

export interface TiempoResolucionApoyoDto {
  sinDatos: boolean;
  promedioDias: number | null;
  resueltas: number;
  vencidas: number;
}

export interface ResumenApoyoDto {
  jornadasEfectivas: JornadasEfectivasApoyoDto;
  minutosPerdidos: MinutosPerdidosApoyoDto;
  puntualidad: PuntualidadApoyoDto;
  minutosFueraAula: MinutosFueraAulaApoyoDto;
  tiempoResolucion: TiempoResolucionApoyoDto;
}

export interface FilaRankingApoyoDto {
  docenteId: string;
  docenteNombre: string;
  resumen: ResumenApoyoDto;
}

export interface EvolucionApoyoDto {
  periodoId: string;
  periodoNombre: string;
  enCurso: boolean;
  mensajeEnCurso: string | null;
  resumen: ResumenApoyoDto;
}

export interface IndicadoresApoyoResponseDto {
  titulo: string;
  mensaje: string;
  etiquetaSinDatos: string;
  periodoId: string | null;
  periodoNombre: string | null;
  desde: string;
  hasta: string;
  enCurso: boolean;
  mensajeEnCurso: string | null;
  resumen: ResumenApoyoDto;
  /** Solo Director y Subdirector; el docente no recibe ranking. */
  ranking: FilaRankingApoyoDto[] | null;
  evolucion: EvolucionApoyoDto[];
}
