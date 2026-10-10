import { apiClient } from "@/lib/api-client";
import type {
  CambiarSeccionPayload,
  CrearMatriculaPayload,
  CrearMatriculaResponse,
  MatriculaItem,
  MatriculaMasivaPayload,
  MatriculaMasivaResponse,
  MatriculaQueryParams,
  RetirarMatriculaPayload,
  TrasladarMatriculaPayload,
} from "../types";

export async function getMatriculas(
  params?: MatriculaQueryParams,
): Promise<{ items: MatriculaItem[]; total: number }> {
  const queryParams: Record<string, string | number> = {};
  if (params?.anioAcademicoId) queryParams.anioAcademicoId = params.anioAcademicoId;
  if (params?.gradoId) queryParams.gradoId = params.gradoId;
  if (params?.seccionId) queryParams.seccionId = params.seccionId;
  if (params?.tipo) queryParams.tipo = params.tipo;
  if (params?.estado) queryParams.estado = params.estado;
  if (params?.search) queryParams.search = params.search;
  if (params?.limit !== undefined) queryParams.limit = params.limit;
  if (params?.offset !== undefined) queryParams.offset = params.offset;

  const response = await apiClient.get<{ items: MatriculaItem[]; total: number }>("/matriculas", {
    params: queryParams,
  });
  return response.data;
}

export async function getMatriculaById(id: string): Promise<MatriculaItem> {
  const response = await apiClient.get<MatriculaItem>(`/matriculas/${id}`);
  return response.data;
}

export async function crearMatricula(
  payload: CrearMatriculaPayload,
): Promise<CrearMatriculaResponse> {
  const response = await apiClient.post<CrearMatriculaResponse>("/matriculas", payload);
  return response.data;
}

export async function matricularMasivo(
  payload: MatriculaMasivaPayload,
): Promise<MatriculaMasivaResponse> {
  const response = await apiClient.post<MatriculaMasivaResponse>("/matriculas/masiva", payload);
  return response.data;
}

export async function retirarMatricula(
  id: string,
  payload: RetirarMatriculaPayload,
): Promise<MatriculaItem> {
  const response = await apiClient.post<MatriculaItem>(`/matriculas/${id}/retirar`, payload);
  return response.data;
}

export async function trasladarMatricula(
  id: string,
  payload: TrasladarMatriculaPayload,
): Promise<MatriculaItem> {
  const response = await apiClient.post<MatriculaItem>(`/matriculas/${id}/trasladar`, payload);
  return response.data;
}

export async function cambiarSeccionMatricula(
  id: string,
  payload: CambiarSeccionPayload,
): Promise<MatriculaItem> {
  const response = await apiClient.put<MatriculaItem>(`/matriculas/${id}/cambiar-seccion`, payload);
  return response.data;
}

export async function anularMatricula(id: string): Promise<{ message: string }> {
  const response = await apiClient.delete<{ message: string }>(`/matriculas/${id}`);
  return response.data;
}

export async function descargarConstanciaPdf(id: string, codigo: string): Promise<void> {
  const response = await apiClient.get(`/matriculas/${id}/constancia`, {
    responseType: "blob",
  });
  const blob = new Blob([response.data], { type: "application/pdf" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `constancia-matricula-${codigo}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
