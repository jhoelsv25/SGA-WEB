import { apiClient, handleApiError } from "@/lib/api-client";
import { COMPROMISOS_ENDPOINTS } from "../consts";
import type {
  AnularCompromisoDto,
  CerrarCompromisoDto,
  CompromisoAccionResponse,
  CompromisoItem,
  DetalleCompromisoResponse,
  RegistrarCompromisoDto,
  ReprogramarCompromisoDto,
} from "../types";

export async function registrarCompromiso(
  dto: RegistrarCompromisoDto,
): Promise<CompromisoAccionResponse> {
  try {
    const { data } = await apiClient.post<CompromisoAccionResponse>(
      COMPROMISOS_ENDPOINTS.BASE,
      dto,
    );
    return data;
  } catch (error) {
    handleApiError(error, "Error al registrar el compromiso.");
  }
}

export async function listarCompromisos(consolidadoId: string): Promise<CompromisoItem[]> {
  try {
    const { data } = await apiClient.get<CompromisoItem[]>(COMPROMISOS_ENDPOINTS.BASE, {
      params: { consolidadoId },
    });
    return data;
  } catch (error) {
    handleApiError(error, "Error al listar los compromisos.");
  }
}

export async function obtenerCompromiso(compromisoId: string): Promise<DetalleCompromisoResponse> {
  try {
    const { data } = await apiClient.get<DetalleCompromisoResponse>(
      COMPROMISOS_ENDPOINTS.POR_ID(compromisoId),
    );
    return data;
  } catch (error) {
    handleApiError(error, "Error al obtener el compromiso.");
  }
}

export async function cerrarCompromiso(
  compromisoId: string,
  dto: CerrarCompromisoDto,
): Promise<CompromisoAccionResponse> {
  try {
    const { data } = await apiClient.patch<CompromisoAccionResponse>(
      COMPROMISOS_ENDPOINTS.CERRAR(compromisoId),
      dto,
    );
    return data;
  } catch (error) {
    handleApiError(error, "Error al cerrar el compromiso.");
  }
}

export async function reprogramarCompromiso(
  compromisoId: string,
  dto: ReprogramarCompromisoDto,
): Promise<CompromisoAccionResponse> {
  try {
    const { data } = await apiClient.patch<CompromisoAccionResponse>(
      COMPROMISOS_ENDPOINTS.REPROGRAMAR(compromisoId),
      dto,
    );
    return data;
  } catch (error) {
    handleApiError(error, "Error al reprogramar el compromiso.");
  }
}

export async function anularCompromiso(
  compromisoId: string,
  dto: AnularCompromisoDto,
): Promise<CompromisoAccionResponse> {
  try {
    const { data } = await apiClient.patch<CompromisoAccionResponse>(
      COMPROMISOS_ENDPOINTS.ANULAR(compromisoId),
      dto,
    );
    return data;
  } catch (error) {
    handleApiError(error, "Error al anular el compromiso.");
  }
}

export async function marcarCompromisoEnterado(
  compromisoId: string,
): Promise<CompromisoAccionResponse> {
  try {
    const { data } = await apiClient.post<CompromisoAccionResponse>(
      COMPROMISOS_ENDPOINTS.ENTERADO(compromisoId),
    );
    return data;
  } catch (error) {
    handleApiError(error, "Error al registrar que está enterado.");
  }
}
