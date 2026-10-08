import { apiClient } from "@/lib/api-client";
import type { CreateTurnoPayload, Turno, UpdateTurnoPayload } from "../types";

export async function getTurnos(): Promise<Turno[]> {
  const response = await apiClient.get<Turno[]>("/turnos");
  return response.data;
}

export async function getTurnoById(id: string): Promise<Turno> {
  const response = await apiClient.get<Turno>(`/turnos/${id}`);
  return response.data;
}

export async function createTurno(payload: CreateTurnoPayload): Promise<Turno> {
  const response = await apiClient.post<Turno>("/turnos", payload);
  return response.data;
}

export async function updateTurno(id: string, payload: UpdateTurnoPayload): Promise<Turno> {
  const response = await apiClient.patch<Turno>(`/turnos/${id}`, payload);
  return response.data;
}
