export type EstadoComunicado = "borrador" | "publicado" | "archivado";
export type DirigidoA = "todos" | "docentes" | "estudiantes" | "apoderados";
export type PrioridadComunicado = "normal" | "importante" | "urgente";

export interface ComunicadoItem {
  id: string;
  autorId: string;
  autorNombre: string;
  titulo: string;
  contenido: string;
  dirigidoA: DirigidoA;
  gradoId?: string | null;
  gradoNumero?: number | null;
  seccionId?: string | null;
  seccionNombre?: string | null;
  prioridad: PrioridadComunicado;
  estado: EstadoComunicado;
  adjuntoUrl?: string | null;
  publicadoEn?: string | null;
  venceEn?: string | null;
  creadoEn: string;
  totalDestinatarios: number;
  totalLeidos: number;
  porcentajeLectura: number;
  leidoPorMi: boolean;
}

export interface PaginatedComunicadosResponse {
  data: ComunicadoItem[];
  nextCursor: string | null;
  hasMore: boolean;
  limit: number;
}

export interface ComunicadoQueryParams {
  cursor?: string | null;
  soloMios?: boolean;
  estado?: EstadoComunicado | "all";
  dirigidoA?: DirigidoA | "all";
  prioridad?: PrioridadComunicado | "all";
  gradoId?: string;
  seccionId?: string;
  search?: string;
  limit?: number;
}

export interface CrearComunicadoPayload {
  titulo: string;
  contenido: string;
  dirigidoA: DirigidoA;
  gradoId?: string;
  seccionId?: string;
  prioridad?: PrioridadComunicado;
  adjuntoUrl?: string;
  venceEn?: string;
  publicar?: boolean;
}

export interface DestinatarioLecturaItem {
  usuarioId: string;
  nombreCompleto: string;
  tipoDestinatario: "docente" | "estudiante" | "apoderado";
  leido: boolean;
  leidoEn?: string | null;
}

export interface AvanceLecturaResponse {
  comunicadoId: string;
  titulo: string;
  totalDestinatarios: number;
  totalLeidos: number;
  porcentajeLectura: number;
  destinatarios: DestinatarioLecturaItem[];
}
