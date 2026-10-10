import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ApiClientError } from "@/lib/api-client";
import {
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
    refetchInterval: 30000, // Revalidación pasiva cada 30 segundos
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
