"use client";

import { useQuery } from "@tanstack/react-query";
import { useAnioLectivo } from "@/features/anio-escolar/anio-lectivo-context";
import {
  getAusenciasSupervisor,
  getDetalleAusenciaDocente,
  getHistorialAusencia,
  getMisAusencias,
} from "../api";
import type { FiltroAusenciasQueryDto } from "../types";
import { ausenciasKeys } from "./ausencias-keys";

/**
 * Consulta el listado de ausencias docentes para el supervisor con filtros opcionales.
 */
export function useAusenciasSupervisor(filtros?: FiltroAusenciasQueryDto) {
  const { anio } = useAnioLectivo();

  return useQuery({
    queryKey: ausenciasKeys.supervisor(anio?.id, filtros),
    queryFn: () => getAusenciasSupervisor(filtros),
    staleTime: 30_000,
    gcTime: 5 * 60_000,
  });
}

/**
 * Consulta el historial de versiones de una ausencia docente específica.
 */
export function useHistorialAusencia(id: string, habilitado = true) {
  return useQuery({
    queryKey: ausenciasKeys.historial(id),
    queryFn: () => getHistorialAusencia(id),
    enabled: Boolean(id) && habilitado,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
  });
}

/**
 * Consulta las ausencias vigentes del docente autenticado.
 */
export function useMisAusencias() {
  const { anio } = useAnioLectivo();

  return useQuery({
    queryKey: ausenciasKeys.docente(anio?.id),
    queryFn: getMisAusencias,
    staleTime: 30_000,
    gcTime: 5 * 60_000,
  });
}

/**
 * Consulta el detalle de una ausencia vigente para el docente autenticado.
 */
export function useDetalleAusenciaDocente(id: string, habilitado = true) {
  return useQuery({
    queryKey: ausenciasKeys.detalleDocente(id),
    queryFn: () => getDetalleAusenciaDocente(id),
    enabled: Boolean(id) && habilitado,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
  });
}
