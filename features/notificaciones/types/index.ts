export type TipoNotificacion = "informacion" | "alerta" | "recordatorio";

export interface NotificacionItem {
  id: string;
  usuarioId: string;
  titulo: string;
  mensaje: string;
  tipo: TipoNotificacion;
  enlaceUrl: string | null;
  comunicadoId: string | null;
  sesionClaseId: string | null;
  leida: boolean;
  leidaEn: string | null;
  creadoEn: string;
}

export type EstadoNotificacionFiltro = "all" | "no_leidas" | "leidas";

export interface NotificacionQueryParams {
  cursor?: string | null;
  soloNoLeidas?: boolean;
  estado?: EstadoNotificacionFiltro;
  tipo?: TipoNotificacion | "all";
  search?: string;
  limit?: number;
}

export interface PaginatedNotificacionesResponse {
  data: NotificacionItem[];
  unreadCount: number;
  nextCursor: string | null;
  hasMore: boolean;
  limit: number;
}
