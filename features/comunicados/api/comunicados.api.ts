import { apiClient } from "@/lib/api-client";
import type {
  AvanceLecturaResponse,
  ComunicadoItem,
  ComunicadoQueryParams,
  CrearComunicadoPayload,
  PaginatedComunicadosResponse,
} from "../types";

export async function getComunicados(
  params?: ComunicadoQueryParams,
): Promise<PaginatedComunicadosResponse> {
  const queryParams: Record<string, string | number | boolean> = {};
  if (params?.cursor) queryParams.cursor = params.cursor;
  if (params?.soloMios) queryParams.soloMios = params.soloMios;
  if (params?.estado && params.estado !== "all") queryParams.estado = params.estado;
  if (params?.dirigidoA && params.dirigidoA !== "all") queryParams.dirigidoA = params.dirigidoA;
  if (params?.prioridad && params.prioridad !== "all") queryParams.prioridad = params.prioridad;
  if (params?.gradoId) queryParams.gradoId = params.gradoId;
  if (params?.seccionId) queryParams.seccionId = params.seccionId;
  if (params?.search?.trim()) queryParams.search = params.search.trim();
  if (params?.limit !== undefined) queryParams.limit = params.limit;

  const response = await apiClient.get<PaginatedComunicadosResponse>("/comunicados", {
    params: queryParams,
  });
  return response.data;
}

export async function getComunicadoById(id: string): Promise<ComunicadoItem> {
  const response = await apiClient.get<ComunicadoItem>(`/comunicados/${id}`);
  return response.data;
}

export async function createComunicado(
  payload: CrearComunicadoPayload,
): Promise<{ id: string; message: string }> {
  const response = await apiClient.post<{ id: string; message: string }>("/comunicados", payload);
  return response.data;
}

export async function publicarComunicado(id: string): Promise<{ id: string; message: string }> {
  const response = await apiClient.post<{ id: string; message: string }>(
    `/comunicados/${id}/publicar`,
  );
  return response.data;
}

export async function archivarComunicado(id: string): Promise<{ id: string; message: string }> {
  const response = await apiClient.post<{ id: string; message: string }>(
    `/comunicados/${id}/archivar`,
  );
  return response.data;
}

export async function getAvanceLectura(id: string): Promise<AvanceLecturaResponse> {
  const response = await apiClient.get<AvanceLecturaResponse>(`/comunicados/${id}/avance`);
  return response.data;
}
