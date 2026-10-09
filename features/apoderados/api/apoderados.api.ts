import { apiClient, handleApiError } from "@/lib/api-client";
import type {
  Apoderado,
  CreateApoderadoPayload,
  CreateApoderadoResponse,
  PaginatedApoderadosResponse,
  UpdateApoderadoPayload,
  VincularEstudiantePayload,
  VinculoFamiliar,
} from "../types/apoderados.types";

export interface ApoderadosQueryParams {
  search?: string;
  estudianteId?: string;
  gradoInstruccion?: string;
  cursor?: string;
  limit?: number;
}

export const apoderadosApi = {
  async getApoderados(params: ApoderadosQueryParams = {}): Promise<PaginatedApoderadosResponse> {
    try {
      const { data } = await apiClient.get<PaginatedApoderadosResponse>("/apoderados", {
        params,
      });
      return data;
    } catch (error) {
      handleApiError(error, "Error al cargar la lista de apoderados.");
    }
  },

  async getApoderadoById(id: string): Promise<Apoderado> {
    try {
      const { data } = await apiClient.get<Apoderado>(`/apoderados/${id}`);
      return data;
    } catch (error) {
      handleApiError(error, "Error al cargar los datos del apoderado.");
    }
  },

  async getApoderadosByEstudiante(estudianteId: string): Promise<Apoderado[]> {
    try {
      const { data } = await apiClient.get<Apoderado[]>(`/apoderados/estudiante/${estudianteId}`);
      return data;
    } catch (error) {
      handleApiError(error, "Error al cargar los apoderados del estudiante.");
    }
  },

  async createApoderado(payload: CreateApoderadoPayload): Promise<CreateApoderadoResponse> {
    try {
      const { data } = await apiClient.post<CreateApoderadoResponse>("/apoderados", payload);
      return data;
    } catch (error) {
      handleApiError(error, "Error al registrar el apoderado.");
    }
  },

  async updateApoderado(id: string, payload: UpdateApoderadoPayload): Promise<Apoderado> {
    try {
      const { data } = await apiClient.patch<Apoderado>(`/apoderados/${id}`, payload);
      return data;
    } catch (error) {
      handleApiError(error, "Error al actualizar la ficha del apoderado.");
    }
  },

  async deleteApoderado(id: string): Promise<{ message: string }> {
    try {
      const { data } = await apiClient.delete<{ message: string }>(`/apoderados/${id}`);
      return data;
    } catch (error) {
      handleApiError(error, "Error al eliminar la ficha del apoderado.");
    }
  },

  async vincularEstudiante(payload: VincularEstudiantePayload): Promise<VinculoFamiliar> {
    try {
      const { data } = await apiClient.post<VinculoFamiliar>("/apoderados/vincular", payload);
      return data;
    } catch (error) {
      handleApiError(error, "Error al registrar el vínculo familiar.");
    }
  },

  async desvincularEstudiante(
    estudianteId: string,
    apoderadoId: string,
  ): Promise<{ message: string }> {
    try {
      const { data } = await apiClient.delete<{ message: string }>(
        `/apoderados/desvincular/${estudianteId}/${apoderadoId}`,
      );
      return data;
    } catch (error) {
      handleApiError(error, "Error al retirar el vínculo familiar.");
    }
  },
};
