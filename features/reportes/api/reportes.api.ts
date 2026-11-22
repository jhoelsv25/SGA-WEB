import { apiClient } from "@/lib/api-client";
import { HEADER_ANIO_ACADEMICO } from "@/features/anio-escolar/anio-lectivo-activo";
import type { SolicitarReportePayload, TrabajoReporteItem } from "../types";

function extraerNombreArchivo(header: unknown, fallback: string): string {
  if (typeof header === "string") {
    const match = /filename="?([^";]+)"?/i.exec(header);
    if (match?.[1]) return match[1];
  }
  return fallback;
}

export async function descargarArchivoReporte(opciones: {
  url: string;
  params?: Record<string, string | undefined>;
  anioAcademicoId?: string;
  nombrePorDefecto: string;
}): Promise<string> {
  const paramsLimpios: Record<string, string> = {};
  for (const [k, v] of Object.entries(opciones.params ?? {})) {
    if (v && v !== "all") paramsLimpios[k] = v;
  }

  const response = await apiClient.get<Blob>(opciones.url, {
    params: Object.keys(paramsLimpios).length > 0 ? paramsLimpios : undefined,
    headers: opciones.anioAcademicoId
      ? { [HEADER_ANIO_ACADEMICO]: opciones.anioAcademicoId }
      : undefined,
    responseType: "blob",
    timeout: 60000,
  });

  const nombre = extraerNombreArchivo(
    response.headers["content-disposition"],
    opciones.nombrePorDefecto,
  );
  const urlObjeto = window.URL.createObjectURL(response.data);
  const link = document.createElement("a");
  link.href = urlObjeto;
  link.download = nombre;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(urlObjeto);
  return nombre;
}

export function descargarMatriculasExcel(
  params?: {
    anioAcademicoId?: string;
    gradoId?: string;
    seccionId?: string;
    tipo?: string;
    estado?: string;
    search?: string;
  },
  anioHeaderId?: string,
) {
  return descargarArchivoReporte({
    url: "/exportacion/matriculas",
    params,
    anioAcademicoId: anioHeaderId ?? params?.anioAcademicoId,
    nombrePorDefecto: "sga_matriculas.xlsx",
  });
}

export function descargarMarcacionesExcel(
  params: {
    periodoId?: string;
    desde?: string;
    hasta?: string;
    seccionId?: string;
    tipoPersona?: string;
  },
  anioHeaderId?: string,
) {
  return descargarArchivoReporte({
    url: "/exportacion/marcaciones",
    params,
    anioAcademicoId: anioHeaderId,
    nombrePorDefecto: "sga_marcaciones.xlsx",
  });
}

export function descargarLibretasExcel(
  params: { periodoId: string; gradoId?: string; seccionId?: string },
  anioHeaderId?: string,
) {
  return descargarArchivoReporte({
    url: "/exportacion/libretas",
    params,
    anioAcademicoId: anioHeaderId,
    nombrePorDefecto: "sga_libretas.xlsx",
  });
}

export function descargarAsistenciaSeccionExcel(
  params: {
    gradoId?: string;
    seccionId?: string;
    periodoId?: string;
    desde?: string;
    hasta?: string;
  },
  anioHeaderId?: string,
) {
  return descargarArchivoReporte({
    url: "/exportacion/asistencia-seccion",
    params,
    anioAcademicoId: anioHeaderId,
    nombrePorDefecto: "sga_asistencia-seccion.xlsx",
  });
}

export async function encolarReporte(
  payload: SolicitarReportePayload,
): Promise<TrabajoReporteItem> {
  const limpio: Record<string, string> = { tipo: payload.tipo };
  for (const [k, v] of Object.entries(payload)) {
    if (k !== "tipo" && typeof v === "string" && v && v !== "all") {
      limpio[k] = v;
    }
  }
  const response = await apiClient.post<TrabajoReporteItem>("/exportacion/trabajos", limpio, {
    headers: payload.anioAcademicoId
      ? { [HEADER_ANIO_ACADEMICO]: payload.anioAcademicoId }
      : undefined,
  });
  return response.data;
}

export async function listarTrabajosReporte(): Promise<TrabajoReporteItem[]> {
  const response = await apiClient.get<TrabajoReporteItem[]>("/exportacion/trabajos");
  return response.data ?? [];
}

export function descargarTrabajoReporte(jobId: string, nombrePorDefecto: string) {
  return descargarArchivoReporte({
    url: `/exportacion/trabajos/${jobId}/descargar`,
    nombrePorDefecto,
  });
}

export async function eliminarTrabajoReporte(jobId: string): Promise<void> {
  await apiClient.delete(`/exportacion/trabajos/${jobId}`);
}

export async function limpiarTrabajosReporte(): Promise<{ eliminados: number }> {
  const response = await apiClient.delete<{ eliminados: number }>("/exportacion/trabajos");
  return response.data ?? { eliminados: 0 };
}
