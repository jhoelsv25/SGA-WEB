import { apiClient, handleApiError } from "@/lib/api-client";
import { SEGUIMIENTO_REPORTES_ENDPOINTS } from "../consts";
import type { ArchivoDescargado, PendientesQueryDto, PendientesResponse } from "../types";
import { pedirExcel } from "./descarga-excel";

export async function obtenerPendientes(query: PendientesQueryDto): Promise<PendientesResponse> {
  try {
    const { data } = await apiClient.get<PendientesResponse>(
      SEGUIMIENTO_REPORTES_ENDPOINTS.PENDIENTES,
      { params: { periodoId: query.periodoId, docenteId: query.docenteId } },
    );
    return data;
  } catch (error) {
    handleApiError(error, "Error al consultar los pendientes de seguimiento.");
  }
}

export async function exportarPendientesExcel(
  query: PendientesQueryDto,
): Promise<ArchivoDescargado> {
  try {
    return await pedirExcel(
      SEGUIMIENTO_REPORTES_ENDPOINTS.PENDIENTES_EXCEL,
      { periodoId: query.periodoId, docenteId: query.docenteId },
      "pendientes-seguimiento.xlsx",
    );
  } catch (error) {
    handleApiError(error, "Error al exportar los pendientes a Excel.");
  }
}

/** El informe se genera y se descarga; el sistema no lo envía a ninguna instancia. */
export async function descargarInformeMensualExcel(mes: string): Promise<ArchivoDescargado> {
  try {
    return await pedirExcel(
      SEGUIMIENTO_REPORTES_ENDPOINTS.INFORME_MENSUAL_EXCEL,
      { mes },
      `informe-horas-efectivas-${mes}.xlsx`,
    );
  } catch (error) {
    handleApiError(error, "Error al generar el informe mensual de horas efectivas.");
  }
}
