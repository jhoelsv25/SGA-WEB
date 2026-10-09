import { apiClient, handleApiError } from "@/lib/api-client";
import type {
  CreateEstudianteInput,
  CreateEstudianteResponse,
  Estudiante,
  EstudianteQueryParams,
  PaginatedEstudiantesResponse,
  UpdateEstudianteInput,
} from "../types/estudiantes.types";

export const estudiantesApi = {
  async getEstudiantes(params: EstudianteQueryParams = {}): Promise<PaginatedEstudiantesResponse> {
    try {
      const { data } = await apiClient.get<PaginatedEstudiantesResponse>("/estudiantes", {
        params,
      });
      return data;
    } catch (error) {
      handleApiError(error, "Error al cargar la lista de estudiantes.");
    }
  },

  async getEstudianteById(id: string): Promise<Estudiante> {
    try {
      const { data } = await apiClient.get<Estudiante>(`/estudiantes/${id}`);
      return data;
    } catch (error) {
      handleApiError(error, "Error al cargar los datos del estudiante.");
    }
  },

  async createEstudiante(input: CreateEstudianteInput): Promise<CreateEstudianteResponse> {
    try {
      const { data } = await apiClient.post<CreateEstudianteResponse>("/estudiantes", input);
      return data;
    } catch (error) {
      handleApiError(error, "Error al registrar el estudiante.");
    }
  },

  async updateEstudiante(id: string, input: UpdateEstudianteInput): Promise<Estudiante> {
    try {
      const { data } = await apiClient.patch<Estudiante>(`/estudiantes/${id}`, input);
      return data;
    } catch (error) {
      handleApiError(error, "Error al actualizar la ficha del estudiante.");
    }
  },

  async deleteEstudiante(id: string): Promise<{ message: string }> {
    try {
      const { data } = await apiClient.delete<{ message: string }>(`/estudiantes/${id}`);
      return data;
    } catch (error) {
      handleApiError(error, "Error al eliminar la ficha del estudiante.");
    }
  },
};
