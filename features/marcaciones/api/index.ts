import { apiClient } from "@/lib/api-client";
import type {
  ControlDiario,
  ControlMensual,
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

export async function getControlDiario(fecha: string): Promise<ControlDiario> {
  const { data } = await apiClient.get<ControlDiario>("/marcaciones/control-diario", {
    params: { fecha },
  });
  return data;
}

export async function getControlMensual(personaId: string, mes: string): Promise<ControlMensual> {
  const { data } = await apiClient.get<ControlMensual>(`/marcaciones/control-diario/${personaId}`, {
    params: { mes },
  });
  return data;
}
