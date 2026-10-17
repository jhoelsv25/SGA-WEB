import { apiClient } from "@/lib/api-client";
import type { DashboardFiltrosParams, DashboardResponse } from "../types/dashboard.types";

export async function getDashboardResumen(
  params?: DashboardFiltrosParams,
): Promise<DashboardResponse> {
  const queryParams: Record<string, string> = {};

  if (params?.anioAcademicoId) queryParams.anioAcademicoId = params.anioAcademicoId;
  if (params?.periodoId) queryParams.periodoId = params.periodoId;
  if (params?.fechaDesde) queryParams.fechaDesde = params.fechaDesde;
  if (params?.fechaHasta) queryParams.fechaHasta = params.fechaHasta;
  if (params?.estudianteId) queryParams.estudianteId = params.estudianteId;

  const response = await apiClient.get<DashboardResponse>("/dashboard/resumen", {
    params: queryParams,
  });

  return response.data;
}
