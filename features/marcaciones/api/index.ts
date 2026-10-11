import { apiClient } from "@/lib/api-client";
import type {
  JustificarMarcacionPayload,
  MarcacionApi,
  PanelMarcacionesHoy,
  RegistrarMarcacionManualPayload,
} from "../types";

export async function getPanelMarcacionesHoy(): Promise<PanelMarcacionesHoy> {
  const { data } = await apiClient.get<PanelMarcacionesHoy>("/marcaciones/hoy");
  return data;
}

export async function registrarMarcacionManual(
  payload: RegistrarMarcacionManualPayload,
): Promise<MarcacionApi> {
  const { data } = await apiClient.post<MarcacionApi>("/marcaciones/manual", payload);
  return data;
}

export async function justificarMarcacion(
  id: string,
  payload: JustificarMarcacionPayload,
): Promise<MarcacionApi> {
  const { data } = await apiClient.patch<MarcacionApi>(`/marcaciones/${id}/justificar`, payload);
  return data;
}
