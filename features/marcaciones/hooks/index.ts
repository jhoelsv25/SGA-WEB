"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAnioLectivo } from "@/features/anio-escolar/anio-lectivo-context";
import { useSession } from "@/features/auth";
import { ApiClientError } from "@/lib/api-client";
import { toast } from "@/lib/toast";
import {
  getControlDiario,
  getControlMensual,
  getPanelMarcacionesHoy,
  justificarMarcacion,
  registrarMarcacionManual,
} from "../api";
import { INTERVALO_PANEL_MS } from "../consts";
import type { JustificarMarcacionPayload, RegistrarMarcacionManualPayload } from "../types";

export const marcacionesKeys = {
  all: ["marcaciones"] as const,
  panel: (anioId?: string) => [...marcacionesKeys.all, "panel-hoy", anioId ?? "vigente"] as const,
};

export function usePanelMarcacionesHoy() {
  const { anio } = useAnioLectivo();
  return useQuery({
    queryKey: marcacionesKeys.panel(anio?.id),
    queryFn: getPanelMarcacionesHoy,
    refetchInterval: INTERVALO_PANEL_MS,
    refetchIntervalInBackground: false,
    staleTime: 10_000,
    gcTime: 5 * 60_000,
  });
}

/** Personal de un día. Solo el día de hoy se actualiza solo. */
export function useControlDiario(fecha: string, esHoy: boolean) {
  return useQuery({
    queryKey: [...marcacionesKeys.all, "control-diario", fecha] as const,
    queryFn: () => getControlDiario(fecha),
    refetchInterval: esHoy ? INTERVALO_PANEL_MS : false,
    refetchIntervalInBackground: false,
    staleTime: 10_000,
  });
}

export function useControlMensual(personaId: string | null, mes: string) {
  return useQuery({
    queryKey: [...marcacionesKeys.all, "control-mensual", personaId, mes] as const,
    queryFn: () => getControlMensual(personaId!, mes),
    enabled: personaId !== null,
    staleTime: 30_000,
  });
}

/** Justifica una tardanza o salida anticipada (Director, Subdirector, Secretaria). */
export function useJustificarMarcacion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: JustificarMarcacionPayload & { id: string }) =>
      justificarMarcacion(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: marcacionesKeys.all });
      toast.success("La marcación quedó justificada.");
    },
    onError: (error: ApiClientError) => toast.error(error.message),
  });
}

export function useRegistrarMarcacionManual() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: RegistrarMarcacionManualPayload) => registrarMarcacionManual(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: marcacionesKeys.all });
      toast.success("Marcación manual registrada.");
    },
    onError: (error: ApiClientError) => toast.error(error.message),
  });
}

export function usePuedeJustificarMarcaciones(): boolean {
  const { data } = useSession();
  const rol = data?.user.activeRoleName ?? "";
  return (
    rol === "Administrador" || rol === "Director" || rol === "Subdirector" || rol === "Secretaria"
  );
}
