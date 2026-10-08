import { apiClient } from "@/lib/api-client";
import type { CalendarioConsulta, EventoCalendario, GuardarEventoPayload } from "../types";

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
