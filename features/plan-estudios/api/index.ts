import { apiClient } from "@/lib/api-client";
import type {
  AddCursoPlanPayload,
  PlanEstudioItem,
  PlanEstudioResponse,
  UpdateHorasPlanPayload,
} from "../types";

export async function getPlanEstudio(gradoId: string): Promise<PlanEstudioResponse> {
  const response = await apiClient.get<PlanEstudioResponse>(`/plan-estudios/${gradoId}`);
  return response.data;
}

export async function addCursoPlan(
  gradoId: string,
  payload: AddCursoPlanPayload,
): Promise<PlanEstudioItem> {
  const response = await apiClient.post<PlanEstudioItem>(`/plan-estudios/${gradoId}`, payload);
  return response.data;
}

export async function updateHorasPlan(
  id: string,
  payload: UpdateHorasPlanPayload,
): Promise<PlanEstudioItem> {
  const response = await apiClient.patch<PlanEstudioItem>(`/plan-estudios/${id}/horas`, payload);
  return response.data;
}

export async function removeCursoPlan(id: string): Promise<{ success: boolean; message: string }> {
  const response = await apiClient.delete<{ success: boolean; message: string }>(
    `/plan-estudios/${id}`,
  );
  return response.data;
}

export async function copyPlan(
  gradoId: string,
  origenGradoId: string,
): Promise<{
  mensaje: string;
  totalHoras: number;
  cursos: PlanEstudioItem[];
}> {
  const response = await apiClient.post<{
    mensaje: string;
    totalHoras: number;
    cursos: PlanEstudioItem[];
  }>(`/plan-estudios/${gradoId}/copiar-de/${origenGradoId}`);
  return response.data;
}
