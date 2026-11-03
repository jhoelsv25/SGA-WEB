export type EstadoPendienteApi = "pendiente" | "asignada" | "descartada";
export type MotivoPendienteApi = "codigo_desconocido" | "no_docente" | "sin_turno";
export type EstadoRelojApi =
  "nunca_conectado" | "ok" | "app_sin_conexion" | "reloj_no_responde" | "fuera_de_horario";

export interface PendienteApi {
  id: string;
  equipoId: string;
  equipoNombre: string | null;
  codigoBiometrico: string;
  fechaHora: string;
  motivo: MotivoPendienteApi;
  estado: EstadoPendienteApi;
  personaId: string | null;
  motivoDescarte: string | null;
  resueltaEn: string | null;
}

export interface ResolverPendienteResponse {
  mensaje: string;
  pendiente: PendienteApi;
}

export interface AsignarPendientePayload {
  personaId: string;
  vincularCodigo?: boolean;
}

export interface DescartarPendientePayload {
  motivo: string;
}

export interface EstadoRelojApiDto {
  equipoId: string;
  nombre: string;
  ubicacion: string;
  activo: boolean;
  ultimoLatidoEn: string | null;
  relojRespondioEn: string | null;
  desfaseMinutos: number | null;
  config: ConfigRelojApi;
  estado: EstadoRelojApi;
  alertas: string[];
}

export interface CodigoBiometricoApi {
  personaId: string;
  nombreCompleto: string;
  codigoBiometrico: string | null;
  mensaje: string;
}

export interface ConfigRelojApi {
  relojIp: string | null;
  relojPuerto: number;
  relojClaveComunicacion: number;
  intervaloSegundos: number;
}

export interface GuardarConfigRelojPayload {
  relojIp: string;
  relojPuerto: number;
  relojClaveComunicacion: number;
  intervaloSegundos: number;
}

export interface GuardarConfigRelojResponse {
  mensaje: string;
  config: ConfigRelojApi;
}

export type TipoOrdenApi = "probar_reloj" | "leer_reloj" | "sincronizar";
export type EstadoOrdenApi = "pendiente" | "completada" | "error";

export interface OrdenApi {
  id: string;
  tipo: TipoOrdenApi;
  estado: EstadoOrdenApi;
  mensaje: string | null;
  datos: { recientes?: { codigo: string; fechaHora: string }[]; total?: number } | null;
  creadoEn: string;
  resueltaEn: string | null;
}
