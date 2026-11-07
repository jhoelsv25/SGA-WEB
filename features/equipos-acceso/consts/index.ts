import type { StatusBadgeTone } from "@/components/common/status-badge/types";

/** Mismo valor que la columna `equipos_acceso.estado` y que usa SGA-NET. */
export const ESTADO_EQUIPO_ACCESO = {
  PENDIENTE: 1,
  AUTORIZADO: 2,
  RECHAZADO: 3,
  REVOCADO: 4,
} as const;

export const ESTADO_EQUIPO_ACCESO_META: Record<number, { label: string; tone: StatusBadgeTone }> = {
  [ESTADO_EQUIPO_ACCESO.PENDIENTE]: { label: "Pendiente", tone: "warning" },
  [ESTADO_EQUIPO_ACCESO.AUTORIZADO]: { label: "Autorizado", tone: "success" },
  [ESTADO_EQUIPO_ACCESO.RECHAZADO]: { label: "Rechazado", tone: "danger" },
  [ESTADO_EQUIPO_ACCESO.REVOCADO]: { label: "Revocado", tone: "neutral" },
};

export const PLATAFORMA_EQUIPO_ACCESO_LABEL: Record<number, string> = {
  0: "Otro",
  1: "Windows",
  2: "Android",
  3: "Web",
};

export const ACCION_EQUIPO_ACCESO_TEXTOS = {
  autorizar: {
    titulo: "Autorizar equipo",
    descripcion: "El usuario podrá iniciar sesión en SGA-NET desde este equipo.",
    confirmar: "Sí, autorizar",
    exito: "Equipo autorizado.",
  },
  rechazar: {
    titulo: "Rechazar equipo",
    descripcion: "El usuario no podrá iniciar sesión desde este equipo.",
    confirmar: "Sí, rechazar",
    exito: "Solicitud rechazada.",
  },
  revocar: {
    titulo: "Revocar equipo",
    descripcion: "El equipo dejará de poder iniciar sesión de inmediato.",
    confirmar: "Sí, revocar",
    exito: "Equipo revocado.",
  },
} as const;
