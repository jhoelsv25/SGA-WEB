import { apiClient, handleApiError } from "@/lib/api-client";
import { SESIONES_ENDPOINTS } from "../consts";
import type {
  CredencialesKiosko,
  DetalleSolicitudJustificacion,
  FiltrosBandejaJustificaciones,
  MensajeSesion,
  MiJornadaHoy,
  MisSesiones,
  MotivoJustificacion,
  PanelSesiones,
  Sesion,
  SesionesKiosko,
  SolicitudJustificacion,
  SolicitudJustificacionPayload,
  SugerirTemaResponse,
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

export async function getJustificacionesSolicitadas(
  filtros: FiltrosBandejaJustificaciones = {},
): Promise<SolicitudJustificacion[]> {
  try {
    const { data } = await apiClient.get<SolicitudJustificacion[]>(
      SESIONES_ENDPOINTS.JUSTIFICACIONES,
      {
        params: {
          ...(filtros.motivo ? { motivo: filtros.motivo } : {}),
          ...(filtros.vencidas ? { vencidas: "true" } : {}),
        },
      },
    );
    return data;
  } catch (error) {
    handleApiError(error, "Error al obtener las justificaciones solicitadas.");
  }
}

export async function getMotivosJustificacion(): Promise<MotivoJustificacion[]> {
  try {
    const { data } = await apiClient.get<MotivoJustificacion[]>(
      SESIONES_ENDPOINTS.MOTIVOS_JUSTIFICACION,
    );
    return data;
  } catch (error) {
    handleApiError(error, "Error al cargar los motivos de justificación.");
  }
}

export async function getDetalleJustificacion(id: string): Promise<DetalleSolicitudJustificacion> {
  try {
    const { data } = await apiClient.get<DetalleSolicitudJustificacion>(
      SESIONES_ENDPOINTS.DETALLE_JUSTIFICACION(id),
    );
    return data;
  } catch (error) {
    handleApiError(error, "Error al cargar el detalle de la solicitud.");
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

export async function getMiJornadaHoy(): Promise<MiJornadaHoy> {
  try {
    const { data } = await apiClient.get<MiJornadaHoy>(SESIONES_ENDPOINTS.MI_JORNADA_HOY);
    return data;
  } catch (error) {
    handleApiError(error, "Error al cargar las sesiones de hoy.");
  }
}

export async function firmarIngresoWeb(
  id: string,
  tema: string,
  crearEnAulaVirtual?: boolean,
): Promise<MensajeSesion> {
  try {
    const { data } = await apiClient.post<MensajeSesion>(SESIONES_ENDPOINTS.FIRMAR_INGRESO(id), {
      tema,
      ...(crearEnAulaVirtual ? { crearEnAulaVirtual: true } : {}),
    });
    return data;
  } catch (error) {
    handleApiError(error, "No se pudo firmar el ingreso de la sesión.");
  }
}

export async function sugerirTemaSesion(
  id: string,
  borrador?: string,
): Promise<SugerirTemaResponse> {
  try {
    const { data } = await apiClient.post<SugerirTemaResponse>(
      SESIONES_ENDPOINTS.SUGERIR_TEMA(id),
      borrador ? { borrador } : {},
    );
    return data;
  } catch (error) {
    handleApiError(error, "No se pudieron obtener sugerencias de tema.");
  }
}

export async function firmarSalidaWeb(id: string): Promise<MensajeSesion> {
  try {
    const { data } = await apiClient.post<MensajeSesion>(SESIONES_ENDPOINTS.FIRMAR_SALIDA(id));
    return data;
  } catch (error) {
    handleApiError(error, "No se pudo firmar la salida de la sesión.");
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

export async function aprobarJustificacion(
  id: string,
  confirmarTope = false,
): Promise<MensajeSesion> {
  try {
    const { data } = await apiClient.patch<MensajeSesion>(
      SESIONES_ENDPOINTS.APROBAR_JUSTIFICACION(id),
      confirmarTope ? { confirmarTope: true } : {},
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
  payload: SolicitudJustificacionPayload,
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
