import { guardarArchivoEnNavegador } from "@/features/consolidado-docente/api/descarga-excel";
import { apiClient } from "@/lib/api-client";
import type { NuevaJustificacion, Justificacion, PersonaDelReporte, ReporteUgel } from "./types";

export async function getReporteUgel(mes: string): Promise<ReporteUgel> {
  const { data } = await apiClient.get<ReporteUgel>("/asistencia-ugel/reporte", {
    params: { mes },
  });
  return data;
}

export async function getJustificaciones(mes: string): Promise<Justificacion[]> {
  const { data } = await apiClient.get<Justificacion[]>("/asistencia-ugel/novedades", {
    params: { mes },
  });
  return data;
}

export async function getPersonasDelReporte(mes: string): Promise<PersonaDelReporte[]> {
  const { data } = await apiClient.get<PersonaDelReporte[]>("/asistencia-ugel/personas", {
    params: { mes },
  });
  return data;
}

export async function crearJustificacion(
  payload: NuevaJustificacion,
): Promise<{ mensaje: string }> {
  const { data } = await apiClient.post<{ mensaje: string }>("/asistencia-ugel/novedades", payload);
  return data;
}

export async function anularJustificacion(
  id: string,
  motivo: string,
): Promise<{ mensaje: string }> {
  const { data } = await apiClient.patch<{ mensaje: string }>(
    `/asistencia-ugel/novedades/${id}/anular`,
    { motivo },
  );
  return data;
}

/** Si la API responde con error, su mensaje llega dentro de los bytes: se decodifica. */
function errorEnJson(data: unknown, _headers: unknown, status?: number): unknown {
  if (status !== undefined && status >= 400 && data instanceof ArrayBuffer) {
    try {
      return JSON.parse(new TextDecoder().decode(data)) as unknown;
    } catch {
      return data;
    }
  }
  return data;
}

export async function descargarAnexos(mes: string, formato: "pdf" | "xlsx"): Promise<void> {
  const { data } = await apiClient.get<ArrayBuffer>(
    `/asistencia-ugel/reporte/documento.${formato}`,
    { params: { mes }, responseType: "arraybuffer", transformResponse: [errorEnJson] },
  );
  const tipo =
    formato === "pdf"
      ? "application/pdf"
      : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  guardarArchivoEnNavegador({
    blob: new Blob([data], { type: tipo }),
    nombre: `asistencia-ugel-${mes}.${formato}`,
  });
}
