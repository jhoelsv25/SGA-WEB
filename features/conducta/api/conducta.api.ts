import { apiClient } from "@/lib/api-client";
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

export async function getIncidencias(
  params?: QueryIncidenciasParams,
): Promise<PaginatedResponse<IncidenciaItem>> {
  const queryParams: Record<string, string | number | boolean> = {};
  if (params?.cursor) queryParams.cursor = params.cursor;
  if (params?.matriculaId) queryParams.matriculaId = params.matriculaId;
  if (params?.seccionId) queryParams.seccionId = params.seccionId;
  if (params?.periodoId) queryParams.periodoId = params.periodoId;
  if (params?.tipo && params.tipo !== "all") queryParams.tipo = params.tipo;
  if (params?.gravedad && params.gravedad !== "all") queryParams.gravedad = params.gravedad;
  if (params?.fechaDesde) queryParams.fechaDesde = params.fechaDesde;
  if (params?.fechaHasta) queryParams.fechaHasta = params.fechaHasta;
  if (params?.limit !== undefined) queryParams.limit = params.limit;

  const response = await apiClient.get<PaginatedResponse<IncidenciaItem>>("/conducta/incidencias", {
    params: queryParams,
  });
  return response.data;
}

export async function crearIncidencia(payload: CrearIncidenciaPayload): Promise<IncidenciaItem> {
  const response = await apiClient.post<IncidenciaItem>("/conducta/incidencias", payload);
  return response.data;
}

export async function actualizarIncidencia(
  id: string,
  payload: ActualizarIncidenciaPayload,
): Promise<IncidenciaItem> {
  const response = await apiClient.patch<IncidenciaItem>(`/conducta/incidencias/${id}`, payload);
  return response.data;
}

export async function anularIncidencia(
  id: string,
  payload: AnularIncidenciaPayload,
): Promise<{ mensaje: string }> {
  const response = await apiClient.post<{ mensaje: string }>(
    `/conducta/incidencias/${id}/anular`,
    payload,
  );
  return response.data;
}

export async function getObservaciones(
  params?: QueryObservacionesParams,
): Promise<PaginatedResponse<ObservacionItem>> {
  const queryParams: Record<string, string | number | boolean> = {};
  if (params?.cursor) queryParams.cursor = params.cursor;
  if (params?.matriculaId) queryParams.matriculaId = params.matriculaId;
  if (params?.seccionId) queryParams.seccionId = params.seccionId;
  if (params?.limit !== undefined) queryParams.limit = params.limit;

  const response = await apiClient.get<PaginatedResponse<ObservacionItem>>(
    "/conducta/observaciones",
    {
      params: queryParams,
    },
  );
  return response.data;
}

export async function getObservacionById(id: string): Promise<ObservacionItem> {
  const response = await apiClient.get<ObservacionItem>(`/conducta/observaciones/${id}`);
  return response.data;
}

export async function crearObservacion(payload: CrearObservacionPayload): Promise<ObservacionItem> {
  const response = await apiClient.post<ObservacionItem>("/conducta/observaciones", payload);
  return response.data;
}

export async function getResumenConducta(matriculaId: string): Promise<ResumenConductaEstudiante> {
  const response = await apiClient.get<ResumenConductaEstudiante>(
    `/conducta/resumen/estudiante/${matriculaId}`,
  );
  return response.data;
}
