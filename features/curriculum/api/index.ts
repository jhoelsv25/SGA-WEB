import { apiClient } from "@/lib/api-client";
import type {
  AddCursoPlanPayload,
  CreateCursoPayload,
  Curso,
  FilterCursoParams,
  Grado,
  PlanEstudioItem,
  PlanEstudioResponse,
  UpdateCursoPayload,
  UpdateGradoPayload,
  UpdateHorasPlanPayload,
} from "../types";

// ==================== GRADOS (HU1) ====================

export async function getGrados(): Promise<Grado[]> {
  const response = await apiClient.get<Grado[]>("/grados");
  return response.data;
}

export async function updateGrado(id: string, payload: UpdateGradoPayload): Promise<Grado> {
  const response = await apiClient.patch<Grado>(`/grados/${id}`, payload);
  return response.data;
}

// ==================== CURSOS (HU2) ====================

export async function getCursos(params?: FilterCursoParams): Promise<Curso[]> {
  const response = await apiClient.get<Curso[]>("/cursos", { params });
  return response.data;
}

export async function getCursoById(id: string): Promise<Curso> {
  const response = await apiClient.get<Curso>(`/cursos/${id}`);
  return response.data;
}

export async function createCurso(payload: CreateCursoPayload): Promise<Curso> {
  const response = await apiClient.post<Curso>("/cursos", payload);
  return response.data;
}

export async function updateCurso(id: string, payload: UpdateCursoPayload): Promise<Curso> {
  const response = await apiClient.patch<Curso>(`/cursos/${id}`, payload);
  return response.data;
}

export async function desactivarCurso(id: string): Promise<Curso> {
  const response = await apiClient.patch<Curso>(`/cursos/${id}/desactivar`);
  return response.data;
}

export async function reactivarCurso(id: string): Promise<Curso> {
  const response = await apiClient.patch<Curso>(`/cursos/${id}/reactivar`);
  return response.data;
}

// ==================== PLAN DE ESTUDIOS (HU3) ====================

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
