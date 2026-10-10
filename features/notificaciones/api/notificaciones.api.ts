import { apiClient } from "@/lib/api-client";
import type { NotificacionQueryParams, PaginatedNotificacionesResponse } from "../types";

export async function getNotificaciones(
  params?: NotificacionQueryParams,
): Promise<PaginatedNotificacionesResponse> {
  const queryParams: Record<string, string | number | boolean> = {};
  if (params?.cursor) queryParams.cursor = params.cursor;
  if (params?.soloNoLeidas) queryParams.soloNoLeidas = params.soloNoLeidas;
  if (params?.estado && params.estado !== "all") queryParams.estado = params.estado;
  if (params?.tipo && params.tipo !== "all") queryParams.tipo = params.tipo;
  if (params?.search?.trim()) queryParams.search = params.search.trim();
  if (params?.limit !== undefined) queryParams.limit = params.limit;

  const response = await apiClient.get<PaginatedNotificacionesResponse>("/notificaciones", {
    params: queryParams,
  });
  return response.data;
}

export async function getNotificacionesConteo(): Promise<{ unreadCount: number }> {
  const response = await apiClient.get<{ unreadCount: number }>("/notificaciones/conteo-no-leidas");
  return response.data;
}

export async function marcarNotificacionLeida(
  id: string,
): Promise<{ message: string; id: string }> {
  const response = await apiClient.patch<{ message: string; id: string }>(
    `/notificaciones/${id}/leer`,
  );
  return response.data;
}

export async function marcarTodasNotificacionesLeidas(): Promise<{
  message: string;
  actualizadas: number;
}> {
  const response = await apiClient.patch<{ message: string; actualizadas: number }>(
    "/notificaciones/leer-todas",
  );
  return response.data;
}

export async function eliminarNotificacion(id: string): Promise<{
  message: string;
  id: string;
}> {
  const response = await apiClient.delete<{ message: string; id: string }>(`/notificaciones/${id}`);
  return response.data;
}

export async function eliminarTodasLeidas(): Promise<{
  message: string;
  eliminadas: number;
}> {
  const response = await apiClient.delete<{ message: string; eliminadas: number }>(
    "/notificaciones/leidas/todas",
  );
  return response.data;
}
