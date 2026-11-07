import { apiClient, handleApiError } from "@/lib/api-client";
import type {
  CesarDocenteInput,
  CreateDocenteInput,
  CreateDocenteResponse,
  Docente,
  DocenteQueryParams,
  PaginatedDocentesResponse,
  UpdateDocenteInput,
} from "../types/docentes.types";

export const docentesApi = {
  async getDocentes(params: DocenteQueryParams = {}): Promise<PaginatedDocentesResponse> {
    try {
      const { data } = await apiClient.get<PaginatedDocentesResponse>("/docentes", { params });
      return data;
    } catch (error) {
      handleApiError(error, "Error al cargar la lista de docentes.");
    }
  },

  async getDocenteById(id: string): Promise<Docente> {
    try {
      const { data } = await apiClient.get<Docente>(`/docentes/${id}`);
      return data;
    } catch (error) {
      handleApiError(error, "Error al cargar los datos del docente.");
    }
  },

  async createDocente(input: CreateDocenteInput): Promise<CreateDocenteResponse> {
    try {
      const { data } = await apiClient.post<CreateDocenteResponse>("/docentes", input);
      return data;
    } catch (error) {
      handleApiError(error, "Error al registrar el docente.");
    }
  },

  async updateDocente(id: string, input: UpdateDocenteInput): Promise<Docente> {
    try {
      const { data } = await apiClient.patch<Docente>(`/docentes/${id}`, input);
      return data;
    } catch (error) {
      handleApiError(error, "Error al actualizar la ficha del docente.");
    }
  },

  async cesarDocente(
    id: string,
    input: CesarDocenteInput,
  ): Promise<{ docente: Docente; message: string }> {
    try {
      const { data } = await apiClient.post<{ docente: Docente; message: string }>(
        `/docentes/${id}/cesar`,
        input,
      );
      return data;
    } catch (error) {
      handleApiError(error, "Error al registrar el cese del docente.");
    }
  },

  async reactivarDocente(id: string): Promise<{ docente: Docente; message: string }> {
    try {
      const { data } = await apiClient.post<{ docente: Docente; message: string }>(
        `/docentes/${id}/reactivar`,
      );
      return data;
    } catch (error) {
      handleApiError(error, "Error al reactivar al docente.");
    }
  },
};
