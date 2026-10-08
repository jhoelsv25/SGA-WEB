import { apiClient } from "@/lib/api-client";
import type { AuditDetail, PaginatedAuditResponse, QueryAuditParams } from "../types/audit.types";

export const auditApi = {
  /**
   * Obtiene registros paginados de la bitácora de auditoría con filtros.
   */
  async getAuditLogs(params: QueryAuditParams = {}): Promise<PaginatedAuditResponse> {
    const cleanParams: Record<string, unknown> = {};

    if (params.cursor) cleanParams.cursor = params.cursor;
    if (params.limit) cleanParams.limit = params.limit;
    if (params.fechaInicio) cleanParams.fechaInicio = params.fechaInicio;
    if (params.fechaFin) cleanParams.fechaFin = params.fechaFin;
    if (params.usuario) cleanParams.usuario = params.usuario;
    if (params.accion && params.accion !== "all") cleanParams.accion = params.accion;
    if (params.entidad && params.entidad !== "all") cleanParams.entidad = params.entidad;

    const response = await apiClient.get<PaginatedAuditResponse>("/audit", {
      params: cleanParams,
    });
    return response.data;
  },

  /**
   * Obtiene el detalle completo y comparativo antes/después de un evento.
   */
  async getAuditDetail(id: number): Promise<AuditDetail> {
    const response = await apiClient.get<AuditDetail>(`/audit/${id}`);
    return response.data;
  },
};
