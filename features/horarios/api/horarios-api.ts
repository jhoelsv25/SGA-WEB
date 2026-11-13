import { apiClient } from "@/lib/api-client";
import type {
  BloqueMutacionResponse,
  CargaSeccionHorarioResponse,
  CopiarHorarioResponse,
  CreateBloquePayload,
  GrillaPropuestaResponse,
  HorarioSeccionResponse,
  SeccionHorarioItem,
  UpdateBloquePayload,
} from "../types";

export async function getHorarioSeccion(seccionId: string): Promise<HorarioSeccionResponse> {
  const { data } = await apiClient.get<HorarioSeccionResponse>(`/horarios/seccion/${seccionId}`);
  return data;
}

export async function getGrillaPropuesta(
  seccionId: string,
  horaEntrada?: string,
): Promise<GrillaPropuestaResponse> {
  const query = horaEntrada ? `?horaEntrada=${encodeURIComponent(horaEntrada)}` : "";
  const { data } = await apiClient.get<GrillaPropuestaResponse>(
    `/horarios/seccion/${seccionId}/grilla${query}`,
  );
  return data;
}

export async function createBloque(
  seccionId: string,
  payload: CreateBloquePayload,
): Promise<BloqueMutacionResponse> {
  const { data } = await apiClient.post<BloqueMutacionResponse>(
    `/horarios/seccion/${seccionId}/bloques`,
    payload,
  );
  return data;
}

export async function updateBloque(
  id: string,
  payload: UpdateBloquePayload,
): Promise<BloqueMutacionResponse> {
  const { data } = await apiClient.patch<BloqueMutacionResponse>(
    `/horarios/bloques/${id}`,
    payload,
  );
  return data;
}

export async function deleteBloque(id: string): Promise<void> {
  await apiClient.delete(`/horarios/bloques/${id}`);
}

export async function copiarHorario(
  destinoId: string,
  origenId: string,
): Promise<CopiarHorarioResponse> {
  const { data } = await apiClient.post<CopiarHorarioResponse>(
    `/horarios/seccion/${destinoId}/copiar-de/${origenId}`,
  );
  return data;
}

export async function getSeccionesPorGrado(gradoId: string): Promise<SeccionHorarioItem[]> {
  const { data } = await apiClient.get<SeccionHorarioItem[]>(
    `/secciones?gradoId=${encodeURIComponent(gradoId)}`,
  );
  return data;
}

export async function getCargaSeccion(seccionId: string): Promise<CargaSeccionHorarioResponse> {
  const { data } = await apiClient.get<CargaSeccionHorarioResponse>(
    `/secciones/${seccionId}/carga`,
  );
  return data;
}

export async function descargarHorarioSeccionPdf(
  seccionId: string,
  docenteId?: string,
): Promise<Blob> {
  const { data } = await apiClient.get<Blob>(`/horarios/seccion/${seccionId}/pdf`, {
    params: docenteId ? { docenteId } : undefined,
    responseType: "blob",
  });
  return data;
}
