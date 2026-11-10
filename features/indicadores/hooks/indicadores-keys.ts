import type { FiltroApoyoQueryDto, FiltroIndicadoresQueryDto, Indicador } from "../types";

/**
 * Fábrica estructurada de claves de caché para TanStack Query.
 * Incluye el Año académico activo para evitar mezclar datos de distintos periodos lectivos.
 */
export const indicadoresKeys = {
  all: ["indicadores"] as const,

  // Tablero general (Director, Subdirector, Administrador)
  tableroRoot: () => [...indicadoresKeys.all, "tablero"] as const,
  tableroAnio: (anioId?: string) =>
    [...indicadoresKeys.tableroRoot(), anioId ?? "vigente"] as const,
  tablero: (anioId?: string, query?: FiltroIndicadoresQueryDto) =>
    [...indicadoresKeys.tableroAnio(anioId), query ?? {}] as const,

  // Mis indicadores (Docente con alcance propio)
  misIndicadoresRoot: () => [...indicadoresKeys.all, "mis-indicadores"] as const,
  misIndicadoresAnio: (anioId?: string) =>
    [...indicadoresKeys.misIndicadoresRoot(), anioId ?? "vigente"] as const,
  misIndicadores: (anioId?: string, periodoId?: string) =>
    [...indicadoresKeys.misIndicadoresAnio(anioId), periodoId ?? "todos"] as const,

  // Indicadores de apoyo del seguimiento docente (RF-020 V2)
  apoyoRoot: () => [...indicadoresKeys.all, "apoyo"] as const,
  apoyo: (anioId?: string, query?: FiltroApoyoQueryDto) =>
    [...indicadoresKeys.apoyoRoot(), "directivo", anioId ?? "vigente", query ?? {}] as const,
  misApoyo: (anioId?: string, query?: FiltroApoyoQueryDto) =>
    [...indicadoresKeys.apoyoRoot(), "propio", anioId ?? "vigente", query ?? {}] as const,

  // Pretests
  pretests: () => [...indicadoresKeys.all, "pretest"] as const,
  pretestLista: () => [...indicadoresKeys.pretests(), "lista"] as const,
  pretestVigente: (indicador: Indicador) =>
    [...indicadoresKeys.pretests(), "vigente", indicador] as const,

  // Mediciones congeladas
  mediciones: () => [...indicadoresKeys.all, "mediciones"] as const,
  medicionPeriodo: (periodoId: string) =>
    [...indicadoresKeys.mediciones(), "periodo", periodoId] as const,
  historialMediciones: (periodoId: string) =>
    [...indicadoresKeys.mediciones(), "historial", periodoId] as const,

  // Comparación pretest vs postest
  comparaciones: () => [...indicadoresKeys.all, "comparacion"] as const,
  comparacion: (periodoId: string) =>
    [...indicadoresKeys.comparaciones(), "periodo", periodoId] as const,

  // Panel general directivo
  panelRoot: () => [...indicadoresKeys.all, "panel"] as const,
  panel: (anioId?: string) => [...indicadoresKeys.panelRoot(), anioId ?? "vigente"] as const,
};
