import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  archivarComunicado,
  createComunicado,
  getAvanceLectura,
  getComunicadoById,
  getComunicados,
  publicarComunicado,
} from "../api";
import type {
  AvanceLecturaResponse,
  ComunicadoItem,
  ComunicadoQueryParams,
  CrearComunicadoPayload,
  PaginatedComunicadosResponse,
} from "../types";

export const COMUNICADOS_QUERY_KEYS = {
  all: ["comunicados"] as const,
  lists: () => [...COMUNICADOS_QUERY_KEYS.all, "list"] as const,
  list: (params?: ComunicadoQueryParams) => [...COMUNICADOS_QUERY_KEYS.lists(), params] as const,
  details: () => [...COMUNICADOS_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...COMUNICADOS_QUERY_KEYS.details(), id] as const,
  avances: () => [...COMUNICADOS_QUERY_KEYS.all, "avance"] as const,
  avance: (id: string) => [...COMUNICADOS_QUERY_KEYS.avances(), id] as const,
};

export function useComunicadosQuery(params?: ComunicadoQueryParams) {
  return useQuery<PaginatedComunicadosResponse>({
    queryKey: COMUNICADOS_QUERY_KEYS.list(params),
    queryFn: () => getComunicados(params),
    staleTime: 10_000,
  });
}

export function useComunicadoQuery(id?: string, enabled = true) {
  return useQuery<ComunicadoItem>({
    queryKey: COMUNICADOS_QUERY_KEYS.detail(id ?? ""),
    queryFn: () => getComunicadoById(id!),
    enabled: Boolean(id && enabled),
    staleTime: 30_000,
  });
}

export function useAvanceLecturaQuery(id?: string, enabled = true) {
  return useQuery<AvanceLecturaResponse>({
    queryKey: COMUNICADOS_QUERY_KEYS.avance(id ?? ""),
    queryFn: () => getAvanceLectura(id!),
    enabled: Boolean(id && enabled),
    staleTime: 10_000,
  });
}

export function useCrearComunicadoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CrearComunicadoPayload) => createComunicado(payload),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: COMUNICADOS_QUERY_KEYS.all });
      toast.success(res.message);
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      const mensaje =
        err?.response?.data?.message || "Ocurrió un error al registrar el comunicado.";
      toast.error(mensaje);
    },
  });
}

export function usePublicarComunicadoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => publicarComunicado(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: COMUNICADOS_QUERY_KEYS.all });
      toast.success(res.message);
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      const mensaje = err?.response?.data?.message || "Ocurrió un error al publicar el comunicado.";
      toast.error(mensaje);
    },
  });
}

export function useArchivarComunicadoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => archivarComunicado(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: COMUNICADOS_QUERY_KEYS.all });
      toast.success(res.message);
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      const mensaje = err?.response?.data?.message || "Ocurrió un error al archivar el comunicado.";
      toast.error(mensaje);
    },
  });
}
