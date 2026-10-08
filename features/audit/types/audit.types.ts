export type AuditActionType =
  "crear" | "actualizar" | "eliminar" | "iniciar_sesion" | "cerrar_sesion";

export interface AuditLogItem {
  id: number;
  registradoEn: string;
  usuarioId: string | null;
  usuario: string;
  accion: AuditActionType | string;
  entidad: string;
  registroId: string | null;
  direccionIp: string | null;
}

export interface AuditDiffField {
  campo: string;
  valorAnterior: unknown;
  valorNuevo: unknown;
}

export interface AuditDetail {
  id: number;
  registradoEn: string;
  usuarioId: string | null;
  usuario: string;
  accion: AuditActionType | string;
  entidad: string;
  registroId: string | null;
  direccionIp: string | null;
  valorAnterior: Record<string, unknown> | null;
  valorNuevo: Record<string, unknown> | null;
  diferencias: AuditDiffField[];
}

export interface QueryAuditParams {
  fechaInicio?: string;
  fechaFin?: string;
  usuario?: string;
  accion?: string;
  entidad?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedAuditResponse {
  data: AuditLogItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
