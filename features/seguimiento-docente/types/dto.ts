/**
 * DTOs de entrada y salida para el módulo de Consolidado y Seguimiento Docente (RF-013).
 * Basados estrictamente en CONTRATO_RF013.md.
 */

import type { DecisionConsolidado, EstadoConsolidado, EstadoSolicitudRevision } from "./dominio";

// ========================================================
// 1. DTOs de Entrada (Payloads y Queries)
// ========================================================

export interface RegistrarDecisionDto {
  /**
   * Decisión directiva adoptada por el Director.
   * Valores válidos: 'ninguna' | 'llamada_atencion' | 'compromiso_mejora' | 'derivado'.
   */
  decision: DecisionConsolidado;

  /**
   * Observación o comentario que acompaña a la decisión (ej. fecha de compromiso o acta).
   */
  observacion?: string;
}

export interface CerrarConsolidadoDto {
  /**
   * Motivo obligatorio del recálculo y cierre para versionado (CP-RF013-08, CP-RF013-09).
   * Obligatorio desde la versión 2.
   */
  motivoCambio: string;
}

export interface CrearSolicitudRevisionDto {
  /** Identificador único del consolidado sobre el que se solicita revisión */
  consolidadoId: string;

  /**
   * Motivo de la solicitud expresado por el docente (CP-RF013-12, CP-RF013-13).
   */
  motivo: string;
}

export interface CrearSolicitudRevisionPayload {
  datos: CrearSolicitudRevisionDto;
  adjunto?: File;
}

export interface ResolverSolicitudDto {
  /**
   * Respuesta o fundamentación del Director al aceptar la solicitud (opcional en aceptación).
   */
  respuesta?: string;
}

export interface RechazarSolicitudDto {
  /**
   * Respuesta obligatoria del Director al rechazar la solicitud (CP-RF013-16, CP-RF013-17).
   */
  respuesta: string;
}

export interface FiltroReporteBimestreQueryDto {
  ordenarPor?:
    | "docente"
    | "sesionesProgramadas"
    | "sesionesCumplidas"
    | "minutosPerdidosFirma"
    | "totalAusencias"
    | "minutosFueraAula"
    | "totalMinutosFueraClase"
    | string;
  direccion?: "asc" | "desc";
}

export interface FiltroSolicitudesQueryDto {
  periodoId?: string;
  estado?: EstadoSolicitudRevision;
}

// ========================================================
// 2. DTOs de Respuesta (Contrato Inmutable Backend)
// ========================================================

export interface ConsolidadoResumenDto {
  id: string;
  docenteId: string;
  docenteNombre: string;
  docenteDocumento: string;
  periodoId: string;
  periodoNombre: string;
  consolidadoRaizId: string | null;
  version: number;
  vigente: boolean;
  estado: EstadoConsolidado;
  motivoCambio: string | null;
  sesionesProgramadas: number;
  sesionesCumplidas: number;
  sesionesParciales: number;
  sesionesNoCumplidas: number;
  sesionesJustificadas: number;
  minutosPerdidosFirma: number;
  totalAusencias: number;
  minutosFueraAula: number;
  totalMinutosFueraClase: number;
  /** Representación textual exacta en horas y minutos: 'X h Y min' (ej. '1 h 40 min', '0 h 40 min') */
  tiempoFueraClaseTexto: string;
  decision: DecisionConsolidado;
  observacion: string | null;
  generadoPorId: string;
  generadoPorNombre: string;
  generadoEn: string; // ISO 8601
  reabiertoPorId: string | null;
  reabiertoPorNombre: string | null;
  reabiertoEn: string | null; // ISO 8601
}

export interface PeriodoResumenDto {
  id: string;
  nombre: string;
  numero: number;
  estado: string; // 'planificado' | 'en_curso' | 'cerrado'
  fechaInicio: string; // YYYY-MM-DD
  fechaFin: string; // YYYY-MM-DD
}

