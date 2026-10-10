import type { EstadoSeccion } from "../types";

export const ESTADOS_SECCION: readonly EstadoSeccion[] = ["activa", "cerrada"] as const;

export const ESTADO_SECCION_LABELS: Record<EstadoSeccion, string> = {
  activa: "Activa",
  cerrada: "Cerrada",
};
