import type { ConsolidadoQueryDto, PendientesQueryDto } from "../types";

export const consolidadoKeys = {
  all: ["consolidado-docente"] as const,
  listas: () => [...consolidadoKeys.all, "lista"] as const,
  lista: (query: ConsolidadoQueryDto) => [...consolidadoKeys.listas(), query] as const,
  detalles: () => [...consolidadoKeys.all, "detalle"] as const,
  detalle: (id: string) => [...consolidadoKeys.detalles(), id] as const,
  versiones: (id: string) => [...consolidadoKeys.all, "versiones", id] as const,
  compromisos: (consolidadoId: string) =>
    [...consolidadoKeys.all, "compromisos", consolidadoId] as const,
  compromiso: (compromisoId: string) =>
    [...consolidadoKeys.all, "compromiso", compromisoId] as const,
  pendientes: (query: PendientesQueryDto) => [...consolidadoKeys.all, "pendientes", query] as const,
  miSeguimiento: (periodoId: string) =>
    [...consolidadoKeys.all, "mi-seguimiento", periodoId] as const,
};
