export type EstadoSesion =
  | "pendiente"
  | "en_curso"
  | "cumplida"
  | "parcial"
  | "no_cumplida"
  | "justificada"
  | "reprogramada";

export type EstadoJustificacion = "solicitada" | "aprobada" | "rechazada";

export interface JustificacionSesion {
  estado: EstadoJustificacion;
  motivo: string;
  /** Código del catálogo de motivos (RF-011 V3); null en solicitudes anteriores. */
  motivoCodigo: string | null;
  documentoUrl: string | null;
  comentario: string | null;
  solicitadaEn: string | null;
  revisadaEn: string | null;
}

export interface Sesion {
  id: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  cursoNombre: string;
  seccionNombre: string;
  docenteId: string;
  docenteNombre: string;
  docenteTitularNombre: string | null;
  estado: EstadoSesion;
  tema: string | null;
  horaIngreso: string | null;
  horaSalida: string | null;
  minutosRetraso: number;
  minutosPerdidos: number;
  salidaAutomatica: boolean;
  observaciones: string | null;
  justificacion: JustificacionSesion | null;
}

export interface SesionPanel extends Sesion {
  alerta: boolean;
  /** Mensaje de la alerta de salida (sesión en curso por terminar sin firma de salida). */
  alertaSalida: string | null;
}

export type PeriodoAlertaMinutos = "dia" | "semana";

export interface AlertaMinutosDocente {
  docenteId: string;
  docenteNombre: string;
  periodo: PeriodoAlertaMinutos;
  minutos: number;
  umbral: number;
  mensaje: string;
}

export interface PanelSesiones {
  fecha: string;
  sesiones: SesionPanel[];
  alertasMinutos: AlertaMinutosDocente[];
  totalAlertas: number;
}

/** Motivo del catálogo de justificaciones, con las reglas que fija la API. */
export interface MotivoJustificacion {
  codigo: string;
  etiqueta: string;
  requiereDocumento: boolean;
  requiereObservacion: boolean;
  aviso: string | null;
}

export interface SolicitudJustificacion extends Sesion {
  /** Días hábiles desde la solicitud. */
  antiguedadDias: number;
  vencida: boolean;
}

export interface ContadorPermisos {
  usados: number;
  tope: number;
  mensaje: string;
}

export interface DetalleSolicitudJustificacion {
  solicitud: SolicitudJustificacion;
  permisosPersonales: ContadorPermisos | null;
}

export interface FiltrosBandejaJustificaciones {
  motivo?: string;
  vencidas?: boolean;
}

export interface SolicitudJustificacionPayload {
  /** Código del catálogo (`descanso_medico`, `otro`, …), no texto libre. */
  motivo: string;
  observacion?: string;
  documentoUrl?: string;
}

export interface TotalesSesiones {
  cumplidas: number;
  parciales: number;
  noCumplidas: number;
  justificadas: number;
  pendientes: number;
}

export interface MisSesiones {
  sesiones: Sesion[];
  totales: TotalesSesiones;
}

export interface MensajeSesion {
  mensaje: string;
  sesion: Sesion;
}

export interface SesionesKiosko {
  docenteNombre: string;
  sesiones: Sesion[];
  destacadaId: string | null;
  mensaje?: string;
}

export interface CredencialesKiosko {
  codigo: string;
  pin: string;
}

export interface MiJornadaHoy {
  fecha: string;
  docenteNombre: string;
  destacadaId: string | null;
  minutosAntes: number;
  firmaWebHabilitada: boolean;
  sesiones: Sesion[];
}
