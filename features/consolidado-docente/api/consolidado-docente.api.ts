import { apiClient, handleApiError } from "@/lib/api-client";
import { CONSOLIDADO_DOCENTE_ENDPOINTS } from "../consts";
import type {
  ActualizarDecisionDto,
  CerrarConsolidadoDto,
  ConsolidadoQueryDto,
  ConsolidadoResumenItem,
  DetalleDocenteConsolidadoResponse,
  GenerarConsolidadoDto,
  HistorialVersionConsolidadoItem,
  ResolverSolicitudRevisionDto,
  SolicitarRevisionDto,
  SolicitudRevisionItem,
} from "../types";

export async function generarConsolidados(
  dto: GenerarConsolidadoDto,
): Promise<{ creados?: number; id?: string; mensaje: string }> {
  try {
    const { data } = await apiClient.post<{ creados?: number; id?: string; mensaje: string }>(
      CONSOLIDADO_DOCENTE_ENDPOINTS.GENERAR,
      dto,
    );
    return data;
  } catch (error) {
    handleApiError(error, "Error al generar los consolidados docentes.");
  }
}

export async function listarConsolidadosPeriodo(
  query: ConsolidadoQueryDto,
): Promise<ConsolidadoResumenItem[]> {
  try {
    const { data } = await apiClient.get<ConsolidadoResumenItem[]>(
      CONSOLIDADO_DOCENTE_ENDPOINTS.PERIODO,
      {
        params: {
          periodoId: query.periodoId,
          ordenarPor: query.ordenarPor,
          orden: query.orden,
        },
      },
    );
    return data;
  } catch (error) {
    handleApiError(error, "Error al listar los consolidados del periodo.");
  }
}

export async function obtenerDetalleConsolidado(
  consolidadoId: string,
): Promise<DetalleDocenteConsolidadoResponse> {
  try {
    const { data } = await apiClient.get<DetalleDocenteConsolidadoResponse>(
      CONSOLIDADO_DOCENTE_ENDPOINTS.POR_ID(consolidadoId),
    );
    return data;
  } catch (error) {
    handleApiError(error, "Error al obtener el detalle del consolidado docente.");
  }
}

export async function obtenerMiSeguimiento(
  periodoId: string,
): Promise<DetalleDocenteConsolidadoResponse> {
  try {
    const { data } = await apiClient.get<DetalleDocenteConsolidadoResponse>(
      CONSOLIDADO_DOCENTE_ENDPOINTS.MI_SEGUIMIENTO,
      { params: { periodoId } },
    );
    return data;
  } catch (error) {
    handleApiError(error, "Error al obtener el seguimiento de sus horas.");
  }
}

export async function registrarDecisionDirector(
  consolidadoId: string,
  dto: ActualizarDecisionDto,
): Promise<ConsolidadoResumenItem> {
  try {
    const { data } = await apiClient.patch<ConsolidadoResumenItem>(
      CONSOLIDADO_DOCENTE_ENDPOINTS.DECISION(consolidadoId),
      dto,
    );
    return data;
  } catch (error) {
    handleApiError(error, "Error al registrar la decisión del director.");
  }
}

export async function reabrirConsolidado(
  consolidadoId: string,
): Promise<{ consolidado: ConsolidadoResumenItem; mensaje: string }> {
  try {
    const { data } = await apiClient.post<{ consolidado: ConsolidadoResumenItem; mensaje: string }>(
      CONSOLIDADO_DOCENTE_ENDPOINTS.REABRIR(consolidadoId),
    );
    return data;
  } catch (error) {
    handleApiError(error, "Error al reabrir el consolidado docente.");
  }
}

export async function cerrarConsolidado(
  consolidadoId: string,
  dto: CerrarConsolidadoDto,
): Promise<{ version: number; mensaje: string }> {
  try {
    const { data } = await apiClient.post<{ version: number; mensaje: string }>(
      CONSOLIDADO_DOCENTE_ENDPOINTS.CERRAR(consolidadoId),
      dto,
    );
    return data;
  } catch (error) {
    handleApiError(error, "Error al cerrar el consolidado docente.");
  }
}

export async function obtenerHistorialVersiones(
  consolidadoId: string,
): Promise<HistorialVersionConsolidadoItem[]> {
  try {
    const { data } = await apiClient.get<HistorialVersionConsolidadoItem[]>(
      CONSOLIDADO_DOCENTE_ENDPOINTS.VERSIONES(consolidadoId),
    );
    return data;
  } catch (error) {
    handleApiError(error, "Error al obtener el historial de versiones.");
  }
}

export async function solicitarRevision(
  consolidadoId: string,
  dto: SolicitarRevisionDto,
): Promise<{ solicitud: SolicitudRevisionItem; mensaje: string }> {
  try {
    const { data } = await apiClient.post<{ solicitud: SolicitudRevisionItem; mensaje: string }>(
      CONSOLIDADO_DOCENTE_ENDPOINTS.SOLICITAR_REVISION(consolidadoId),
      dto,
    );
    return data;
  } catch (error) {
    handleApiError(error, "Error al enviar la solicitud de revisión.");
  }
}

function descargarBlobEnNavegador(blob: Blob, filename: string) {
  if (typeof window === "undefined") return;
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

export async function obtenerSolicitudPendiente(
  consolidadoId: string,
): Promise<SolicitudRevisionItem | null> {
  try {
    const { data } = await apiClient.get<DetalleDocenteConsolidadoResponse>(
      CONSOLIDADO_DOCENTE_ENDPOINTS.SOLICITUD_PENDIENTE(consolidadoId),
    );
    return data.solicitudPendiente ?? null;
  } catch (error) {
    handleApiError(error, "Error al consultar la solicitud pendiente.");
  }
}

export async function resolverSolicitudRevision(
  solicitudId: string,
  dto: ResolverSolicitudRevisionDto,
): Promise<{ solicitud: SolicitudRevisionItem; mensaje: string }> {
  try {
    const { data } = await apiClient.patch<{ solicitud: SolicitudRevisionItem; mensaje: string }>(
      CONSOLIDADO_DOCENTE_ENDPOINTS.RESOLVER_SOLICITUD(solicitudId),
      dto,
    );
    return data;
  } catch (error) {
    handleApiError(error, "Error al resolver la solicitud de revisión.");
  }
}

export async function descargarFichaPdf(consolidadoId: string): Promise<Blob> {
  try {
    const { data } = await apiClient.get<Blob>(
      CONSOLIDADO_DOCENTE_ENDPOINTS.FICHA_PDF(consolidadoId),
      {
        responseType: "blob",
      },
    );
    descargarBlobEnNavegador(data, `ficha-seguimiento-${consolidadoId}.pdf`);
    return data;
  } catch (error) {
    handleApiError(error, "Error al descargar la ficha de seguimiento en PDF.");
  }
}

export async function exportarExcel(periodoId: string): Promise<Blob> {
  try {
    const { data } = await apiClient.get<Blob>(
      CONSOLIDADO_DOCENTE_ENDPOINTS.EXPORTAR_EXCEL,
      {
        params: { periodoId },
        responseType: "blob",
      },
    );
    descargarBlobEnNavegador(data, "consolidados-docentes.xlsx");
    return data;
  } catch (error) {
    handleApiError(error, "Error al exportar el consolidado a Excel.");
  }
}
