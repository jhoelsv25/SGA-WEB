import { apiClient, API_BASE_URL } from "@/lib/api-client";
import type {
  CerrarConsolidadoDto,
  CerrarConsolidadoResponseDto,
  ConsolidadoDetalleResponseDto,
  CrearSolicitudRevisionPayload,
  CrearSolicitudRevisionResponseDto,
  FiltroReporteBimestreQueryDto,
  FiltroSolicitudesQueryDto,
  HistorialConsolidadoResponseDto,
  MensajeConsolidadoResponseDto,
  MiConsolidadoResponseDto,
  ReabrirConsolidadoResponseDto,
  RechazarSolicitudDto,
  RegistrarDecisionDto,
  ReporteBimestreResponseDto,
  ResolverSolicitudDto,
  SolicitudRevisionResponseDto,
} from "../types";

const RUTA_BASE_SEGUIMIENTO = "/seguimiento-docente";

/**
 * Resuelve la URL completa para previsualizar o descargar evidencias fotográficas o adjuntos.
 * Los adjuntos se sirven desde el backend en `/uploads/...` sin el prefijo `/api`.
 */
export function urlDeAdjunto(url?: string | null): string {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("blob:")) {
    return url;
  }
  const baseUrlSinApi = API_BASE_URL.replace(/\/api\/?$/, "");
  const rutaLimpia = url.startsWith("/") ? url : `/${url}`;
  return `${baseUrlSinApi}${rutaLimpia}`;
}

/**
 * Helper privado para disparar la descarga de un blob en el navegador de forma limpia.
 */