export interface ReporteBimestreResponseDto {
  periodo: PeriodoResumenDto;
  docentes: ConsolidadoResumenDto[];
  totalDocentes: number;
  totalMinutosPerdidosFirma: number;
  totalMinutosFueraAula: number;
  totalMinutosFueraClase: number;
  tiempoTotalFueraClaseTexto: string;
}

export interface EvidenciaFotoConsolidadoDto {
  id: string;
  archivoUrl: string;
  tomadaEn: string | null;
  orden: number;
}

export interface DetalleAusenciaConsolidadoDto {
  id: string;
  horaDesde: string; // "HH:mm"
  horaHasta: string; // "HH:mm"
  minutos: number;
  motivo: string;
  observacion: string | null;
  descargo: string | null;
  descargoEn: string | null;
  fotos: EvidenciaFotoConsolidadoDto[];
}

export interface DetalleSesionConsolidadoDto {
  id: string;
  fecha: string; // "YYYY-MM-DD"
  cursoNombre: string;
  seccionNombre: string;
  tema: string | null;
  horaInicioPlan: string | null; // "HH:mm"
  horaFinPlan: string | null; // "HH:mm"
  horaInicioReal: string | null; // "HH:mm"
  horaFinReal: string | null; // "HH:mm"
  minutosRetraso: number;
  minutosPerdidos: number;
  estado: string; // 'cumplida' | 'parcial' | 'no_cumplida' | 'justificada' | 'reprogramada'
  justificacionComentario: string | null;
  ausencias: DetalleAusenciaConsolidadoDto[];
}

export interface ConsolidadoDetalleResponseDto extends ConsolidadoResumenDto {
  firmaDocenteUrl: string | null;
  sesiones: DetalleSesionConsolidadoDto[];
}

export interface VersionHistorialConsolidadoDto {
  id: string;
  version: number;
  vigente: boolean;
  estado: EstadoConsolidado;
  motivoCambio: string | null;
  sesionesProgramadas: number;
  sesionesCumplidas: number;
  sesionesParciales: number;
  sesionesNoCumplidas: number;
  sesionesJustificadas: number;
  minutosPerdidosFirma: number;
  totalAusencias: number;
  minutosFueraAula: number;
  totalMinutosFueraClase: number;
  tiempoFueraClaseTexto: string;
  decision: DecisionConsolidado;
  observacion: string | null;
  generadoPorId: string;
  generadoPorNombre: string;
  generadoEn: string;
  reabiertoPorId: string | null;
  reabiertoPorNombre: string | null;
  reabiertoEn: string | null;
}

export interface HistorialConsolidadoResponseDto {
  consolidadoRaizId: string;
  docenteId: string;
  docenteNombre: string;
  periodoId: string;
  periodoNombre: string;
  versiones: VersionHistorialConsolidadoDto[];
}

export interface SolicitudRevisionResponseDto {
  id: string;
  consolidadoId: string;
  docenteId: string;
  docenteNombre: string;
  docenteDocumento: string;
  periodoId: string;
  periodoNombre: string;
  motivo: string;
  adjuntoUrl: string | null;
  adjuntoNombre: string | null;
  estado: EstadoSolicitudRevision;
  respuesta: string | null;
  resueltaPorId: string | null;
  resueltaPorNombre: string | null;
  creadoEn: string; // ISO 8601
  resueltaEn: string | null; // ISO 8601
}

export interface MiConsolidadoResponseDto {
  consolidado: ConsolidadoResumenDto;
  sesiones: DetalleSesionConsolidadoDto[];
  solicitudPendiente: SolicitudRevisionResponseDto | null;
}

export interface MensajeConsolidadoResponseDto {
  mensaje: string;
  cantidad?: number;
  id?: string;
  version?: number;
}

export interface ReabrirConsolidadoResponseDto extends MensajeConsolidadoResponseDto {
  consolidado: ConsolidadoResumenDto;
}

export interface CerrarConsolidadoResponseDto extends MensajeConsolidadoResponseDto {
  consolidado: ConsolidadoResumenDto;
}

export interface CrearSolicitudRevisionResponseDto extends MensajeConsolidadoResponseDto {
  solicitud: SolicitudRevisionResponseDto;
}
