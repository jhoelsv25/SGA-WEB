import { apiClient } from "@/lib/api-client";
import type { Grado, UpdateGradoPayload } from "../types";

export async function getGrados(): Promise<Grado[]> {
  const response = await apiClient.get<Grado[]>("/grados");
  return response.data;
}

export async function updateGrado(id: string, payload: UpdateGradoPayload): Promise<Grado> {
  const response = await apiClient.patch<Grado>(`/grados/${id}`, payload);
  return response.data;
}
