import { apiClient } from "@/lib/api-client";
import type {
  CodigoBiometricoApi,
  HoraProgramada,
  ProgramacionBiometrico,
  SincronizacionReloj,
} from "../types";

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

export async function getProgramacionBiometrico(): Promise<ProgramacionBiometrico> {
  const { data } = await apiClient.get<ProgramacionBiometrico>("/biometrico/programacion");
  return data;
}

export async function guardarProgramacionBiometrico(
  horarios: HoraProgramada[],
): Promise<ProgramacionBiometrico> {
  const { data } = await apiClient.put<ProgramacionBiometrico>("/biometrico/programacion", {
    horarios,
  });
  return data;
}

export async function getSincronizacionesReloj(): Promise<SincronizacionReloj[]> {
  const { data } = await apiClient.get<SincronizacionReloj[]>("/biometrico/sincronizaciones");
  return data;
}
