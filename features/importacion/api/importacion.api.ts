import { apiClient, handleApiError } from "@/lib/api-client";
import type {
  EjecutarImportacionInput,
  EstadoFotosJobResponse,
  EstadoImportacionJobResponse,
  IniciarFotosJobResponse,
  IniciarImportacionResponse,
  PrevisualizarImportacionInput,
  TipoImportacion,
  VistaPreviaResponse,
} from "../types/importacion.types";

export const importacionApi = {
  async descargarPlantilla(tipo: TipoImportacion): Promise<Blob> {
    try {
      const response = await apiClient.get<Blob>(`/importacion/plantilla/${tipo}`, {
        responseType: "blob",
      });
      return response.data;
    } catch (error) {
      handleApiError(error, "Error al descargar la plantilla de importación.");
    }
  },

  async previsualizar(input: PrevisualizarImportacionInput): Promise<VistaPreviaResponse> {
    try {
      const { data } = await apiClient.post<VistaPreviaResponse>(
        "/importacion/previsualizar",
        input,
      );
      return data;
    } catch (error) {
      handleApiError(error, "Error al analizar el archivo de importación.");
    }
  },

  async ejecutar(input: EjecutarImportacionInput): Promise<IniciarImportacionResponse> {
    try {
      const { data } = await apiClient.post<IniciarImportacionResponse>(
        "/importacion/ejecutar",
        input,
      );
      return data;
    } catch (error) {
      handleApiError(error, "Error al iniciar la importación masiva.");
    }
  },

  async getEstadoJob(jobId: string): Promise<EstadoImportacionJobResponse> {
    try {
      const { data } = await apiClient.get<EstadoImportacionJobResponse>(
        `/importacion/jobs/${jobId}`,
      );
      return data;
    } catch (error) {
      handleApiError(error, "Error al consultar el progreso de la importación.");
    }
  },

  async descargarReporteCredenciales(jobId: string): Promise<Blob> {
    try {
      const response = await apiClient.get<Blob>(`/importacion/jobs/${jobId}/credenciales-excel`, {
        responseType: "blob",
      });
      return response.data;
    } catch (error) {
      handleApiError(error, "Error al descargar el reporte de credenciales.");
    }
  },

  async subirFotosMasivas(formData: FormData): Promise<IniciarFotosJobResponse> {
    try {
      const { data } = await apiClient.post<IniciarFotosJobResponse>(
        "/importacion/fotos-masivas",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return data;
    } catch (error) {
      handleApiError(error, "Error al subir el lote de fotos masivas.");
    }
  },

  async getEstadoFotosJob(jobId: string): Promise<EstadoFotosJobResponse> {
    try {
      const { data } = await apiClient.get<EstadoFotosJobResponse>(
        `/importacion/fotos-masivas/jobs/${jobId}`,
      );
      return data;
    } catch (error) {
      handleApiError(error, "Error al consultar el progreso del procesamiento de fotos.");
    }
  },
};
