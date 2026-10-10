import { apiClient } from "@/lib/api-client";
import type {
  CreateSeccionPayload,
  Seccion,
  SeccionQueryParams,
  UpdateSeccionPayload,
} from "../types";

export async function getSecciones(params?: SeccionQueryParams): Promise<Seccion[]> {
  const queryParams: Record<string, string> = {};
  if (params?.gradoId) {
    queryParams.gradoId = params.gradoId;
  }
  if (params?.estado) {
    queryParams.estado = params.estado;
  }

  const response = await apiClient.get<Seccion[]>("/secciones", {
    params: Object.keys(queryParams).length > 0 ? queryParams : undefined,
  });
  return response.data;
}

export async function getSeccionById(id: string): Promise<Seccion> {
  const response = await apiClient.get<Seccion>(`/secciones/${id}`);
  return response.data;
}

export async function createSeccion(payload: CreateSeccionPayload): Promise<Seccion> {
  const response = await apiClient.post<Seccion>("/secciones", payload);
  return response.data;
}

export async function updateSeccion(id: string, payload: UpdateSeccionPayload): Promise<Seccion> {
  const response = await apiClient.patch<Seccion>(`/secciones/${id}`, payload);
  return response.data;
}

export async function cerrarSeccion(id: string): Promise<Seccion> {
  const response = await apiClient.patch<Seccion>(`/secciones/${id}/cerrar`);
  return response.data;
}
