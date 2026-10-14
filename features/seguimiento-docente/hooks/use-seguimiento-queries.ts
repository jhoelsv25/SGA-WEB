"use client";

import { useQuery } from "@tanstack/react-query";
import { useAnioLectivo } from "@/features/anio-escolar/anio-lectivo-context";
import {
  getDetalleConsolidado,
  getHistorialConsolidado,
  getMiConsolidado,
  getReporteBimestre,
  getSolicitudesRevision,
} from "../api";
import type { FiltroReporteBimestreQueryDto, FiltroSolicitudesQueryDto } from "../types";
import { seguimientoKeys } from "./seguimiento-keys";

/**
 * HU4: Consulta el reporte consolidado de todos los docentes del bimestre seleccionado.
 */
export function useReporteBimestre(
  periodoId?: string,
  filtros?: FiltroReporteBimestreQueryDto,
  habilitado = true,
) {
  const { anio } = useAnioLectivo();

  return useQuery({
    queryKey: seguimientoKeys.reporte(anio?.id, periodoId, filtros),
    queryFn: () => getReporteBimestre(periodoId!, filtros),
    enabled: Boolean(periodoId) && habilitado,
    staleTime: 30_000,
    gcTime: 5 * 60_000,
  });
}

/**
 * HU1, HU4: Consulta el detalle completo de un consolidado (sesiones, ausencias y fotos).
 */
export function useDetalleConsolidado(id?: string, habilitado = true) {
  return useQuery({
    queryKey: seguimientoKeys.detalle(id ?? ""),
    queryFn: () => getDetalleConsolidado(id!),
    enabled: Boolean(id) && habilitado,
    staleTime: 30_000,
    gcTime: 5 * 60_000,
  });
}

/**
 * HU2: Consulta el historial completo de versiones de un consolidado.
 */
export function useHistorialConsolidado(id?: string, habilitado = true) {
  return useQuery({
    queryKey: seguimientoKeys.historial(id ?? ""),
    queryFn: () => getHistorialConsolidado(id!),
    enabled: Boolean(id) && habilitado,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
  });
}

/**
 * HU3: Consulta el listado de solicitudes de revisión para la bandeja directiva.
 */
export function useSolicitudesRevision(filtros?: FiltroSolicitudesQueryDto, habilitado = true) {
  const { anio } = useAnioLectivo();

  return useQuery({
    queryKey: seguimientoKeys.solicitudesLista(anio?.id, filtros),
    queryFn: () => getSolicitudesRevision(filtros),
    enabled: habilitado,
    staleTime: 30_000,
    gcTime: 5 * 60_000,
  });
}

/**
 * HU3: Consulta el consolidado vigente del docente autenticado para el bimestre especificado.
 */
export function useMiConsolidado(periodoId?: string, habilitado = true) {
  const { anio } = useAnioLectivo();

  return useQuery({
    queryKey: seguimientoKeys.miConsolidado(anio?.id, periodoId),
    queryFn: () => getMiConsolidado(periodoId!),
    enabled: Boolean(periodoId) && habilitado,
    staleTime: 30_000,
    gcTime: 5 * 60_000,
  });
}
