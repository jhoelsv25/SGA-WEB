"use client";

import { useQuery } from "@tanstack/react-query";
import { useAnioLectivo } from "@/features/anio-escolar/anio-lectivo-context";
import {
  listarPretests,
  obtenerComparacion,
  obtenerHistorialMediciones,
  obtenerMedicionPeriodo,
  obtenerMisIndicadores,
  obtenerPanel,
  obtenerPretestVigente,
  obtenerTablero,
} from "../api";
import type { FiltroIndicadoresQueryDto, Indicador } from "../types";
import { indicadoresKeys } from "./indicadores-keys";

/**
 * Consulta el tablero general con CSP, ISA e IGM según los filtros especificados.
 */
export function useTableroIndicadoresQuery(query?: FiltroIndicadoresQueryDto, habilitado = true) {
  const { anio } = useAnioLectivo();

  return useQuery({
    queryKey: indicadoresKeys.tablero(anio?.id, query),
    queryFn: () => obtenerTablero(query),
    enabled: habilitado,
    staleTime: 30_000,
    gcTime: 5 * 60_000,
  });
}

/**
 * Consulta los indicadores propios del docente autenticado (CSP e IGM) por curso.
 */
export function useMisIndicadoresQuery(periodoId?: string, habilitado = true) {
  const { anio } = useAnioLectivo();

  return useQuery({
    queryKey: indicadoresKeys.misIndicadores(anio?.id, periodoId),
    queryFn: () => obtenerMisIndicadores(periodoId),
    enabled: habilitado,
    staleTime: 30_000,
    gcTime: 5 * 60_000,
  });
}

/**
 * Consulta la lista histórica de pretests registrados.
 */
export function useListarPretestsQuery(habilitado = true) {
  return useQuery({
    queryKey: indicadoresKeys.pretestLista(),
    queryFn: () => listarPretests(),
    enabled: habilitado,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
  });
}

/**
 * Consulta el pretest vigente de un indicador (CSP, ISA o IGM).
 */
export function usePretestVigenteQuery(indicador: Indicador, habilitado = true) {
  return useQuery({
    queryKey: indicadoresKeys.pretestVigente(indicador),
    queryFn: () => obtenerPretestVigente(indicador),
    enabled: Boolean(indicador) && habilitado,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
  });
}

/**
 * Consulta los valores congelados vigentes de la medición de un período cerrado.
 */
export function useMedicionPeriodoQuery(periodoId: string, habilitado = true) {
  return useQuery({
    queryKey: indicadoresKeys.medicionPeriodo(periodoId),
    queryFn: () => obtenerMedicionPeriodo(periodoId),
    enabled: Boolean(periodoId) && habilitado,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
  });
}

/**
 * Consulta el historial de todas las versiones de la medición de un período.
 */
export function useHistorialMedicionesQuery(periodoId: string, habilitado = true) {
  return useQuery({
    queryKey: indicadoresKeys.historialMediciones(periodoId),
    queryFn: () => obtenerHistorialMediciones(periodoId),
    enabled: Boolean(periodoId) && habilitado,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
  });
}

/**
 * Consulta la comparación pretest vs postest y la serie histórica de evolución por bimestre.
 */
export function useComparacionQuery(periodoId: string, habilitado = true) {
  return useQuery({
    queryKey: indicadoresKeys.comparacion(periodoId),
    queryFn: () => obtenerComparacion(periodoId),
    enabled: Boolean(periodoId) && habilitado,
    staleTime: 30_000,
    gcTime: 5 * 60_000,
  });
}

/**
 * Consulta el panel general con asistencia, tardanzas, sesiones y libretas del día.
 */
export function usePanelGeneralQuery(habilitado = true) {
  const { anio } = useAnioLectivo();

  return useQuery({
    queryKey: indicadoresKeys.panel(anio?.id),
    queryFn: () => obtenerPanel(),
    enabled: habilitado,
    staleTime: 30_000,
    gcTime: 5 * 60_000,
  });
}
