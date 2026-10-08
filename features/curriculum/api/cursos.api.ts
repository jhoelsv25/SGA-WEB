import { apiClient } from "@/lib/api-client";
import type { CreateCursoPayload, Curso, FilterCursoParams, UpdateCursoPayload } from "../types";

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
