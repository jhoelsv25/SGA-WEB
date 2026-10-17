import { apiClient, handleApiError } from "@/lib/api-client";
import { SESIONES_ENDPOINTS } from "../consts";
import type {
  CredencialesKiosko,
  MensajeSesion,
  MisSesiones,
  PanelSesiones,
  Sesion,
  SesionesKiosko,
} from "../types";
import { cabeceraKiosko } from "../utils";

export async function getPanelSesionesHoy(): Promise<PanelSesiones> {
  try {
    const { data } = await apiClient.get<PanelSesiones>(SESIONES_ENDPOINTS.HOY);
    return data;
  } catch (error) {
    handleApiError(error, "Error al cargar el panel de sesiones de hoy.");
  }
}

export async function getJustificacionesSolicitadas(): Promise<Sesion[]> {
  try {
    const { data } = await apiClient.get<Sesion[]>(SESIONES_ENDPOINTS.JUSTIFICACIONES);
    return data;
  } catch (error) {
    handleApiError(error, "Error al obtener las justificaciones solicitadas.");
  }
}

export async function getMisSesiones(desde: string, hasta: string): Promise<MisSesiones> {
  try {
    const { data } = await apiClient.get<MisSesiones>(SESIONES_ENDPOINTS.MIS_SESIONES, {
      params: { desde, hasta },
    });
    return data;
  } catch (error) {
    handleApiError(error, "Error al cargar sus sesiones de clase.");
  }
}

export async function asignarReemplazo(id: string, docenteId: string): Promise<Sesion> {
  try {
    const { data } = await apiClient.patch<Sesion>(SESIONES_ENDPOINTS.REEMPLAZO(id), { docenteId });
    return data;
  } catch (error) {
    handleApiError(error, "Error al asignar el docente de reemplazo.");
  }
}

export async function aprobarJustificacion(id: string): Promise<MensajeSesion> {
  try {
    const { data } = await apiClient.patch<MensajeSesion>(
      SESIONES_ENDPOINTS.APROBAR_JUSTIFICACION(id),
    );
    return data;
  } catch (error) {
    handleApiError(error, "Error al aprobar la justificación.");
  }
}

export async function rechazarJustificacion(
  id: string,
  comentario: string,
): Promise<MensajeSesion> {
  try {
    const { data } = await apiClient.patch<MensajeSesion>(
      SESIONES_ENDPOINTS.RECHAZAR_JUSTIFICACION(id),
      { comentario },
    );
    return data;
  } catch (error) {
    handleApiError(error, "Error al rechazar la justificación.");
  }
}

export async function corregirTema(id: string, tema: string): Promise<Sesion> {
  try {
    const { data } = await apiClient.patch<Sesion>(SESIONES_ENDPOINTS.CORREGIR_TEMA(id), { tema });
    return data;
  } catch (error) {
    handleApiError(error, "Error al corregir el tema de la sesión.");
  }
}

export async function solicitarJustificacion(
  id: string,
  payload: { motivo: string; documentoUrl?: string },
): Promise<MensajeSesion> {
  try {
    const { data } = await apiClient.post<MensajeSesion>(
      SESIONES_ENDPOINTS.SOLICITAR_JUSTIFICACION(id),
      payload,
    );
    return data;
  } catch (error) {
    handleApiError(error, "Error al solicitar la justificación de la sesión.");
  }
}

// --- Kiosko de Sesiones (sin sesión de usuario)

export async function sesionesEnKiosko(
  token: string,
  credenciales: CredencialesKiosko,
): Promise<SesionesKiosko> {
  try {
    const { data } = await apiClient.post<SesionesKiosko>(
      SESIONES_ENDPOINTS.KIOSKO_SESIONES,
      credenciales,
      cabeceraKiosko(token),
    );
    return data;
  } catch (error) {
    handleApiError(error, "Error al consultar las sesiones en el kiosko.");
  }
}

export async function firmarIngreso(
  token: string,
  sesionId: string,
  payload: CredencialesKiosko & { tema: string },
): Promise<MensajeSesion> {
  try {
    const { data } = await apiClient.post<MensajeSesion>(
      SESIONES_ENDPOINTS.KIOSKO_INGRESO(sesionId),
      payload,
      cabeceraKiosko(token),
    );
    return data;
  } catch (error) {
    handleApiError(error, "Error al registrar la firma de ingreso.");
  }
}

export async function firmarSalida(
  token: string,
  sesionId: string,
  credenciales: CredencialesKiosko,
): Promise<MensajeSesion> {
  try {
    const { data } = await apiClient.post<MensajeSesion>(
      SESIONES_ENDPOINTS.KIOSKO_SALIDA(sesionId),
      credenciales,
      cabeceraKiosko(token),
    );
    return data;
  } catch (error) {
    handleApiError(error, "Error al registrar la firma de salida.");
  }
}
