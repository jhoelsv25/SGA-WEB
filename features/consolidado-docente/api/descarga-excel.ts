import { apiClient } from "@/lib/api-client";
import type { ArchivoDescargado } from "../types";

const XLSX_MIME = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

/**
 * Las descargas piden el archivo como bytes; si el servidor responde con un error en JSON
 * (por ejemplo, un mes sin sesiones), el mensaje llega dentro de esos bytes. Esta
 * transformación lo decodifica para que `apiClient` lo muestre tal cual lo escribió la API.
 */
function decodificarErrorJson(data: unknown, _headers: unknown, status?: number): unknown {
  if (status !== undefined && status >= 400 && data instanceof ArrayBuffer) {
    try {
      return JSON.parse(new TextDecoder().decode(data)) as unknown;
    } catch {
      return data;
    }
  }
  return data;
}

function nombreDeContentDisposition(valor: unknown, respaldo: string): string {
  if (typeof valor !== "string") return respaldo;
  const coincidencia = /filename="?([^";]+)"?/i.exec(valor);
  return coincidencia?.[1] ?? respaldo;
}

export async function pedirExcel(
  url: string,
  params: Record<string, string | undefined>,
  nombreRespaldo: string,
): Promise<ArchivoDescargado> {
  const respuesta = await apiClient.get<ArrayBuffer>(url, {
    params,
    responseType: "arraybuffer",
    transformResponse: [decodificarErrorJson],
  });
  return {
    blob: new Blob([respuesta.data], { type: XLSX_MIME }),
    nombre: nombreDeContentDisposition(respuesta.headers["content-disposition"], nombreRespaldo),
  };
}

export function guardarArchivoEnNavegador({ blob, nombre }: ArchivoDescargado): void {
  if (typeof window === "undefined") return;
  const url = window.URL.createObjectURL(blob);
  const enlace = document.createElement("a");
  enlace.href = url;
  enlace.setAttribute("download", nombre);
  document.body.appendChild(enlace);
  enlace.click();
  enlace.remove();
  window.URL.revokeObjectURL(url);
}
