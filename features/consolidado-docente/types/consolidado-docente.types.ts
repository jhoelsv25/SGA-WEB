export type DecisionConsolidado = "ninguna" | "llamada_atencion" | "compromiso_mejora" | "derivado";

export type EstadoConsolidado = "cerrado" | "reabierto";

export type EstadoSolicitudRevision = "solicitada" | "aceptada" | "rechazada";

export interface ConsolidadoResumenItem {
  id: string;
  docenteId: string;
  docenteNombre: string;
  docenteDni: string;
  periodoId: string;
  periodoNombre: string;
  version: number;
  vigente: boolean;
  estado: EstadoConsolidado;
  sesionesProgramadas: number;
  sesionesCumplidas: number;
  sesionesParciales: number;
  sesionesNoCumplidas: number;
  sesionesJustificadas: number;
  minutosPerdidosFirma: number;
  totalAusencias: number;
  minutosFueraAula: number;
  minutosTotalFuera: number;
  tiempoTotalFueraTexto: string;
  /** Horas pedagógicas y minutos equivalentes (RF-013 V2); nulos en consolidados anteriores. */
  horasProgramadas: number | null;
  horasDictadas: number | null;
  horasPerdidas: number | null;
  minutosProgramados: number | null;
  minutosDictados: number | null;
  minutosNoDictados: number | null;
  minutosHoraPedagogica: number | null;
  decision: DecisionConsolidado;
  /** Fecha y hora en que el Director registró su decisión; nula si aún no decide. */
  decisionRegistradaEn: string | null;
  observacion: string | null;
  motivoCambio?: string | null;
  generadoEn: string;
  generadoPorNombre: string;
  solicitudesPendientesCount?: number;
  firmaDocenteUrl?: string | null;
}

export interface DetalleAusenciaConsolidado {
  ausenciaId: string;
  tramoHorario: string;
  minutos: number;
  motivo: string;
  observacion: string | null;
  descargo: string | null;
  anulada: boolean;
  fotos: string[];
}

export interface DetalleSesionConsolidado {
  sesionId: string;
  fecha: string;
  cursoNombre: string;
  seccionNombre: string;
  gradoNombre: string;
  tema: string | null;
  horaIngresoProgramada: string;
  horaSalidaProgramada: string;
  horaIngresoFirmada: string | null;
  horaSalidaFirmada: string | null;
  minutosPerdidos: number;
  estado: string;
  ausencias: DetalleAusenciaConsolidado[];
}

export interface SolicitudRevisionItem {
  id: string;
  consolidadoId: string;
  docenteId: string;
  docenteNombre?: string;
  estado: EstadoSolicitudRevision;
  motivo: string;
  adjuntoUrl: string | null;
  solicitadoEn: string;
  resueltoPorNombre: string | null;
  resueltoEn: string | null;
  respuesta: string | null;
}

export interface DetalleDocenteConsolidadoResponse {
  consolidado: ConsolidadoResumenItem;
  sesiones: DetalleSesionConsolidado[];
  solicitudPendiente: SolicitudRevisionItem | null;
  firmaDocenteUrl: string | null;
}

export interface HistorialVersionConsolidadoItem {
  id: string;
  version: number;
  vigente: boolean;
  estado: EstadoConsolidado;
  motivoCambio: string | null;
  minutosTotalFuera: number;
  tiempoTotalFueraTexto: string;
  sesionesProgramadas: number;
  sesionesCumplidas: number;
  sesionesParciales: number;
  sesionesNoCumplidas: number;
  sesionesJustificadas: number;
  totalAusencias: number;
  minutosFueraAula: number;
  decision: DecisionConsolidado;
  observacion: string | null;
  generadoPorNombre: string;
  generadoEn: string;
}

export interface GenerarConsolidadoDto {
  periodoId: string;
  docenteId?: string;
}

export interface ActualizarDecisionDto {
  decision: DecisionConsolidado;
  observacion?: string;
}

export interface CerrarConsolidadoDto {
  motivoCambio?: string;
}

export interface SolicitarRevisionDto {
  motivo: string;
  adjuntoUrl?: string | null;
}

export interface ResolverSolicitudRevisionDto {
  accion: "aceptar" | "rechazar";
  respuesta?: string;
}

export interface ConsolidadoQueryDto {
  periodoId: string;
  ordenarPor?: string;
  orden?: "asc" | "desc";
}
