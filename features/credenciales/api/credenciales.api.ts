import { apiClient, handleApiError } from "@/lib/api-client";
import type {
  CambiarPinInput,
  CarneDatos,
  CredencialResponse,
  ReemitirCredencialInput,
} from "../types/credenciales.types";

export const credencialesApi = {
  async reemitirCredencial(input: ReemitirCredencialInput): Promise<CredencialResponse> {
    try {
      const { data } = await apiClient.post<CredencialResponse>("/credenciales/reemitir", input);
      return data;
    } catch (error) {
      handleApiError(error, "Error al anular y emitir la nueva credencial.");
    }
  },

  async cambiarMiPin(input: CambiarPinInput): Promise<{ mensaje: string }> {
    try {
      const { data } = await apiClient.patch<{ mensaje: string }>("/credenciales/mi-pin", input);
      return data;
    } catch (error) {
      handleApiError(error, "Error al actualizar el PIN de marcación.");
    }
  },

  async cambiarPinPersona(personaId: string, input: CambiarPinInput): Promise<{ mensaje: string }> {
    try {
      const { data } = await apiClient.patch<{ mensaje: string }>(
        `/credenciales/personas/${personaId}/pin`,
        input,
      );
      return data;
    } catch (error) {
      handleApiError(error, "Error al actualizar el PIN de la persona.");
    }
  },

  async getCarneDatos(personaId: string): Promise<CarneDatos> {
    try {
      const { data } = await apiClient.get<CarneDatos>(`/credenciales/personas/${personaId}/carne`);
      return data;
    } catch (error) {
      handleApiError(error, "Error al obtener los datos para el carné.");
    }
  },

  async getCredencialActiva(personaId: string): Promise<CredencialResponse> {
    try {
      const { data } = await apiClient.get<CredencialResponse>(
        `/credenciales/personas/${personaId}`,
      );
      return data;
    } catch (error) {
      handleApiError(error, "Error al consultar la credencial activa.");
    }
  },
};
