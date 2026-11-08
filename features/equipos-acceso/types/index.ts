import type { ESTADO_EQUIPO_ACCESO } from "../consts";

export type EstadoEquipoAcceso = (typeof ESTADO_EQUIPO_ACCESO)[keyof typeof ESTADO_EQUIPO_ACCESO];

/** Computadora desde la que el programa del reloj pide autorización (tabla `equipos_acceso`). */
export interface EquipoAcceso {
  id: string;
  usuarioId: string;
  nombreUsuario: string;
  nombre: string;
  plataforma: number;
  estado: EstadoEquipoAcceso;
  solicitadoEn: string;
  resueltoEn?: string | null;
  resueltoPor?: string | null;
  motivo?: string | null;
  ultimoAcceso?: string | null;
  vigenteHasta?: string | null;
  ip?: string | null;
}

export type AccionEquipoAcceso = "autorizar" | "rechazar" | "revocar";
