import { apiClient } from "@/lib/api-client";
import { HEADER_ANIO_ACADEMICO } from "@/features/anio-escolar/anio-lectivo-activo";
import type {
  ClonarSeccionesPayload,
  ClonarSeccionesResultado,
  CreateSeccionPayload,
  Seccion,
  SeccionQueryParams,
  UpdateSeccionPayload,
} from "../types";

export async function getSecciones(
  params?: SeccionQueryParams,
  anioAcademicoId?: string,
): Promise<Seccion[]> {
  const queryParams: Record<string, string> = {};
  if (params?.gradoId) {
    queryParams.gradoId = params.gradoId;
  }
  if (params?.estado) {
    queryParams.estado = params.estado;
  }

  const response = await apiClient.get<Seccion[]>("/secciones", {
    params: Object.keys(queryParams).length > 0 ? queryParams : undefined,
    headers: anioAcademicoId ? { [HEADER_ANIO_ACADEMICO]: anioAcademicoId } : undefined,
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

export async function clonarSecciones(
  payload: ClonarSeccionesPayload,
  anioDestinoId?: string,
): Promise<ClonarSeccionesResultado> {
  const response = await apiClient.post<ClonarSeccionesResultado>("/secciones/clonar", payload, {
    headers: anioDestinoId ? { [HEADER_ANIO_ACADEMICO]: anioDestinoId } : undefined,
  });
  return response.data;
}
