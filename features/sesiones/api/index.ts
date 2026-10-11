import { apiClient } from "@/lib/api-client";
import type {
  CredencialesKiosko,
  MensajeSesion,
  MisSesiones,
  PanelSesiones,
  Sesion,
  SesionesKiosko,
} from "../types";

const BASE = "/sesiones-clase";
const cabeceraKiosko = (token: string) => ({ headers: { "x-kiosk-token": token } });

export async function getPanelSesionesHoy(): Promise<PanelSesiones> {
  const { data } = await apiClient.get<PanelSesiones>(`${BASE}/hoy`);
  return data;
}

export async function getJustificacionesSolicitadas(): Promise<Sesion[]> {
  const { data } = await apiClient.get<Sesion[]>(`${BASE}/justificaciones`);
  return data;
}

export async function getMisSesiones(desde: string, hasta: string): Promise<MisSesiones> {
  const { data } = await apiClient.get<MisSesiones>(`${BASE}/mis-sesiones`, {
    params: { desde, hasta },
  });
  return data;
}

export async function asignarReemplazo(id: string, docenteId: string): Promise<Sesion> {
  const { data } = await apiClient.patch<Sesion>(`${BASE}/${id}/reemplazo`, { docenteId });
  return data;
}

export async function aprobarJustificacion(id: string): Promise<MensajeSesion> {
  const { data } = await apiClient.patch<MensajeSesion>(`${BASE}/${id}/justificacion/aprobar`);
  return data;
}

export async function rechazarJustificacion(
  id: string,
  comentario: string,
): Promise<MensajeSesion> {
  const { data } = await apiClient.patch<MensajeSesion>(`${BASE}/${id}/justificacion/rechazar`, {
    comentario,
  });
  return data;
}

export async function corregirTema(id: string, tema: string): Promise<Sesion> {
  const { data } = await apiClient.patch<Sesion>(`${BASE}/${id}/tema`, { tema });
  return data;
}

export async function solicitarJustificacion(
  id: string,
  payload: { motivo: string; documentoUrl?: string },
): Promise<MensajeSesion> {
  const { data } = await apiClient.post<MensajeSesion>(`${BASE}/${id}/justificacion`, payload);
  return data;
}

// --- Kiosko de Sesiones (sin sesión de usuario)

export async function sesionesEnKiosko(
  token: string,
  credenciales: CredencialesKiosko,
): Promise<SesionesKiosko> {
  const { data } = await apiClient.post<SesionesKiosko>(
    `${BASE}/kiosko/sesiones`,
    credenciales,
    cabeceraKiosko(token),
  );
  return data;
}

export async function firmarIngreso(
  token: string,
  sesionId: string,
  payload: CredencialesKiosko & { tema: string },
): Promise<MensajeSesion> {
  const { data } = await apiClient.post<MensajeSesion>(
    `${BASE}/kiosko/${sesionId}/ingreso`,
    payload,
    cabeceraKiosko(token),
  );
  return data;
}

export async function firmarSalida(
  token: string,
  sesionId: string,
  credenciales: CredencialesKiosko,
): Promise<MensajeSesion> {
  const { data } = await apiClient.post<MensajeSesion>(
    `${BASE}/kiosko/${sesionId}/salida`,
    credenciales,
    cabeceraKiosko(token),
  );
  return data;
}
