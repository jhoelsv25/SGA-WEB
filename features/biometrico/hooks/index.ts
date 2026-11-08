"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiClientError } from "@/lib/api-client";
import { toast } from "@/lib/toast";
import {
  asignarCodigoBiometrico,
  getCodigoBiometrico,
  getProgramacionBiometrico,
  getSincronizacionesReloj,
  guardarProgramacionBiometrico,
  quitarCodigoBiometrico,
} from "../api";
import type { HoraProgramada } from "../types";

export const biometricoKeys = {
  all: ["biometrico"] as const,
  programacion: () => [...biometricoKeys.all, "programacion"] as const,
  sincronizaciones: () => [...biometricoKeys.all, "sincronizaciones"] as const,
  codigo: (personaId: string) => [...biometricoKeys.all, "codigo", personaId] as const,
};

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

export function useProgramacionBiometrico() {
  return useQuery({
    queryKey: biometricoKeys.programacion(),
    queryFn: getProgramacionBiometrico,
    staleTime: 0,
  });
}

export function useSincronizacionesReloj() {
  return useQuery({
    queryKey: biometricoKeys.sincronizaciones(),
    queryFn: getSincronizacionesReloj,
    staleTime: 1000 * 30,
  });
}

export function useGuardarProgramacionBiometrico() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (horarios: HoraProgramada[]) => guardarProgramacionBiometrico(horarios),
    onSuccess: (data) => {
      queryClient.setQueryData(biometricoKeys.programacion(), data);
      toast.success(data.mensaje);
    },
    onError: (error: ApiClientError) => toast.error(error.message),
  });
}
