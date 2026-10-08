import { apiClient } from "@/lib/api-client";
import type {
  AnioAcademico,
  Bimestre,
  BimestreFechaInput,
  CalendarioConsulta,
  CreateAnioPayload,
  EventoCalendario,
  GuardarEventoPayload,
  ReabrirAnioPayload,
  UpdateAnioPayload,
} from "../types";

export async function getAnios(): Promise<AnioAcademico[]> {
  const response = await apiClient.get<AnioAcademico[]>("/anios-academicos");
  return response.data ?? [];
}

export async function getAnioEnCurso(): Promise<AnioAcademico> {
  const response = await apiClient.get<AnioAcademico>("/anios-academicos/en-curso");
  return response.data;
}

export async function createAnio(payload: CreateAnioPayload): Promise<AnioAcademico> {
  const response = await apiClient.post<AnioAcademico>("/anios-academicos", {
    anio: payload.anio,
    nombre: payload.nombre?.trim() || undefined,
    fechaInicio: payload.fechaInicio,
    fechaFin: payload.fechaFin,
    bimestres: payload.bimestres,
  });
  return response.data;
}

export async function updateAnio(id: string, payload: UpdateAnioPayload): Promise<AnioAcademico> {
  const response = await apiClient.patch<AnioAcademico>(`/anios-academicos/${id}`, payload);
  return response.data;
}

export async function guardarBimestres(
  id: string,
  bimestres: BimestreFechaInput[],
): Promise<AnioAcademico> {
  const response = await apiClient.put<AnioAcademico>(`/anios-academicos/${id}/bimestres`, {
    bimestres,
  });
  return response.data;
}

export async function iniciarAnio(id: string): Promise<AnioAcademico> {
  const response = await apiClient.post<AnioAcademico>(`/anios-academicos/${id}/iniciar`);
  return response.data;
}

export async function cerrarAnio(id: string): Promise<AnioAcademico> {
  const response = await apiClient.post<AnioAcademico>(`/anios-academicos/${id}/cerrar`);
  return response.data;
}

export async function reabrirAnio(id: string, payload: ReabrirAnioPayload): Promise<AnioAcademico> {
  const response = await apiClient.post<AnioAcademico>(`/anios-academicos/${id}/reabrir`, payload);
  return response.data;
}

export async function iniciarBimestre(anioId: string, bimestreId: string): Promise<Bimestre> {
  const response = await apiClient.post<Bimestre>(
    `/anios-academicos/${anioId}/bimestres/${bimestreId}/iniciar`,
  );
  return response.data;
}

export async function cerrarBimestre(anioId: string, bimestreId: string): Promise<Bimestre> {
  const response = await apiClient.post<Bimestre>(
    `/anios-academicos/${anioId}/bimestres/${bimestreId}/cerrar`,
  );
  return response.data;
}

export async function getCalendario(mes?: number, anio?: number): Promise<CalendarioConsulta> {
  const response = await apiClient.get<CalendarioConsulta>("/calendario", {
    params: {
      ...(mes ? { mes } : {}),
      ...(anio ? { anio } : {}),
    },
  });
  return response.data;
}

export async function createEvento(payload: GuardarEventoPayload): Promise<EventoCalendario> {
  const response = await apiClient.post<EventoCalendario>("/calendario", payload);
  return response.data;
}

export async function updateEvento(
  id: string,
  payload: Partial<GuardarEventoPayload>,
): Promise<EventoCalendario> {
  const response = await apiClient.patch<EventoCalendario>(`/calendario/${id}`, payload);
  return response.data;
}

export async function deleteEvento(id: string): Promise<void> {
  await apiClient.delete(`/calendario/${id}`);
}
