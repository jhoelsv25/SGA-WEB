import { apiClient, handleApiError } from "@/lib/api-client";
import { COMUNICADOS_ENDPOINTS } from "../constants";
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
  try {
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

    const response = await apiClient.get<PaginatedComunicadosResponse>(COMUNICADOS_ENDPOINTS.BASE, {
      params: queryParams,
    });
    return response.data;
  } catch (error) {
    handleApiError(error, "Error al obtener la lista de comunicados.");
  }
}

export async function getComunicadoById(id: string): Promise<ComunicadoItem> {
  try {
    const response = await apiClient.get<ComunicadoItem>(COMUNICADOS_ENDPOINTS.POR_ID(id));
    return response.data;
  } catch (error) {
    handleApiError(error, "Error al cargar el detalle del comunicado.");
  }
}

export async function createComunicado(
  payload: CrearComunicadoPayload,
): Promise<{ id: string; message: string }> {
  try {
    const response = await apiClient.post<{ id: string; message: string }>(
      COMUNICADOS_ENDPOINTS.BASE,
      payload,
    );
    return response.data;
  } catch (error) {
    handleApiError(error, "Error al crear el comunicado.");
  }
}

export async function publicarComunicado(id: string): Promise<{ id: string; message: string }> {
  try {
    const response = await apiClient.post<{ id: string; message: string }>(
      COMUNICADOS_ENDPOINTS.PUBLICAR(id),
    );
    return response.data;
  } catch (error) {
    handleApiError(error, "Error al publicar el comunicado.");
  }
}

export async function archivarComunicado(id: string): Promise<{ id: string; message: string }> {
  try {
    const response = await apiClient.post<{ id: string; message: string }>(
      COMUNICADOS_ENDPOINTS.ARCHIVAR(id),
    );
    return response.data;
  } catch (error) {
    handleApiError(error, "Error al archivar el comunicado.");
  }
}

export async function registrarLecturaComunicado(
  id: string,
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await apiClient.post<{ success: boolean; message: string }>(
      COMUNICADOS_ENDPOINTS.LECTURA(id),
    );
    return response.data;
  } catch (error) {
    handleApiError(error, "Error al registrar la lectura del comunicado.");
  }
}

export async function getAvanceLectura(id: string): Promise<AvanceLecturaResponse> {
  try {
    const response = await apiClient.get<AvanceLecturaResponse>(
      COMUNICADOS_ENDPOINTS.AVANCE_LECTURA(id),
    );
    return response.data;
  } catch (error) {
    handleApiError(error, "Error al consultar el avance de lectura del comunicado.");
  }
}
