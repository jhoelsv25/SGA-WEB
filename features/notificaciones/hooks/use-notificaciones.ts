"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { API_BASE_URL, ApiClientError } from "@/lib/api-client";
import {
  eliminarNotificacion,
  eliminarTodasLeidas,
  getNotificaciones,
  getNotificacionesConteo,
  marcarNotificacionLeida,
  marcarTodasNotificacionesLeidas,
} from "../api";
import type { NotificacionQueryParams, PaginatedNotificacionesResponse } from "../types";

export const NOTIFICACIONES_QUERY_KEY = ["notificaciones"] as const;
export const NOTIFICACIONES_CONTEO_KEY = ["notificaciones", "conteo"] as const;

export function useNotificacionesQuery(params: NotificacionQueryParams = {}) {
  return useQuery<PaginatedNotificacionesResponse, ApiClientError>({
    queryKey: [...NOTIFICACIONES_QUERY_KEY, params],
    queryFn: () => getNotificaciones(params),
  });
}

export function useNotificacionesConteoQuery() {
  return useQuery<{ unreadCount: number }, ApiClientError>({
    queryKey: NOTIFICACIONES_CONTEO_KEY,
    queryFn: getNotificacionesConteo,
    staleTime: 1000 * 60 * 5, // 5 minutos de frescura
    refetchOnWindowFocus: false, // La invalidación se realiza en tiempo real mediante SSE
  });
}

export function useMarcarNotificacionLeidaMutation() {
  const queryClient = useQueryClient();

  return useMutation<{ message: string; id: string }, ApiClientError, string>({
    mutationFn: (id) => marcarNotificacionLeida(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICACIONES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: NOTIFICACIONES_CONTEO_KEY });
    },
    onError: (error) => {
      toast.error(error.message || "Error al actualizar notificación.");
    },
  });
}

export function useMarcarTodasLeidasMutation() {
  const queryClient = useQueryClient();

  return useMutation<{ message: string; actualizadas: number }, ApiClientError, void>({
    mutationFn: () => marcarTodasNotificacionesLeidas(),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: NOTIFICACIONES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: NOTIFICACIONES_CONTEO_KEY });
      toast.success(data.message || "Todas las notificaciones marcadas como leídas.");
    },
    onError: (error) => {
      toast.error(error.message || "Error al marcar notificaciones.");
    },
  });
}

export function useEliminarNotificacionMutation() {
  const queryClient = useQueryClient();

  return useMutation<{ message: string; id: string }, ApiClientError, string>({
    mutationFn: (id) => eliminarNotificacion(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: NOTIFICACIONES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: NOTIFICACIONES_CONTEO_KEY });
      toast.success(data.message || "Notificación eliminada.");
    },
    onError: (error) => {
      toast.error(error.message || "Error al eliminar la notificación.");
    },
  });
}

export function useEliminarTodasLeidasMutation() {
  const queryClient = useQueryClient();

  return useMutation<{ message: string; eliminadas: number }, ApiClientError, void>({
    mutationFn: () => eliminarTodasLeidas(),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: NOTIFICACIONES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: NOTIFICACIONES_CONTEO_KEY });
      toast.success(data.message || "Notificaciones leídas eliminadas.");
    },
    onError: (error) => {
      toast.error(error.message || "Error al eliminar las notificaciones leídas.");
    },
  });
}

export function useNotificacionesRealtime() {
  const queryClient = useQueryClient();
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const streamUrl = `${API_BASE_URL}/notificaciones/stream`;
    let eventSource: EventSource | null = null;

    try {
      eventSource = new EventSource(streamUrl, { withCredentials: true });

      eventSource.addEventListener("notificacion", (event) => {
        try {
          const item = JSON.parse(event.data);
          queryClient.invalidateQueries({ queryKey: NOTIFICACIONES_QUERY_KEY });
          queryClient.invalidateQueries({ queryKey: NOTIFICACIONES_CONTEO_KEY });

          toast(item.titulo || "Nueva notificación", {
            description: item.mensaje,
            action: item.enlaceUrl
              ? {
                  label: "Ver",
                  onClick: () => router.push(item.enlaceUrl),
                }
              : undefined,
          });
        } catch {
          // ignore parsing error
        }
      });
    } catch {
      // ignore
    }

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [queryClient, router]);
}
