import { apiClient } from "@/lib/api-client";
import type {
  AsignarPendientePayload,
  CodigoBiometricoApi,
  DescartarPendientePayload,
  EstadoPendienteApi,
  EstadoRelojApiDto,
  PendienteApi,
  ResolverPendienteResponse,
} from "../types";

export async function getEstadoRelojes(): Promise<EstadoRelojApiDto[]> {
  const { data } = await apiClient.get<EstadoRelojApiDto[]>("/biometrico/estado");
  return data;
}

export async function getPendientes(estado: EstadoPendienteApi): Promise<PendienteApi[]> {
  const { data } = await apiClient.get<PendienteApi[]>("/biometrico/pendientes", {
    params: { estado },
  });
  return data;
}

export async function asignarPendiente(
  id: string,
  payload: AsignarPendientePayload,
): Promise<ResolverPendienteResponse> {
  const { data } = await apiClient.post<ResolverPendienteResponse>(
    `/biometrico/pendientes/${id}/asignar`,
    payload,
  );
  return data;
}

export async function descartarPendiente(
  id: string,
  payload: DescartarPendientePayload,
): Promise<ResolverPendienteResponse> {
  const { data } = await apiClient.post<ResolverPendienteResponse>(
    `/biometrico/pendientes/${id}/descartar`,
    payload,
  );
  return data;
}

export async function getCodigoBiometrico(personaId: string): Promise<CodigoBiometricoApi> {
  const { data } = await apiClient.get<CodigoBiometricoApi>(
    `/biometrico/personas/${personaId}/codigo`,
  );
  return data;
}

export async function asignarCodigoBiometrico(
  personaId: string,
  codigo: string,
): Promise<CodigoBiometricoApi> {
  const { data } = await apiClient.put<CodigoBiometricoApi>(
    `/biometrico/personas/${personaId}/codigo`,
    { codigo },
  );
  return data;
}

export async function quitarCodigoBiometrico(personaId: string): Promise<CodigoBiometricoApi> {
  const { data } = await apiClient.delete<CodigoBiometricoApi>(
    `/biometrico/personas/${personaId}/codigo`,
  );
  return data;
}
