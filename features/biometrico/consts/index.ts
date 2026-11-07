import type { EstadoRelojApi, MotivoPendienteApi } from "../types";

export const MENU_MARCACIONES_PENDIENTES = "/admin/marcaciones-pendientes";

export const INTERVALO_ESTADO_RELOJES_MS = 60_000;

export const MOTIVOS_PENDIENTE_LABEL: Record<MotivoPendienteApi, string> = {
  codigo_desconocido: "Código sin persona",
  no_docente: "No es docente activo",
  sin_turno: "Sin turno configurado",
};

export const ESTADOS_RELOJ_CONFIG: Record<
  EstadoRelojApi,
  { label: string; tone: "success" | "warning" | "danger" | "info" | "neutral" }
> = {
  ok: { label: "Funcionando", tone: "success" },
  fuera_de_horario: { label: "Fuera de horario", tone: "neutral" },
  nunca_conectado: { label: "Sin conectar", tone: "warning" },
  app_sin_conexion: { label: "App sin conexión", tone: "danger" },
  reloj_no_responde: { label: "Reloj no responde", tone: "danger" },
};

export const MENSAJE_MOTIVO_DESCARTE = "Indique el motivo para descartar la marcación.";
export const MENSAJE_CODIGO_BIOMETRICO =
  "El código biométrico solo admite letras y números (máximo 20).";
