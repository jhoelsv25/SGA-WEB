import { apiClient, API_BASE_URL, handleApiError } from "@/lib/api-client";
import { AUSENCIAS_ENDPOINTS } from "../consts";
import type {
  AnularAusenciaDto,
  AusenciaResponseDto,
  CorregirAusenciaPayload,
  FiltroAusenciasQueryDto,
  HistorialAusenciaResponseDto,
  MensajeAusenciaResponseDto,
  RegistrarAusenciaPayload,
  RegistrarDescargoDto,
  RegistroAusenciaResponseDto,
  ResumenAusenciasSupervisorResponseDto,
} from "../types";

/**
 * Resuelve la URL completa para previsualizar o descargar evidencias fotográficas.
 * Las evidencias se sirven desde el backend en `/uploads/...` sin el prefijo `/api`.
 */
export function urlDeEvidencia(url?: string | null): string {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("blob:")) {
    return url;
  }
  const baseUrlSinApi = API_BASE_URL.replace(/\/api\/?$/, "");
  const rutaLimpia = url.startsWith("/") ? url : `/${url}`;
  return `${baseUrlSinApi}${rutaLimpia}`;
}

/**
 * HU1: Registra una nueva ausencia docente en una sesión de clase con fotos opcionales.
 */
export async function registrarAusencia(
  payload: RegistrarAusenciaPayload,
): Promise<RegistroAusenciaResponseDto> {
  try {
    const formulario = new FormData();
    formulario.append("sesionClaseId", payload.datos.sesionClaseId);
    formulario.append("horaDesde", payload.datos.horaDesde);
    formulario.append("horaHasta", payload.datos.horaHasta);
    formulario.append("motivo", payload.datos.motivo);

    if (payload.datos.observacion !== undefined && payload.datos.observacion.trim() !== "") {
      formulario.append("observacion", payload.datos.observacion.trim());
    }

    if (payload.datos.metadatosFotos) {
      formulario.append("metadatosFotos", payload.datos.metadatosFotos);
    }

    if (payload.fotos && payload.fotos.length > 0) {
      payload.fotos.forEach((foto) => {
        formulario.append("fotos", foto);
      });
    }

    const { data } = await apiClient.post<RegistroAusenciaResponseDto>(
      AUSENCIAS_ENDPOINTS.BASE,
      formulario,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return data;
  } catch (error) {
    handleApiError(error, "Error al registrar la ausencia docente.");
  }
}

/**
 * HU2: Corrige una ausencia existente dentro del plazo de 24 horas y antes del descargo.
 */
export async function corregirAusencia(
  payload: CorregirAusenciaPayload,
): Promise<AusenciaResponseDto> {
  try {
    const formulario = new FormData();

    if (payload.datos.horaDesde) {
      formulario.append("horaDesde", payload.datos.horaDesde);
    }
    if (payload.datos.horaHasta) {
      formulario.append("horaHasta", payload.datos.horaHasta);
    }
    if (payload.datos.motivo) {
      formulario.append("motivo", payload.datos.motivo);
    }
    if (payload.datos.observacion !== undefined) {
      formulario.append("observacion", payload.datos.observacion.trim());
    }
    formulario.append("motivoCambio", payload.datos.motivoCambio.trim());

    if (payload.datos.fotosRetiradasIds && payload.datos.fotosRetiradasIds.length > 0) {
      payload.datos.fotosRetiradasIds.forEach((id) => {
        formulario.append("fotosRetiradasIds", id);
      });
    }

    if (payload.datos.metadatosFotos) {
      formulario.append("metadatosFotos", payload.datos.metadatosFotos);
    }

    if (payload.fotos && payload.fotos.length > 0) {
      payload.fotos.forEach((foto) => {
        formulario.append("fotos", foto);
      });
    }

    const { data } = await apiClient.patch<AusenciaResponseDto>(
      AUSENCIAS_ENDPOINTS.POR_ID(payload.id),
      formulario,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return data;
  } catch (error) {
    handleApiError(error, "Error al corregir la ausencia.");
  }
}

/**
 * HU2: Anula una ausencia indicando el motivo obligatorio.
 */
export async function anularAusencia(
  id: string,
  dto: AnularAusenciaDto,
): Promise<AusenciaResponseDto> {
  try {
    const { data } = await apiClient.patch<AusenciaResponseDto>(
      AUSENCIAS_ENDPOINTS.ANULAR(id),
      dto,
    );
    return data;
  } catch (error) {
    handleApiError(error, "Error al anular la ausencia.");
  }
}

/**
 * HU2: Obtiene el historial completo de versiones de una ausencia (solo supervisores).
 */
export async function getHistorialAusencia(id: string): Promise<HistorialAusenciaResponseDto> {
  try {
    const { data } = await apiClient.get<HistorialAusenciaResponseDto>(
      AUSENCIAS_ENDPOINTS.HISTORIAL(id),
    );
    return data;
  } catch (error) {
    handleApiError(error, "Error al obtener el historial de la ausencia.");
  }
}

/**
 * HU4: Lista ausencias para supervisores con filtros y cálculo de total de minutos.
 */
export async function getAusenciasSupervisor(
  filtros?: FiltroAusenciasQueryDto,
): Promise<ResumenAusenciasSupervisorResponseDto> {
  try {
    const { data } = await apiClient.get<ResumenAusenciasSupervisorResponseDto>(
      AUSENCIAS_ENDPOINTS.BASE,
      {
        params: filtros,
      },
    );
    return data;
  } catch (error) {
    handleApiError(error, "Error al obtener las ausencias de supervisión.");
  }
}

/**
 * HU3: Lista las ausencias vigentes del docente autenticado.
 */
export async function getMisAusencias(): Promise<AusenciaResponseDto[]> {
  try {
    const { data } = await apiClient.get<AusenciaResponseDto[]>(AUSENCIAS_ENDPOINTS.MIS_AUSENCIAS);
    return data;
  } catch (error) {
    handleApiError(error, "Error al obtener sus ausencias.");
  }
}

/**
 * HU3: Obtiene el detalle de una ausencia vigente para el docente autenticado.
 */
export async function getDetalleAusenciaDocente(id: string): Promise<AusenciaResponseDto> {
  try {
    const { data } = await apiClient.get<AusenciaResponseDto>(
      AUSENCIAS_ENDPOINTS.DETALLE_DOCENTE(id),
    );
    return data;
  } catch (error) {
    handleApiError(error, "Error al obtener el detalle de la ausencia.");
  }
}

/**
 * HU3: Registra el descargo único del docente dentro del plazo establecido.
 */
export async function presentarDescargo(
  id: string,
  dto: RegistrarDescargoDto,
): Promise<MensajeAusenciaResponseDto> {
  try {
    const { data } = await apiClient.post<MensajeAusenciaResponseDto>(
      AUSENCIAS_ENDPOINTS.DESCARGO(id),
      dto,
    );
    return data;
  } catch (error) {
    handleApiError(error, "Error al registrar el descargo de la ausencia.");
  }
}
