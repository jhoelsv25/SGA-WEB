import { apiClient } from "@/lib/api-client";
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

const RUTA_BASE = "/consolidado-docente";

export async function generarConsolidados(
  dto: GenerarConsolidadoDto,
): Promise<{ creados?: number; id?: string; mensaje: string }> {
  const { data } = await apiClient.post<{ creados?: number; id?: string; mensaje: string }>(
    `${RUTA_BASE}/generar`,
    dto,
  );
  return data;
}

export async function listarConsolidadosPeriodo(
  query: ConsolidadoQueryDto,
): Promise<ConsolidadoResumenItem[]> {
  const { data } = await apiClient.get<ConsolidadoResumenItem[]>(`${RUTA_BASE}/periodo`, {
    params: {
      periodoId: query.periodoId,
      ordenarPor: query.ordenarPor,
      orden: query.orden,
    },
  });
  return data;
}

export async function obtenerDetalleConsolidado(
  consolidadoId: string,
): Promise<DetalleDocenteConsolidadoResponse> {
  const { data } = await apiClient.get<DetalleDocenteConsolidadoResponse>(
    `${RUTA_BASE}/${consolidadoId}`,
  );
  return data;
}

export async function obtenerMiSeguimiento(
  periodoId: string,
): Promise<DetalleDocenteConsolidadoResponse> {
  const { data } = await apiClient.get<DetalleDocenteConsolidadoResponse>(
    `${RUTA_BASE}/mi-seguimiento`,
    { params: { periodoId } },
  );
  return data;
}

export async function registrarDecisionDirector(
  consolidadoId: string,
  dto: ActualizarDecisionDto,
): Promise<ConsolidadoResumenItem> {
  const { data } = await apiClient.patch<ConsolidadoResumenItem>(
    `${RUTA_BASE}/${consolidadoId}/decision`,
    dto,
  );
  return data;
}

export async function reabrirConsolidado(
  consolidadoId: string,
): Promise<{ consolidado: ConsolidadoResumenItem; mensaje: string }> {
  const { data } = await apiClient.post<{ consolidado: ConsolidadoResumenItem; mensaje: string }>(
    `${RUTA_BASE}/${consolidadoId}/reabrir`,
  );
  return data;
}

export async function cerrarConsolidado(
  consolidadoId: string,
  dto: CerrarConsolidadoDto,
): Promise<{ version: number; mensaje: string }> {
  const { data } = await apiClient.post<{ version: number; mensaje: string }>(
    `${RUTA_BASE}/${consolidadoId}/cerrar`,
    dto,
  );
  return data;
}

export async function obtenerHistorialVersiones(
  consolidadoId: string,
): Promise<HistorialVersionConsolidadoItem[]> {
  const { data } = await apiClient.get<HistorialVersionConsolidadoItem[]>(
    `${RUTA_BASE}/${consolidadoId}/versiones`,
  );
  return data;
}

export async function solicitarRevision(
  consolidadoId: string,
  dto: SolicitarRevisionDto,
): Promise<{ solicitud: SolicitudRevisionItem; mensaje: string }> {
  const { data } = await apiClient.post<{ solicitud: SolicitudRevisionItem; mensaje: string }>(
    `${RUTA_BASE}/${consolidadoId}/solicitar-revision`,
    dto,
  );
  return data;
}

export async function obtenerSolicitudPendiente(
  consolidadoId: string,
): Promise<SolicitudRevisionItem | null> {
  const { data } = await apiClient.get<SolicitudRevisionItem | null>(
    `${RUTA_BASE}/${consolidadoId}/solicitud-pendiente`,
  );
  return data;
}

export async function resolverSolicitudRevision(
  solicitudId: string,
  dto: ResolverSolicitudRevisionDto,
): Promise<{ solicitud: SolicitudRevisionItem; mensaje: string }> {
  const { data } = await apiClient.post<{ solicitud: SolicitudRevisionItem; mensaje: string }>(
    `${RUTA_BASE}/solicitudes/${solicitudId}/resolver`,
    dto,
  );
  return data;
}

export async function descargarFichaPdf(consolidadoId: string): Promise<Blob> {
  const { data } = await apiClient.get<Blob>(`${RUTA_BASE}/${consolidadoId}/ficha-pdf`, {
    responseType: "blob",
  });
  return data;
}

export async function exportarExcel(periodoId: string): Promise<Blob> {
  const { data } = await apiClient.get<Blob>(`${RUTA_BASE}/periodo/${periodoId}/excel`, {
    responseType: "blob",
  });
  return data;
}
