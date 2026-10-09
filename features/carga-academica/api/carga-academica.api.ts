import { apiClient, ApiClientError } from "@/lib/api-client";
import type {
  AsignarDocentePayload,
  AsignarDocenteResultado,
  CargaDocenteDetalle,
  CargaSeccionResponse,
  SeccionDetalleHeader,
} from "../types";

export interface ApiClientErrorConConfirmacion extends ApiClientError {
  requiereConfirmacion?: boolean;
}

export const cargaAcademicaApi = {
  async getCargaSeccion(seccionId: string): Promise<CargaSeccionResponse> {
    const { data } = await apiClient.get<CargaSeccionResponse>(`/secciones/${seccionId}/carga`);
    return data;
  },

  async getSeccionDetalle(seccionId: string): Promise<SeccionDetalleHeader> {
    const { data } = await apiClient.get<SeccionDetalleHeader>(`/secciones/${seccionId}`);
    return data;
  },

  async asignarDocente(
    cursoSeccionId: string,
    payload: AsignarDocentePayload,
  ): Promise<AsignarDocenteResultado> {
    try {
      const { data } = await apiClient.patch<AsignarDocenteResultado>(
        `/carga-academica/${cursoSeccionId}/docente`,
        payload,
      );
      return data;
    } catch (error: unknown) {
      if (error instanceof ApiClientError && error.statusCode === 409) {
        const errorConConfirmacion = error as ApiClientErrorConConfirmacion;
        errorConConfirmacion.requiereConfirmacion = true;
        throw errorConConfirmacion;
      }
      throw error;
    }
  },

  async getCargaDocente(docenteId: string): Promise<CargaDocenteDetalle> {
    const { data } = await apiClient.get<CargaDocenteDetalle>(
      `/carga-academica/docente/${docenteId}`,
    );
    return data;
  },
};
