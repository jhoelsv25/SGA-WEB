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
}

export interface PanelSesiones {
  fecha: string;
  sesiones: SesionPanel[];
  totalAlertas: number;
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
