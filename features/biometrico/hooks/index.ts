"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiClientError } from "@/lib/api-client";
import { toast } from "@/lib/toast";
import {
  asignarCodigoBiometrico,
  asignarPendiente,
  crearOrdenReloj,
  getOrdenesReloj,
  guardarConfigReloj,
  descartarPendiente,
  getCodigoBiometrico,
  getEstadoRelojes,
  getPendientes,
  quitarCodigoBiometrico,
} from "../api";
import { INTERVALO_ESTADO_RELOJES_MS } from "../consts";
import type {
  AsignarPendientePayload,
  GuardarConfigRelojPayload,
  OrdenApi,
  TipoOrdenApi,
  DescartarPendientePayload,
  EstadoPendienteApi,
} from "../types";

export const biometricoKeys = {
  all: ["biometrico"] as const,
  estado: () => [...biometricoKeys.all, "estado"] as const,
  pendientes: (estado: EstadoPendienteApi) =>
    [...biometricoKeys.all, "pendientes", estado] as const,
  ordenes: (equipoId: string) => [...biometricoKeys.all, "ordenes", equipoId] as const,
  codigo: (personaId: string) => [...biometricoKeys.all, "codigo", personaId] as const,
};

/** Estado de los relojes y de su app puente (alertas para Soporte TI). */
export function useEstadoRelojes(habilitado = true) {
  return useQuery({
    queryKey: biometricoKeys.estado(),
    queryFn: getEstadoRelojes,
    enabled: habilitado,
    refetchInterval: INTERVALO_ESTADO_RELOJES_MS,
    staleTime: 30_000,
    retry: false,
  });
}

export function usePendientesQuery(estado: EstadoPendienteApi) {
  return useQuery({
    queryKey: biometricoKeys.pendientes(estado),
    queryFn: () => getPendientes(estado),
    staleTime: 15_000,
  });
}

export function useAsignarPendiente() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: AsignarPendientePayload & { id: string }) =>
      asignarPendiente(id, payload),
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: biometricoKeys.all });
      void queryClient.invalidateQueries({ queryKey: ["marcaciones"] });
      toast.success(data.mensaje);
    },
    onError: (error: ApiClientError) => toast.error(error.message),
  });
}

export function useDescartarPendiente() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: DescartarPendientePayload & { id: string }) =>
      descartarPendiente(id, payload),
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: biometricoKeys.all });
      toast.success(data.mensaje);
    },
    onError: (error: ApiClientError) => toast.error(error.message),
  });
}

export function useCodigoBiometrico(personaId: string | undefined) {
  return useQuery({
    queryKey: biometricoKeys.codigo(personaId ?? ""),
    queryFn: () => getCodigoBiometrico(personaId as string),
    enabled: Boolean(personaId),
    staleTime: 0,
  });
}

export function useAsignarCodigoBiometrico() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ personaId, codigo }: { personaId: string; codigo: string }) =>
      asignarCodigoBiometrico(personaId, codigo),
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: biometricoKeys.codigo(data.personaId) });
      toast.success(data.mensaje);
    },
    onError: (error: ApiClientError) => toast.error(error.message),
  });
}

export function useQuitarCodigoBiometrico() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (personaId: string) => quitarCodigoBiometrico(personaId),
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: biometricoKeys.codigo(data.personaId) });
      toast.success(data.mensaje);
    },
    onError: (error: ApiClientError) => toast.error(error.message),
  });
}

export function useGuardarConfigReloj() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ equipoId, ...payload }: GuardarConfigRelojPayload & { equipoId: string }) =>
      guardarConfigReloj(equipoId, payload),
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: biometricoKeys.estado() });
      toast.success(data.mensaje);
    },
    onError: (error: ApiClientError) => toast.error(error.message),
  });
}

/** Últimas órdenes a la app puente; consulta cada pocos segundos mientras haya alguna pendiente. */
export function useOrdenesReloj(equipoId: string) {
  return useQuery({
    queryKey: biometricoKeys.ordenes(equipoId),
    queryFn: () => getOrdenesReloj(equipoId),
    refetchInterval: (query) =>
      (query.state.data as OrdenApi[] | undefined)?.some((o) => o.estado === "pendiente")
        ? 3_000
        : false,
    retry: false,
  });
}

export function useCrearOrdenReloj() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ equipoId, tipo }: { equipoId: string; tipo: TipoOrdenApi }) =>
      crearOrdenReloj(equipoId, tipo),
    onSuccess: (_orden, { equipoId }) => {
      void queryClient.invalidateQueries({ queryKey: biometricoKeys.ordenes(equipoId) });
    },
    onError: (error: ApiClientError) => toast.error(error.message),
  });
}
