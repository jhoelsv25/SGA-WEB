"use client";

import { useQuery } from "@tanstack/react-query";
import {
  listarCompromisos,
  obtenerSolicitudPendiente,
  listarConsolidadosPeriodo,
  obtenerCompromiso,
  obtenerPendientes,
  obtenerDetalleConsolidado,
  obtenerHistorialVersiones,
  obtenerMiSeguimiento,
} from "../api";
import type {
  ConsolidadoQueryDto,
  ConsolidadoResumenItem,
  PendientesQueryDto,
  SolicitudRevisionItem,
} from "../types";
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

/**
 * El enlace de «Pendientes de seguimiento» trae solo el id de la solicitud. Entre los
 * consolidados del bimestre con solicitudes pendientes se busca a cuál pertenece.
 */
export function useSolicitudPorEnlaceQuery(
  solicitudId: string,
  consolidados: readonly ConsolidadoResumenItem[],
  enabled = true,
) {
  const candidatos = consolidados
    .filter((c) => (c.solicitudesPendientesCount ?? 0) > 0)
    .map((c) => c.id);
  return useQuery<SolicitudRevisionItem | null>({
    queryKey: [...consolidadoKeys.all, "solicitud-por-enlace", solicitudId, candidatos],
    queryFn: async () => {
      for (const consolidadoId of candidatos) {
        const solicitud = await obtenerSolicitudPendiente(consolidadoId);
        if (solicitud?.id === solicitudId) return solicitud;
      }
      return null;
    },
    enabled: Boolean(solicitudId) && candidatos.length > 0 && enabled,
    staleTime: 15_000,
  });
}
