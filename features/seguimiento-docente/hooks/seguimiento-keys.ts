import type { FiltroReporteBimestreQueryDto, FiltroSolicitudesQueryDto } from "../types";

/**
 * Fábrica estructurada de claves de caché para TanStack Query.
 * Incluye el Año académico activo para evitar mezclar datos de distintos periodos.
 */
export const seguimientoKeys = {
  all: ["seguimiento-docente"] as const,

  // Reporte de bimestre general
  reportes: () => [...seguimientoKeys.all, "reporte"] as const,
  reporte: (anioId?: string, periodoId?: string, filtros?: FiltroReporteBimestreQueryDto) =>
    [...seguimientoKeys.reportes(), anioId ?? "vigente", periodoId ?? "", filtros ?? {}] as const,

  // Detalle de un consolidado individual
  detalles: () => [...seguimientoKeys.all, "detalle"] as const,
  detalle: (id: string) => [...seguimientoKeys.detalles(), id] as const,

  // Historial de versiones de un consolidado
  historiales: () => [...seguimientoKeys.all, "historial"] as const,
  historial: (id: string) => [...seguimientoKeys.historiales(), id] as const,

  // Solicitudes de revisión (Director)
  solicitudes: () => [...seguimientoKeys.all, "solicitudes"] as const,
  solicitudesLista: (anioId?: string, filtros?: FiltroSolicitudesQueryDto) =>
    [...seguimientoKeys.solicitudes(), anioId ?? "vigente", filtros ?? {}] as const,

  // Mi consolidado vigente (Docente)
  miSeguimiento: () => [...seguimientoKeys.all, "mi-seguimiento"] as const,
  miConsolidado: (anioId?: string, periodoId?: string) =>
    [...seguimientoKeys.miSeguimiento(), anioId ?? "vigente", periodoId ?? ""] as const,
};
