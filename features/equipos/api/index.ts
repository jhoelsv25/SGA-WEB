import { apiClient } from "@/lib/api-client";
import type {
  AutorizarEquipoResponse,
  CreateEquipoPayload,
  Equipo,
  EstadoSolicitudKiosko,
  SolicitudKiosko,
  UpdateEquipoPayload,
  ValidarEquipoResponse,
} from "../types";

export interface GetEquiposFilters {
  tipo?: string;
  proposito?: string;
}

export async function getEquipos(filters?: GetEquiposFilters): Promise<Equipo[]> {
  const response = await apiClient.get<Equipo[]>("/equipos", {
    params: filters,
  });
  return response.data;
}

export async function getEquipoById(id: string): Promise<Equipo> {
  const response = await apiClient.get<Equipo>(`/equipos/${id}`);
  return response.data;
}

export async function createEquipo(payload: CreateEquipoPayload): Promise<Equipo> {
  const body = {
    ...payload,
    usuariosPermitidos: Array.isArray(payload.usuariosPermitidos)
      ? payload.usuariosPermitidos.join(",")
      : payload.usuariosPermitidos,
  };
  const response = await apiClient.post<Equipo>("/equipos", body);
  return response.data;
}

export async function updateEquipo(id: string, payload: UpdateEquipoPayload): Promise<Equipo> {
  const body = {
    ...payload,
    ...(payload.usuariosPermitidos !== undefined && {
      usuariosPermitidos: Array.isArray(payload.usuariosPermitidos)
        ? payload.usuariosPermitidos.join(",")
        : payload.usuariosPermitidos,
    }),
  };
  const response = await apiClient.patch<Equipo>(`/equipos/${id}`, body);
  return response.data;
}

export async function autorizarEquipo(id: string): Promise<AutorizarEquipoResponse> {
  const response = await apiClient.post<AutorizarEquipoResponse>(`/equipos/${id}/autorizar`);
  return response.data;
}

export async function validarKiosko(token?: string): Promise<ValidarEquipoResponse> {
  const headers: Record<string, string> = {};
  if (token) {
    headers["x-kiosk-token"] = token;
  }

  const response = await apiClient.get<ValidarEquipoResponse>("/equipos/validar-kiosko", {
    headers,
    params: token ? { token } : undefined,
  });
  return response.data;
}

export async function registrarSolicitudKiosko(secreto: string): Promise<EstadoSolicitudKiosko> {
  const response = await apiClient.post<EstadoSolicitudKiosko>("/solicitudes-kiosko", {
    secreto,
  });
  return response.data;
}

export async function getSolicitudesKiosko(): Promise<SolicitudKiosko[]> {
  const response = await apiClient.get<SolicitudKiosko[]>("/solicitudes-kiosko");
  return response.data;
}

export async function aprobarSolicitudKiosko(id: string, equipoId: string): Promise<void> {
  await apiClient.post(`/solicitudes-kiosko/${id}/aprobar`, { equipoId });
}

export async function rechazarSolicitudKiosko(id: string): Promise<void> {
  await apiClient.post(`/solicitudes-kiosko/${id}/rechazar`);
}
