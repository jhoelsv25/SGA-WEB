import type { ConsolidadoQueryDto } from "../types";

export const consolidadoKeys = {
  all: ["consolidado-docente"] as const,
  listas: () => [...consolidadoKeys.all, "lista"] as const,
  lista: (query: ConsolidadoQueryDto) => [...consolidadoKeys.listas(), query] as const,
  detalles: () => [...consolidadoKeys.all, "detalle"] as const,
  detalle: (id: string) => [...consolidadoKeys.detalles(), id] as const,
  versiones: (id: string) => [...consolidadoKeys.all, "versiones", id] as const,
  miSeguimiento: (periodoId: string) =>
    [...consolidadoKeys.all, "mi-seguimiento", periodoId] as const,
};
