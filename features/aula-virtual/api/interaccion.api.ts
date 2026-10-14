import { apiClient } from "@/lib/api-client";
import { aFormData } from "./aula-virtual.api";
import type {
  ActividadMaterialEstudiante,
  ActividadTareaEstudiante,
  ComentarioMuro,
  HistorialModeracion,
  MensajeChat,
  PublicacionMuro,
  TipoModeracion,
} from "../types";

const BASE = "/aula-virtual";

// ── RF-017: Interacción y Actividad ──

// ── Muro ──

export async function getPublicacionesMuro(cursoSeccionId: string): Promise<PublicacionMuro[]> {
  const { data } = await apiClient.get<PublicacionMuro[]>(`${BASE}/cursos/${cursoSeccionId}/muro`);
  return data;
}

export async function crearPublicacionMuro(
  cursoSeccionId: string,
  payload: { contenido?: string; enlaceAdjunto?: string },
  archivo?: File | null,
): Promise<PublicacionMuro> {
  const formData = aFormData(payload, archivo);
  const { data } = await apiClient.post<PublicacionMuro>(
    `${BASE}/cursos/${cursoSeccionId}/muro`,
    formData,
  );
  return data;
}

export async function editarPublicacionMuro(
  id: string,
  payload: { contenido?: string; enlaceAdjunto?: string },
  archivo?: File | null,
): Promise<PublicacionMuro> {
  const formData = aFormData(payload, archivo);
  const { data } = await apiClient.patch<PublicacionMuro>(
    `${BASE}/muro/publicaciones/${id}`,
    formData,
  );
  return data;
}

export async function fijarPublicacionMuro(id: string, fijada: boolean): Promise<PublicacionMuro> {
  const { data } = await apiClient.patch<PublicacionMuro>(
    `${BASE}/muro/publicaciones/${id}/fijar`,
    { fijada },
  );
  return data;
}

// ── Comentarios ──

export async function getComentariosMuro(publicacionId: string): Promise<ComentarioMuro[]> {
  const { data } = await apiClient.get<ComentarioMuro[]>(
    `${BASE}/muro/publicaciones/${publicacionId}/comentarios`,
  );
  return data;
}

export async function crearComentarioMuro(
  publicacionId: string,
  contenido: string,
): Promise<ComentarioMuro> {
  const { data } = await apiClient.post<ComentarioMuro>(
    `${BASE}/muro/publicaciones/${publicacionId}/comentarios`,
    { contenido },
  );
  return data;
}

export async function editarComentarioMuro(id: string, contenido: string): Promise<ComentarioMuro> {
  const { data } = await apiClient.patch<ComentarioMuro>(`${BASE}/muro/comentarios/${id}`, {
    contenido,
  });
  return data;
}

// ── Chat Grupal ──

export async function getMensajesChat(cursoSeccionId: string): Promise<MensajeChat[]> {
  const { data } = await apiClient.get<MensajeChat[]>(`${BASE}/cursos/${cursoSeccionId}/chat`);
  return data;
}

export async function enviarMensajeChat(
  cursoSeccionId: string,
  payload: { mensaje?: string; enlaceAdjunto?: string },
  archivo?: File | null,
): Promise<MensajeChat> {
  const formData = aFormData(payload, archivo);
  const { data } = await apiClient.post<MensajeChat>(
    `${BASE}/cursos/${cursoSeccionId}/chat`,
    formData,
  );
  return data;
}

export async function getChatNoLeidos(cursoSeccionId: string): Promise<{ noLeidos: number }> {
  const { data } = await apiClient.get<{ noLeidos: number }>(
    `${BASE}/cursos/${cursoSeccionId}/chat/no-leidos`,
  );
  return data;
}

export async function marcarChatLeido(cursoSeccionId: string): Promise<void> {
  await apiClient.post(`${BASE}/cursos/${cursoSeccionId}/chat/marcar-leido`);
}

// ── Moderación ──

export async function ocultarContenido(
  tipo: TipoModeracion,
  id: string,
  motivo: string,
): Promise<{ mensaje: string }> {
  const { data } = await apiClient.post<{ mensaje: string }>(
    `${BASE}/moderacion/${tipo}/${id}/ocultar`,
    { motivo },
  );
  return data;
}

export async function restaurarContenido(
  tipo: TipoModeracion,
  id: string,
): Promise<{ mensaje: string }> {
  const { data } = await apiClient.post<{ mensaje: string }>(
    `${BASE}/moderacion/${tipo}/${id}/restaurar`,
  );
  return data;
}

export async function getHistorialModeracion(
  cursoSeccionId: string,
): Promise<HistorialModeracion[]> {
  const { data } = await apiClient.get<HistorialModeracion[]>(
    `${BASE}/cursos/${cursoSeccionId}/moderacion`,
  );
  return data;
}

// ── Actividad de Aula ──

export async function registrarActividad(payload: {
  materialId?: string;
  tareaId?: string;
  accion: "visualizo" | "descargo" | "abrio" | "completo";
}): Promise<void> {
  await apiClient.post(`${BASE}/actividad`, payload);
}

export async function getActividadMaterial(
  materialId: string,
): Promise<ActividadMaterialEstudiante[]> {
  const { data } = await apiClient.get<ActividadMaterialEstudiante[]>(
    `${BASE}/materiales/${materialId}/actividad`,
  );
  return data;
}

export async function getActividadTarea(tareaId: string): Promise<ActividadTareaEstudiante[]> {
  const { data } = await apiClient.get<ActividadTareaEstudiante[]>(
    `${BASE}/tareas/${tareaId}/actividad`,
  );
  return data;
}
