import { apiClient } from "@/lib/api-client";
import type {
  BloqueMutacionResponse,
  BloquesLoteResponse,
  CargaSeccionHorarioResponse,
  CopiarHorarioResponse,
  CreateBloquePayload,
  CrearBloquesLotePayload,
  GrillaPropuestaResponse,
  HorarioSeccionResponse,
  PropuestaHorarioIaResponse,
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

function extraerNombreArchivo(
  headers: Record<string, unknown> | undefined,
  fallback: string,
): string {
  const disposicion = headers?.["content-disposition"];
  if (typeof disposicion !== "string") return fallback;
  const match = /filename="?([^";]+)"?/i.exec(disposicion);
  return match?.[1] ?? fallback;
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

export async function descargarHorariosConsolidadoPdf(params?: {
  gradoId?: string;
  seccionId?: string;
  docenteId?: string;
}): Promise<{ blob: Blob; nombreArchivo: string }> {
  const res = await apiClient.get<Blob>("/horarios/pdf", {
    params,
    responseType: "blob",
  });
  return {
    blob: res.data,
    nombreArchivo: extraerNombreArchivo(
      res.headers as Record<string, unknown>,
      "horarios-colegio.pdf",
    ),
  };
}

export async function descargarHorariosExcel(params?: {
  gradoId?: string;
  seccionId?: string;
}): Promise<{ blob: Blob; nombreArchivo: string }> {
  const res = await apiClient.get<Blob>("/exportacion/horarios", {
    params,
    responseType: "blob",
  });
  return {
    blob: res.data,
    nombreArchivo: extraerNombreArchivo(
      res.headers as Record<string, unknown>,
      "sga_horarios.xlsx",
    ),
  };
}

export function guardarBlobDescarga(blob: Blob, nombreArchivo: string): void {
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement("a");
  enlace.href = url;
  enlace.download = nombreArchivo;
  document.body.appendChild(enlace);
  enlace.click();
  enlace.remove();
  URL.revokeObjectURL(url);
}

export async function proponerHorarioIa(
  seccionId: string,
  payload: { horaEntrada?: string; preferencias?: string } = {},
): Promise<PropuestaHorarioIaResponse> {
  const { data } = await apiClient.post<PropuestaHorarioIaResponse>(
    `/horarios/seccion/${seccionId}/proponer-ia`,
    payload,
  );
  return data;
}

export async function crearBloquesLote(
  seccionId: string,
  payload: CrearBloquesLotePayload,
): Promise<BloquesLoteResponse> {
  const { data } = await apiClient.post<BloquesLoteResponse>(
    `/horarios/seccion/${seccionId}/bloques/lote`,
    payload,
  );
  return data;
}