function dispararDescargaNavegador(blob: Blob, nombreArchivo: string): void {
  if (typeof window === "undefined") return;
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = nombreArchivo;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

// ========================================================
// 1. GENERACIÓN Y GESTIÓN DIRECTIVA (Director / Administrador)
// ========================================================

/**
 * HU1: Genera el consolidado masivo para todos los docentes con sesiones en el bimestre.
 */
export async function generarTodosConsolidados(
  periodoId: string,
): Promise<MensajeConsolidadoResponseDto> {
  const { data } = await apiClient.post<MensajeConsolidadoResponseDto>(
    `${RUTA_BASE_SEGUIMIENTO}/periodos/${periodoId}/generar-todos`,
  );
  return data;
}

/**
 * HU1: Genera el consolidado individual para un docente específico en el bimestre.
 */
export async function generarConsolidadoDocente(
  periodoId: string,
  docenteId: string,
): Promise<ConsolidadoDetalleResponseDto> {
  const { data } = await apiClient.post<ConsolidadoDetalleResponseDto>(
    `${RUTA_BASE_SEGUIMIENTO}/periodos/${periodoId}/docentes/${docenteId}/generar`,
  );
  return data;
}

/**
 * HU4: Obtiene el reporte consolidado de todos los docentes del bimestre (ordenable).
 */
export async function getReporteBimestre(
  periodoId: string,
  query?: FiltroReporteBimestreQueryDto,
): Promise<ReporteBimestreResponseDto> {
  const { data } = await apiClient.get<ReporteBimestreResponseDto>(
    `${RUTA_BASE_SEGUIMIENTO}/periodos/${periodoId}/reporte`,
    { params: query },
  );
  return data;
}

/**
 * HU4: Exporta el reporte consolidado de todos los docentes del bimestre a Excel (.xlsx).
 * Dispara automáticamente la descarga en el navegador y retorna el Blob binario.
 */
export async function exportarReporteExcel(
  periodoId: string,
  nombreArchivo?: string,
): Promise<Blob> {
  const response = await apiClient.get(`${RUTA_BASE_SEGUIMIENTO}/periodos/${periodoId}/exportar`, {
    responseType: "blob",
  });
  const blob = new Blob([response.data], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  dispararDescargaNavegador(blob, nombreArchivo || `reporte-seguimiento-${periodoId}.xlsx`);
  return blob;
}

/**
 * HU4: Descarga la ficha de seguimiento docente oficial en PDF con sesiones, ausencias y firmas.
 * Dispara automáticamente la descarga en el navegador y retorna el Blob binario.
 */
export async function descargarFichaPdf(id: string, nombreArchivo?: string): Promise<Blob> {
  const response = await apiClient.get(`${RUTA_BASE_SEGUIMIENTO}/${id}/ficha`, {
    responseType: "blob",
  });
  const blob = new Blob([response.data], { type: "application/pdf" });
  dispararDescargaNavegador(blob, nombreArchivo || `ficha-seguimiento-${id}.pdf`);
  return blob;
}

/**
 * HU4: Obtiene la URL de objeto Blob para previsualizar la ficha PDF en un iframe o visor embebido.
 */
export async function obtenerFichaPdfBlobUrl(id: string): Promise<string> {
  const response = await apiClient.get(`${RUTA_BASE_SEGUIMIENTO}/${id}/ficha`, {
    responseType: "blob",
  });
  const blob = new Blob([response.data], { type: "application/pdf" });
  return window.URL.createObjectURL(blob);
}

/**
 * HU2: Consulta el historial completo de versiones de un consolidado (Director / Subdirector).
 */
export async function getHistorialConsolidado(
  id: string,
): Promise<HistorialConsolidadoResponseDto> {
  const { data } = await apiClient.get<HistorialConsolidadoResponseDto>(
    `${RUTA_BASE_SEGUIMIENTO}/${id}/historial`,
  );
  return data;
}

/**
 * HU1: Registra o actualiza la decisión directiva y observación del Director.
 */
export async function registrarDecisionConsolidado(
  id: string,
  dto: RegistrarDecisionDto,
): Promise<ConsolidadoDetalleResponseDto> {
  const { data } = await apiClient.patch<ConsolidadoDetalleResponseDto>(
    `${RUTA_BASE_SEGUIMIENTO}/${id}/decision`,
    dto,
  );
  return data;
}

/**
 * HU2: Reabre un consolidado cerrado permitiendo corregir sesiones y ausencias.
 */
export async function reabrirConsolidado(id: string): Promise<ReabrirConsolidadoResponseDto> {
  const { data } = await apiClient.post<ReabrirConsolidadoResponseDto>(
    `${RUTA_BASE_SEGUIMIENTO}/${id}/reabrir`,
  );
  return data;
}

/**
 * HU2: Vuelve a cerrar un consolidado reabierto creando una versión nueva e invalidando la anterior.
 */
export async function cerrarConsolidado(
  id: string,
  dto: CerrarConsolidadoDto,
): Promise<CerrarConsolidadoResponseDto> {
  const { data } = await apiClient.post<CerrarConsolidadoResponseDto>(
    `${RUTA_BASE_SEGUIMIENTO}/${id}/cerrar`,
    dto,
  );
  return data;
}

/**
 * HU1, HU4: Consulta el detalle completo de un consolidado con sus sesiones y ausencias.
 */
export async function getDetalleConsolidado(id: string): Promise<ConsolidadoDetalleResponseDto> {
  const { data } = await apiClient.get<ConsolidadoDetalleResponseDto>(
    `${RUTA_BASE_SEGUIMIENTO}/${id}`,
  );
  return data;
}

// ========================================================
// 2. SOLICITUDES DE REVISIÓN (Director)
// ========================================================

/**
 * HU3: Lista las solicitudes de revisión para el Director (filtrables por periodo y estado).
 */
export async function getSolicitudesRevision(
  query?: FiltroSolicitudesQueryDto,
): Promise<SolicitudRevisionResponseDto[]> {
  const { data } = await apiClient.get<SolicitudRevisionResponseDto[]>(
    `${RUTA_BASE_SEGUIMIENTO}/solicitudes`,
    { params: query },
  );
  return data;
}

/**
 * HU3: El Director acepta la solicitud de revisión, reabriendo automáticamente el consolidado.
 */
export async function aceptarSolicitudRevision(
  id: string,
  dto?: ResolverSolicitudDto,
): Promise<SolicitudRevisionResponseDto> {
  const { data } = await apiClient.patch<SolicitudRevisionResponseDto>(
    `${RUTA_BASE_SEGUIMIENTO}/solicitudes/${id}/aceptar`,
    dto ?? {},
  );
  return data;
}

/**
 * HU3: El Director rechaza la solicitud de revisión con respuesta obligatoria.
 */
export async function rechazarSolicitudRevision(
  id: string,
  dto: RechazarSolicitudDto,
): Promise<SolicitudRevisionResponseDto> {
  const { data } = await apiClient.patch<SolicitudRevisionResponseDto>(
    `${RUTA_BASE_SEGUIMIENTO}/solicitudes/${id}/rechazar`,
    dto,
  );
  return data;
}

// ========================================================
// 3. MI SEGUIMIENTO DOCENTE (Docente autenticado)
// ========================================================

/**
 * HU3: Consulta el consolidado vigente del docente autenticado en el bimestre (sin historial).
 */
export async function getMiConsolidado(periodoId: string): Promise<MiConsolidadoResponseDto> {
  const { data } = await apiClient.get<MiConsolidadoResponseDto>(
    `${RUTA_BASE_SEGUIMIENTO}/mi-seguimiento/periodos/${periodoId}`,
  );
  return data;
}

/**
 * HU3: El docente registra una solicitud de revisión sobre su consolidado con adjunto opcional.
 */
export async function crearSolicitudRevision(
  payload: CrearSolicitudRevisionPayload,
): Promise<CrearSolicitudRevisionResponseDto> {
  const formulario = new FormData();
  formulario.append("consolidadoId", payload.datos.consolidadoId);
  formulario.append("motivo", payload.datos.motivo.trim());

  if (payload.adjunto) {
    formulario.append("adjunto", payload.adjunto);
  }

  const { data } = await apiClient.post<CrearSolicitudRevisionResponseDto>(
    `${RUTA_BASE_SEGUIMIENTO}/mis-solicitudes`,
    formulario,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return data;
}
