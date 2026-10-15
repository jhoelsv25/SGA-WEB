"use client";

import { useQuery } from "@tanstack/react-query";
import {
  listarConsolidadosPeriodo,
  obtenerDetalleConsolidado,
  obtenerHistorialVersiones,
  obtenerMiSeguimiento,
} from "../api";
import type { ConsolidadoQueryDto } from "../types";
import { consolidadoKeys } from "./consolidado-keys";

export function useConsolidadosQuery(query: ConsolidadoQueryDto, enabled = true) {
  return useQuery({
    queryKey: consolidadoKeys.lista(query),
    queryFn: () => listarConsolidadosPeriodo(query),
    enabled: Boolean(query.periodoId) && enabled,
    staleTime: 30_000,
  });
}

export function useDetalleConsolidadoQuery(consolidadoId: string, enabled = true) {
  return useQuery({
    queryKey: consolidadoKeys.detalle(consolidadoId),
    queryFn: () => obtenerDetalleConsolidado(consolidadoId),
    enabled: Boolean(consolidadoId) && enabled,
    staleTime: 30_000,
  });
}

export function useMiSeguimientoQuery(periodoId: string, enabled = true) {
  return useQuery({
    queryKey: consolidadoKeys.miSeguimiento(periodoId),
    queryFn: () => obtenerMiSeguimiento(periodoId),
    enabled: Boolean(periodoId) && enabled,
    staleTime: 30_000,
  });
}

export function useHistorialVersionesQuery(consolidadoId: string, enabled = true) {
  return useQuery({
    queryKey: consolidadoKeys.versiones(consolidadoId),
    queryFn: () => obtenerHistorialVersiones(consolidadoId),
    enabled: Boolean(consolidadoId) && enabled,
    staleTime: 60_000,
  });
}
