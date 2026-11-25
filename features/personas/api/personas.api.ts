import { apiClient, handleApiError } from "@/lib/api-client";
import type {
  CargoAsignadoResponse,
  ChangeCargoInput,
  CreatePersonaInput,
  HistorialCorreccionCritica,
  PaginatedPersonasResponse,
  Persona,
  PersonaQueryParams,
  ResumenPersonasResponse,
  SearchPersonaResult,
  UpdatePersonaInput,
} from "../types/personas.types";

export const personasApi = {
  async getPersonas(params: PersonaQueryParams = {}): Promise<PaginatedPersonasResponse> {
    try {
      const { data } = await apiClient.get<PaginatedPersonasResponse>("/personas", { params });
      return data;
    } catch (error) {
      handleApiError(error, "Error al cargar la lista de personas.");
    }
  },

  async getResumenPersonas(
    params: Pick<PersonaQueryParams, "search" | "tipoDocumento" | "esProvisional"> = {},
  ): Promise<ResumenPersonasResponse> {
    try {
      const { data } = await apiClient.get<ResumenPersonasResponse>("/personas/resumen", {
        params,
      });
      return data;
    } catch (error) {
      handleApiError(error, "Error al cargar el resumen del padrón de personas.");
    }
  },

  async getPersonaById(id: string): Promise<Persona> {
    try {
      const { data } = await apiClient.get<Persona>(`/personas/${id}`);
      return data;
    } catch (error) {
      handleApiError(error, "Error al cargar los datos de la persona.");
    }
  },

  async searchPersonas(params: PersonaQueryParams): Promise<SearchPersonaResult> {
    try {
      const { data } = await apiClient.get<SearchPersonaResult>("/personas/buscar", {
        params,
      });
      return data;
    } catch (error) {
      handleApiError(error, "Error al buscar personas en el padrón.");
    }
  },

  async createPersona(input: CreatePersonaInput): Promise<Persona> {
    try {
      const { data } = await apiClient.post<Persona>("/personas", input);
      return data;
    } catch (error) {
      handleApiError(error, "Error al registrar la persona.");
    }
  },

  async updatePersona(id: string, input: UpdatePersonaInput): Promise<Persona> {
    try {
      const { data } = await apiClient.patch<Persona>(`/personas/${id}`, input);
      return data;
    } catch (error) {
      handleApiError(error, "Error al actualizar los datos de la persona.");
    }
  },

  async deletePersona(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const { data } = await apiClient.delete<{ success: boolean; message: string }>(
        `/personas/${id}`,
      );
      return data;
    } catch (error) {
      handleApiError(error, "Error al eliminar la persona del padrón.");
    }
  },

  async getHistorialCritico(personaId: string): Promise<HistorialCorreccionCritica[]> {
    try {
      const { data } = await apiClient.get<HistorialCorreccionCritica[]>(
        `/personas/${personaId}/historial-critico`,
      );
      return data;
    } catch (error) {
      handleApiError(error, "Error al consultar el historial de correcciones.");
    }
  },

  async changeCargo(id: string, input: ChangeCargoInput): Promise<CargoAsignadoResponse> {
    try {
      const { data } = await apiClient.patch<CargoAsignadoResponse>(`/personas/${id}/cargo`, input);
      return data;
    } catch (error) {
      handleApiError(error, "Error al cambiar el cargo de la persona.");
    }
  },
};
