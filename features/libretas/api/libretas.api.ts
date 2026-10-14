import { apiClient } from "@/lib/api-client";
import type {
  AlcanceLibreta,
  AlcanceRol,
  AsignacionManual,
  ContextoLibretas,
  DetalleLibreta,
  HistorialLibreta,
  MiLibreta,
  ResultadoProgramacion,
  ResultadoPublicacion,
  SeguimientoSeccion,
  VistaPreviaLibretas,
} from "../types";

const BASE = "/libretas";

function aFormData(
  seccionId: string,
  periodoId: string,
  archivos: File[],
  asignaciones?: AsignacionManual[],
) {
  const formulario = new FormData();
  formulario.append("seccionId", seccionId);
  formulario.append("periodoId", periodoId);
  for (const archivo of archivos) {
    formulario.append("archivos", archivo);
  }
  if (asignaciones && asignaciones.length > 0) {
    formulario.append("asignaciones", JSON.stringify(asignaciones));
  }
  return formulario;
}

export async function getContextoLibretas(): Promise<ContextoLibretas> {
  const { data } = await apiClient.get<ContextoLibretas>(`${BASE}/contexto`);
  return data;
}

export async function programarLibretas(
  periodoId: string,
  fechaLimite: string,
): Promise<ResultadoProgramacion> {
  const { data } = await apiClient.post<ResultadoProgramacion>(`${BASE}/programar`, {
    periodoId,
    fechaLimite,
  });
  return data;
}

export async function cambiarFechaLibretas(
  periodoId: string,
  fechaLimite: string,
): Promise<{ actualizadas: number; fechaLimite: string }> {
  const { data } = await apiClient.patch<{ actualizadas: number; fechaLimite: string }>(
    `${BASE}/programaciones/${periodoId}`,
    { fechaLimite },
  );
  return data;
}

export async function vistaPreviaLibretas(
  seccionId: string,
  periodoId: string,
  archivos: File[],
): Promise<VistaPreviaLibretas> {
  const { data } = await apiClient.post<VistaPreviaLibretas>(
    `${BASE}/vista-previa`,
    aFormData(seccionId, periodoId, archivos),
    { timeout: 120_000 },
  );
  return data;
}

export async function publicarLibretas(
  seccionId: string,
  periodoId: string,
  archivos: File[],
  asignaciones: AsignacionManual[],
): Promise<ResultadoPublicacion> {
  const { data } = await apiClient.post<ResultadoPublicacion>(
    `${BASE}/publicar`,
    aFormData(seccionId, periodoId, archivos, asignaciones),
    { timeout: 120_000 },
  );
  return data;
}

export async function getAlcancesLibretas(): Promise<AlcanceRol[]> {
  const { data } = await apiClient.get<AlcanceRol[]>(`${BASE}/alcances`);
  return data;
}

export async function cambiarAlcanceLibretas(
  rolId: string,
  alcance: AlcanceLibreta,
): Promise<{ rolId: string; alcance: AlcanceLibreta }> {
  const { data } = await apiClient.patch<{ rolId: string; alcance: AlcanceLibreta }>(
    `${BASE}/alcances`,
    { rolId, alcance },
  );
  return data;
}

export async function getSeguimientoLibretas(
  periodoId: string,
): Promise<{ secciones: SeguimientoSeccion[] }> {
  const { data } = await apiClient.get<{ secciones: SeguimientoSeccion[] }>(`${BASE}/seguimiento`, {
    params: { periodoId },
  });
  return data;
}

export async function getDetalleLibretas(
  seccionId: string,
  periodoId: string,
): Promise<DetalleLibreta[]> {
  const { data } = await apiClient.get<DetalleLibreta[]>(`${BASE}/seguimiento/${seccionId}`, {
    params: { periodoId },
  });
  return data;
}

export async function getMisLibretas(): Promise<{ libretas: MiLibreta[] }> {
  const { data } = await apiClient.get<{ libretas: MiLibreta[] }>(`${BASE}/mias`);
  return data;
}

export async function getHistorialLibreta(id: string): Promise<HistorialLibreta> {
  const { data } = await apiClient.get<HistorialLibreta>(`${BASE}/${id}/historial`);
  return data;
}

export async function abrirLibreta(id: string): Promise<void> {
  const { data } = await apiClient.get<Blob>(`${BASE}/${id}/archivo`, { responseType: "blob" });
  const url = URL.createObjectURL(data);
  window.open(url, "_blank", "noopener,noreferrer");
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
