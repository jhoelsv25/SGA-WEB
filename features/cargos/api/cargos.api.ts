import { apiClient, handleApiError } from "@/lib/api-client";
import type { CargoItem } from "../types/cargos.types";

export const cargosApi = {
  async getCargos(vigentes = true): Promise<CargoItem[]> {
    try {
      const { data } = await apiClient.get<CargoItem[]>("/cargos", { params: { vigentes } });
      return data;
    } catch (error) {
      handleApiError(error, "Error al cargar el catálogo de cargos.");
    }
  },
};
