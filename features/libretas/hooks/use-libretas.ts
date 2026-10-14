import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ApiClientError } from "@/lib/api-client";
import {
  abrirLibreta,
  cambiarAlcanceLibretas,
  cambiarFechaLibretas,
  getAlcancesLibretas,
  getContextoLibretas,
  getDetalleLibretas,
  getHistorialLibreta,
  getMisLibretas,
  getSeguimientoLibretas,
  programarLibretas,
  publicarLibretas,
  vistaPreviaLibretas,
} from "../api";
import type { AlcanceLibreta, AsignacionManual } from "../types";

export const LIBRETAS_QUERY_KEYS = {
  all: ["libretas"] as const,
  contexto: () => [...LIBRETAS_QUERY_KEYS.all, "contexto"] as const,
  alcances: () => [...LIBRETAS_QUERY_KEYS.all, "alcances"] as const,
  seguimiento: (periodoId: string) =>
    [...LIBRETAS_QUERY_KEYS.all, "seguimiento", periodoId] as const,
  detalle: (seccionId: string, periodoId: string) =>
    [...LIBRETAS_QUERY_KEYS.all, "detalle", seccionId, periodoId] as const,
  mias: () => [...LIBRETAS_QUERY_KEYS.all, "mias"] as const,
  historial: (id: string) => [...LIBRETAS_QUERY_KEYS.all, "historial", id] as const,
};

function mensajeError(error: ApiClientError, respaldo: string): string {
  return error.message || respaldo;
}

export function useContextoLibretasQuery() {
  return useQuery({
    queryKey: LIBRETAS_QUERY_KEYS.contexto(),
    queryFn: getContextoLibretas,
    staleTime: 15_000,
  });
}

export function useAlcancesLibretasQuery(enabled: boolean) {
  return useQuery({
    queryKey: LIBRETAS_QUERY_KEYS.alcances(),
    queryFn: getAlcancesLibretas,
    enabled,
    staleTime: 30_000,
  });
}

export function useSeguimientoLibretasQuery(periodoId?: string) {
  return useQuery({
    queryKey: LIBRETAS_QUERY_KEYS.seguimiento(periodoId ?? ""),
    queryFn: () => getSeguimientoLibretas(periodoId!),
    enabled: Boolean(periodoId),
    staleTime: 10_000,
  });
}

export function useDetalleLibretasQuery(seccionId?: string, periodoId?: string) {
  return useQuery({
    queryKey: LIBRETAS_QUERY_KEYS.detalle(seccionId ?? "", periodoId ?? ""),
    queryFn: () => getDetalleLibretas(seccionId!, periodoId!),
    enabled: Boolean(seccionId && periodoId),
    staleTime: 10_000,
  });
}

export function useMisLibretasQuery() {
  return useQuery({
    queryKey: LIBRETAS_QUERY_KEYS.mias(),
    queryFn: getMisLibretas,
    staleTime: 10_000,
  });
}

export function useHistorialLibretaQuery(id?: string) {
  return useQuery({
    queryKey: LIBRETAS_QUERY_KEYS.historial(id ?? ""),
    queryFn: () => getHistorialLibreta(id!),
    enabled: Boolean(id),
    staleTime: 10_000,
  });
}

export function useProgramarLibretasMutation(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ periodoId, fechaLimite }: { periodoId: string; fechaLimite: string }) =>
      programarLibretas(periodoId, fechaLimite),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: LIBRETAS_QUERY_KEYS.all });
      toast.success(data.mensaje);
      onSuccess?.();
    },
    onError: (error: ApiClientError) => {
      toast.error(mensajeError(error, "No se pudieron programar las libretas."));
    },
  });
}

export function useCambiarFechaLibretasMutation(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ periodoId, fechaLimite }: { periodoId: string; fechaLimite: string }) =>
      cambiarFechaLibretas(periodoId, fechaLimite),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: LIBRETAS_QUERY_KEYS.all });
      toast.success(`Se actualizó la fecha límite de ${data.actualizadas} libretas pendientes.`);
      onSuccess?.();
    },
    onError: (error: ApiClientError) => {
      toast.error(mensajeError(error, "No se pudo cambiar la fecha límite."));
    },
  });
}

export function useVistaPreviaLibretasMutation() {
  return useMutation({
    mutationFn: ({
      seccionId,
      periodoId,
      archivos,
    }: {
      seccionId: string;
      periodoId: string;
      archivos: File[];
    }) => vistaPreviaLibretas(seccionId, periodoId, archivos),
    onError: (error: ApiClientError) => {
      toast.error(mensajeError(error, "No se pudo revisar la carga."));
    },
  });
}

export function usePublicarLibretasMutation(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      seccionId: string;
      periodoId: string;
      archivos: File[];
      asignaciones: AsignacionManual[];
    }) =>
      publicarLibretas(
        payload.seccionId,
        payload.periodoId,
        payload.archivos,
        payload.asignaciones,
      ),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: LIBRETAS_QUERY_KEYS.all });
      toast.success(data.mensaje);
      onSuccess?.();
    },
    onError: (error: ApiClientError) => {
      toast.error(mensajeError(error, "No se pudieron publicar las libretas."));
    },
  });
}

export function useCambiarAlcanceLibretasMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ rolId, alcance }: { rolId: string; alcance: AlcanceLibreta }) =>
      cambiarAlcanceLibretas(rolId, alcance),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LIBRETAS_QUERY_KEYS.all });
      toast.success("Se guardó el alcance de carga de libretas.");
    },
    onError: (error: ApiClientError) => {
      toast.error(mensajeError(error, "No se pudo cambiar el alcance."));
    },
  });
}

export function useAbrirLibretaMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => abrirLibreta(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LIBRETAS_QUERY_KEYS.mias() });
      queryClient.invalidateQueries({ queryKey: LIBRETAS_QUERY_KEYS.all });
    },
    onError: (error: ApiClientError) => {
      toast.error(mensajeError(error, "No se pudo abrir la libreta."));
    },
  });
}
