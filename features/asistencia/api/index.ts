import { apiClient } from "@/lib/api-client";
import type {
  AsistenciaEstudiante,
  AsistenciaSeccion,
  ExcepcionAsistencia,
  EstudianteVinculado,
  GuardarAsistenciaRespuesta,
  ListaAsistenciaSesion,
  RangoFechas,
  SeccionConsultable,
} from "../types";

const BASE = "/asistencia-clase";

export async function getListaSesion(sesionId: string): Promise<ListaAsistenciaSesion> {
  const { data } = await apiClient.get<ListaAsistenciaSesion>(`${BASE}/sesiones/${sesionId}`);
  return data;
}

export async function guardarAsistenciaSesion(
  sesionId: string,
  excepciones: ExcepcionAsistencia[],
): Promise<GuardarAsistenciaRespuesta> {
  const { data } = await apiClient.put<GuardarAsistenciaRespuesta>(`${BASE}/sesiones/${sesionId}`, {
    excepciones,
  });
  return data;
}

export async function justificarFalta(
  id: string,
  payload: { motivo: string; documentoUrl?: string },
): Promise<void> {
  await apiClient.patch(`${BASE}/${id}/justificar`, payload);
}

export async function getMisSecciones(): Promise<SeccionConsultable[]> {
  const { data } = await apiClient.get<SeccionConsultable[]>(`${BASE}/mis-secciones`);
  return data;
}

export async function getMisEstudiantes(): Promise<EstudianteVinculado[]> {
  const { data } = await apiClient.get<EstudianteVinculado[]>(`${BASE}/mis-estudiantes`);
  return data;
}

export async function getAsistenciaEstudiante(
  estudianteId: string,
  rango: RangoFechas,
): Promise<AsistenciaEstudiante> {
  const { data } = await apiClient.get<AsistenciaEstudiante>(
    `${BASE}/estudiantes/${estudianteId}`,
    { params: rango },
  );
  return data;
}

export async function getAsistenciaSeccion(
  seccionId: string,
  rango: RangoFechas,
): Promise<AsistenciaSeccion> {
  const { data } = await apiClient.get<AsistenciaSeccion>(`${BASE}/secciones/${seccionId}`, {
    params: rango,
  });
  return data;
}
