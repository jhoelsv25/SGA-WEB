"use client";

import { useQuery } from "@tanstack/react-query";
import {
  listarCompromisos,
  listarConsolidadosPeriodo,
  obtenerCompromiso,
  obtenerPendientes,
  obtenerDetalleConsolidado,
  obtenerHistorialVersiones,
  obtenerMiSeguimiento,
} from "../api";
import type { ConsolidadoQueryDto, PendientesQueryDto } from "../types";
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

export function useCompromisosQuery(consolidadoId: string, enabled = true) {
  return useQuery({
    queryKey: consolidadoKeys.compromisos(consolidadoId),
    queryFn: () => listarCompromisos(consolidadoId),
    enabled: Boolean(consolidadoId) && enabled,
    staleTime: 15_000,
  });
}

export function useCompromisoQuery(compromisoId: string, enabled = true) {
  return useQuery({
    queryKey: consolidadoKeys.compromiso(compromisoId),
    queryFn: () => obtenerCompromiso(compromisoId),
    enabled: Boolean(compromisoId) && enabled,
    staleTime: 15_000,
  });
}

export function usePendientesSeguimientoQuery(query: PendientesQueryDto, enabled = true) {
  return useQuery({
    queryKey: consolidadoKeys.pendientes(query),
    queryFn: () => obtenerPendientes(query),
    enabled,
    staleTime: 15_000,
  });
}
