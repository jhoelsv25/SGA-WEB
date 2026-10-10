import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ApiClientError } from "@/lib/api-client";
import {
  actualizarIncidencia,
  anularIncidencia,
  crearIncidencia,
  crearObservacion,
  getIncidencias,
  getObservacionById,
  getObservaciones,
  getResumenConducta,
} from "../api";
import type {
  ActualizarIncidenciaPayload,
  AnularIncidenciaPayload,
  CrearIncidenciaPayload,
  CrearObservacionPayload,
  IncidenciaItem,
  ObservacionItem,
  PaginatedResponse,
  QueryIncidenciasParams,
  QueryObservacionesParams,
  ResumenConductaEstudiante,
} from "../types";

export const CONDUCTA_QUERY_KEYS = {
  all: ["conducta"] as const,
  incidencias: () => [...CONDUCTA_QUERY_KEYS.all, "incidencias"] as const,
  incidenciasList: (params?: QueryIncidenciasParams) =>
    [...CONDUCTA_QUERY_KEYS.incidencias(), params] as const,
  observaciones: () => [...CONDUCTA_QUERY_KEYS.all, "observaciones"] as const,
  observacionesList: (params?: QueryObservacionesParams) =>
    [...CONDUCTA_QUERY_KEYS.observaciones(), params] as const,
  observacionDetail: (id: string) => [...CONDUCTA_QUERY_KEYS.observaciones(), id] as const,
  resumenes: () => [...CONDUCTA_QUERY_KEYS.all, "resumen"] as const,
  resumen: (matriculaId: string) => [...CONDUCTA_QUERY_KEYS.resumenes(), matriculaId] as const,
};

export function useIncidenciasQuery(params?: QueryIncidenciasParams) {
  return useQuery<PaginatedResponse<IncidenciaItem>>({
    queryKey: CONDUCTA_QUERY_KEYS.incidenciasList(params),
    queryFn: () => getIncidencias(params),
    staleTime: 10_000,
  });
}

export function useObservacionesQuery(params?: QueryObservacionesParams) {
  return useQuery<PaginatedResponse<ObservacionItem>>({
    queryKey: CONDUCTA_QUERY_KEYS.observacionesList(params),
    queryFn: () => getObservaciones(params),
    staleTime: 10_000,
  });
}

export function useObservacionDetailQuery(id?: string, enabled = true) {
  return useQuery<ObservacionItem>({
    queryKey: CONDUCTA_QUERY_KEYS.observacionDetail(id ?? ""),
    queryFn: () => getObservacionById(id!),
    enabled: Boolean(id && enabled),
    staleTime: 30_000,
  });
}

export function useResumenConductaQuery(matriculaId?: string, enabled = true) {
  return useQuery<ResumenConductaEstudiante>({
    queryKey: CONDUCTA_QUERY_KEYS.resumen(matriculaId ?? ""),
    queryFn: () => getResumenConducta(matriculaId!),
    enabled: Boolean(matriculaId && enabled),
    staleTime: 30_000,
  });
}

export function useCrearIncidenciaMutation(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  return useMutation<IncidenciaItem, ApiClientError, CrearIncidenciaPayload>({
    mutationFn: (payload) => crearIncidencia(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: CONDUCTA_QUERY_KEYS.incidencias() });
      queryClient.invalidateQueries({ queryKey: CONDUCTA_QUERY_KEYS.resumenes() });
      queryClient.invalidateQueries({ queryKey: ["notificaciones"] });
      const tipoLabel = data.tipo === "merito" ? "Mérito" : "Falta";
      toast.success(`${tipoLabel} registrado con éxito. Se notificó al apoderado.`);
      options?.onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || "Error al registrar la incidencia de conducta.");
    },
  });
}

export function useActualizarIncidenciaMutation(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  return useMutation<
    IncidenciaItem,
    ApiClientError,
    { id: string; payload: ActualizarIncidenciaPayload }
  >({
    mutationFn: ({ id, payload }) => actualizarIncidencia(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONDUCTA_QUERY_KEYS.incidencias() });
      queryClient.invalidateQueries({ queryKey: CONDUCTA_QUERY_KEYS.resumenes() });
      toast.success("Incidencia corregida exitosamente dentro del plazo permitido.");
      options?.onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || "Error al actualizar la incidencia.");
    },
  });
}

export function useAnularIncidenciaMutation(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  return useMutation<
    { mensaje: string },
    ApiClientError,
    { id: string; payload: AnularIncidenciaPayload }
  >({
    mutationFn: ({ id, payload }) => anularIncidencia(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONDUCTA_QUERY_KEYS.incidencias() });
      queryClient.invalidateQueries({ queryKey: CONDUCTA_QUERY_KEYS.resumenes() });
      toast.success("Incidencia anulada y registrada en auditoría.");
      options?.onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || "Error al anular la incidencia.");
    },
  });
}

export function useCrearObservacionMutation(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  return useMutation<ObservacionItem, ApiClientError, CrearObservacionPayload>({
    mutationFn: (payload) => crearObservacion(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONDUCTA_QUERY_KEYS.observaciones() });
      queryClient.invalidateQueries({ queryKey: CONDUCTA_QUERY_KEYS.resumenes() });
      toast.success("Observación formativa guardada exitosamente.");
      options?.onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || "Error al registrar la observación.");
    },
  });
}
