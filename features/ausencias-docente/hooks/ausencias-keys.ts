import type { FiltroAusenciasQueryDto } from "../types";

/**
 * Fábrica estructurada de claves de caché para TanStack Query.
 * Incluye el Año académico activo para evitar mezclar datos de distintos periodos.
 */
export const ausenciasKeys = {
  all: ["ausencias-docente"] as const,

  supervision: (anioId?: string) =>
    [...ausenciasKeys.all, anioId ?? "vigente", "supervision"] as const,

  supervisor: (anioId?: string, filtros?: FiltroAusenciasQueryDto) =>
    [...ausenciasKeys.supervision(anioId), filtros ?? {}] as const,

  historiales: () => [...ausenciasKeys.all, "historial"] as const,

  historial: (id: string) => [...ausenciasKeys.historiales(), id] as const,

  docente: (anioId?: string) =>
    [...ausenciasKeys.all, anioId ?? "vigente", "mis-ausencias"] as const,

  detallesDocente: () => [...ausenciasKeys.all, "detalle-docente"] as const,

  detalleDocente: (id: string) => [...ausenciasKeys.detallesDocente(), id] as const,
};
