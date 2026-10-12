import { apiClient, handleApiError } from "@/lib/api-client";
import type { CargoItem, CreateCargoInput, UpdateCargoInput } from "../types/cargos.types";

export const cargosApi = {
  async getCargos(vigentes = true): Promise<CargoItem[]> {
    try {
      const { data } = await apiClient.get<CargoItem[]>("/cargos", { params: { vigentes } });
      return data;
    } catch (error) {
      handleApiError(error, "Error al cargar el catálogo de cargos.");
    }
  },

  async getCargoById(id: string): Promise<CargoItem> {
    try {
      const { data } = await apiClient.get<CargoItem>(`/cargos/${id}`);
      return data;
    } catch (error) {
      handleApiError(error, "Error al cargar el detalle del cargo.");
    }
  },

  async createCargo(input: CreateCargoInput): Promise<CargoItem> {
    try {
      const { data } = await apiClient.post<CargoItem>("/cargos", input);
      return data;
    } catch (error) {
      handleApiError(error, "Error al crear el cargo.");
    }
  },

  async updateCargo(id: string, input: UpdateCargoInput): Promise<CargoItem> {
    try {
      const { data } = await apiClient.put<CargoItem>(`/cargos/${id}`, input);
      return data;
    } catch (error) {
      handleApiError(error, "Error al actualizar el cargo.");
    }
  },

  async deactivateCargo(id: string): Promise<CargoItem> {
    try {
      const { data } = await apiClient.patch<CargoItem>(`/cargos/${id}/deactivate`);
      return data;
    } catch (error) {
      handleApiError(error, "Error al desactivar el cargo.");
    }
  },

  async reactivateCargo(id: string): Promise<CargoItem> {
    try {
      const { data } = await apiClient.patch<CargoItem>(`/cargos/${id}/reactivate`);
      return data;
    } catch (error) {
      handleApiError(error, "Error al reactivar el cargo.");
    }
  },
};
