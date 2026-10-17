import { apiClient, handleApiError } from "@/lib/api-client";
import { LIBRETAS_ENDPOINTS } from "../constants";
import type {
  AlcanceLibreta,
  AlcanceRol,
  AsignacionManual,
  ContextoLibretas,
  DetalleLibreta,
  HistorialLibreta,
  MiLibreta,
  ResultadoProgramacion,
  ResultadoPublicacion,
  SeguimientoSeccion,
  VistaPreviaLibretas,
} from "../types";

function aFormData(
  seccionId: string,
  periodoId: string,
  archivos: File[],
  asignaciones?: AsignacionManual[],
) {
  const formulario = new FormData();
  formulario.append("seccionId", seccionId);
  formulario.append("periodoId", periodoId);
  for (const archivo of archivos) {
    formulario.append("archivos", archivo);
  }
  if (asignaciones && asignaciones.length > 0) {
    formulario.append("asignaciones", JSON.stringify(asignaciones));
  }
  return formulario;
}

export async function getContextoLibretas(): Promise<ContextoLibretas> {
  try {
    const { data } = await apiClient.get<ContextoLibretas>(LIBRETAS_ENDPOINTS.CONTEXTO);
    return data;
  } catch (error) {
    handleApiError(error, "Error al cargar el contexto de libretas.");
  }
}

export async function programarLibretas(
  periodoId: string,
  fechaLimite: string,
): Promise<ResultadoProgramacion> {
  try {
    const { data } = await apiClient.post<ResultadoProgramacion>(LIBRETAS_ENDPOINTS.PROGRAMAR, {
      periodoId,
      fechaLimite,
    });
    return data;
  } catch (error) {
    handleApiError(error, "Error al programar la fecha límite de libretas.");
  }
}

export async function cambiarFechaLibretas(
  periodoId: string,
  fechaLimite: string,
): Promise<{ actualizadas: number; fechaLimite: string }> {
  try {
    const { data } = await apiClient.patch<{ actualizadas: number; fechaLimite: string }>(
      LIBRETAS_ENDPOINTS.PROGRAMACIONES(periodoId),
      { fechaLimite },
    );
    return data;
  } catch (error) {
    handleApiError(error, "Error al actualizar la fecha límite de libretas.");
  }
}

export async function vistaPreviaLibretas(
  seccionId: string,
  periodoId: string,
  archivos: File[],
): Promise<VistaPreviaLibretas> {
  try {
    const { data } = await apiClient.post<VistaPreviaLibretas>(
      LIBRETAS_ENDPOINTS.VISTA_PREVIA,
      aFormData(seccionId, periodoId, archivos),
      { timeout: 120_000 },
    );
    return data;
  } catch (error) {
    handleApiError(error, "Error al generar la vista previa de las libretas.");
  }
}

export async function publicarLibretas(
  seccionId: string,
  periodoId: string,
  archivos: File[],
  asignaciones: AsignacionManual[],
): Promise<ResultadoPublicacion> {
  try {
    const { data } = await apiClient.post<ResultadoPublicacion>(
      LIBRETAS_ENDPOINTS.PUBLICAR,
      aFormData(seccionId, periodoId, archivos, asignaciones),
      { timeout: 120_000 },
    );
    return data;
  } catch (error) {
    handleApiError(error, "Error al publicar las libretas.");
  }
}

export async function getAlcancesLibretas(): Promise<AlcanceRol[]> {
  try {
    const { data } = await apiClient.get<AlcanceRol[]>(LIBRETAS_ENDPOINTS.ALCANCES);
    return data;
  } catch (error) {
    handleApiError(error, "Error al obtener los alcances de libretas.");
  }
}

export async function cambiarAlcanceLibretas(
  rolId: string,
  alcance: AlcanceLibreta,
): Promise<{ rolId: string; alcance: AlcanceLibreta }> {
  try {
    const { data } = await apiClient.patch<{ rolId: string; alcance: AlcanceLibreta }>(
      LIBRETAS_ENDPOINTS.ALCANCES,
      { rolId, alcance },
    );
    return data;
  } catch (error) {
    handleApiError(error, "Error al actualizar el alcance de libretas.");
  }
}

export async function getSeguimientoLibretas(
  periodoId: string,
): Promise<{ secciones: SeguimientoSeccion[] }> {
  try {
    const { data } = await apiClient.get<{ secciones: SeguimientoSeccion[] }>(
      LIBRETAS_ENDPOINTS.SEGUIMIENTO,
      {
        params: { periodoId },
      },
    );
    return data;
  } catch (error) {
    handleApiError(error, "Error al obtener el seguimiento de libretas.");
  }
}

export async function getDetalleLibretas(
  seccionId: string,
  periodoId: string,
): Promise<DetalleLibreta[]> {
  try {
    const { data } = await apiClient.get<DetalleLibreta[]>(LIBRETAS_ENDPOINTS.DETALLE(seccionId), {
      params: { periodoId },
    });
    return data;
  } catch (error) {
    handleApiError(error, "Error al obtener el detalle de libretas de la sección.");
  }
}

export async function getMisLibretas(): Promise<{ libretas: MiLibreta[] }> {
  try {
    const { data } = await apiClient.get<{ libretas: MiLibreta[] }>(LIBRETAS_ENDPOINTS.MIAS);
    return data;
  } catch (error) {
    handleApiError(error, "Error al obtener sus libretas.");
  }
}

export async function getHistorialLibreta(id: string): Promise<HistorialLibreta> {
  try {
    const { data } = await apiClient.get<HistorialLibreta>(LIBRETAS_ENDPOINTS.HISTORIAL(id));
    return data;
  } catch (error) {
    handleApiError(error, "Error al consultar el historial de la libreta.");
  }
}

export async function abrirLibreta(id: string): Promise<void> {
  try {
    const { data } = await apiClient.get<Blob>(LIBRETAS_ENDPOINTS.ARCHIVO(id), {
      responseType: "blob",
    });
    const url = URL.createObjectURL(data);
    window.open(url, "_blank", "noopener,noreferrer");
    window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
  } catch (error) {
    handleApiError(error, "Error al abrir el archivo de la libreta.");
  }
}
