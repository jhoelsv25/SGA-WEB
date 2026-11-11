import { apiClient } from "@/lib/api-client";
import type {
  CalificarEntregaPayload,
  CrearTareaPayload,
  CursoNotasEstudiante,
  Entrega,
  LibroNotas,
  Tarea,
} from "../types";

const BASE = "/aula-virtual";

export async function getTareas(
  cursoSeccionId: string,
  periodoId?: string,
  estudianteId?: string,
): Promise<Tarea[]> {
  const params: Record<string, string> = {};
  if (periodoId) params.periodoId = periodoId;
  if (estudianteId) params.estudianteId = estudianteId;
  const { data } = await apiClient.get<Tarea[]>(`${BASE}/cursos/${cursoSeccionId}/tareas`, {
    params: Object.keys(params).length > 0 ? params : undefined,
  });
  return data;
}

export async function crearTarea(
  cursoSeccionId: string,
  payload: CrearTareaPayload,
): Promise<{ mensaje: string; tarea: Tarea }> {
  const { data } = await apiClient.post<{ mensaje: string; tarea: Tarea }>(
    `${BASE}/cursos/${cursoSeccionId}/tareas`,
    payload,
  );
  return data;
}

export async function getDetalleTarea(tareaId: string, estudianteId?: string): Promise<Tarea> {
  const { data } = await apiClient.get<Tarea>(`${BASE}/tareas/${tareaId}`, {
    params: estudianteId ? { estudianteId } : undefined,
  });
  return data;
}

export async function actualizarTarea(
  tareaId: string,
  payload: Partial<CrearTareaPayload>,
): Promise<{ mensaje: string; tarea: Tarea }> {
  const { data } = await apiClient.patch<{ mensaje: string; tarea: Tarea }>(
    `${BASE}/tareas/${tareaId}`,
    payload,
  );
  return data;
}

export async function publicarTarea(tareaId: string): Promise<{ mensaje: string; tarea: Tarea }> {
  const { data } = await apiClient.post<{ mensaje: string; tarea: Tarea }>(
    `${BASE}/tareas/${tareaId}/publicar`,
  );
  return data;
}

export async function cerrarTarea(
  tareaId: string,
  asignarCeroSinEntrega?: boolean,
): Promise<{ mensaje: string; tarea: Tarea }> {
  const { data } = await apiClient.post<{ mensaje: string; tarea: Tarea }>(
    `${BASE}/tareas/${tareaId}/cerrar`,
    asignarCeroSinEntrega !== undefined ? { asignarCeroSinEntrega } : undefined,
  );
  return data;
}

export async function eliminarTarea(tareaId: string): Promise<{ mensaje: string }> {
  const { data } = await apiClient.delete<{ mensaje: string }>(`${BASE}/tareas/${tareaId}`);
  return data;
}

export async function iniciarIntento(
  tareaId: string,
): Promise<{ mensaje: string; intento: Entrega }> {
  const { data } = await apiClient.post<{ mensaje: string; intento: Entrega }>(
    `${BASE}/tareas/${tareaId}/iniciar-intento`,
  );
  return data;
}

export async function guardarProgreso(
  tareaId: string,
  respuestas: Record<string, unknown>,
): Promise<{ mensaje: string }> {
  const { data } = await apiClient.post<{ mensaje: string }>(`${BASE}/tareas/${tareaId}/progreso`, {
    respuestas,
  });
  return data;
}

export async function entregarTarea(
  tareaId: string,
  payload: {
    texto?: string;
    enlaceUrl?: string;
    archivo?: File | null;
    respuestas?: Record<string, unknown>;
  },
): Promise<{
  mensaje: string;
  entrega: Entrega;
  nota?: number;
  intentosRestantes?: number;
}> {
  if (payload.archivo) {
    const formData = new FormData();
    if (payload.texto) formData.append("texto", payload.texto);
    if (payload.enlaceUrl) formData.append("enlaceUrl", payload.enlaceUrl);
    formData.append("archivo", payload.archivo);
    const { data } = await apiClient.post<{
      mensaje: string;
      entrega: Entrega;
      nota?: number;
      intentosRestantes?: number;
    }>(`${BASE}/tareas/${tareaId}/entregar`, formData);
    return data;
  }

  const { data } = await apiClient.post<{
    mensaje: string;
    entrega: Entrega;
    nota?: number;
    intentosRestantes?: number;
  }>(`${BASE}/tareas/${tareaId}/entregar`, {
    texto: payload.texto,
    enlaceUrl: payload.enlaceUrl,
    respuestas: payload.respuestas,
  });
  return data;
}

export async function getEntregasDeTarea(tareaId: string): Promise<Entrega[]> {
  const { data } = await apiClient.get<Entrega[]>(`${BASE}/tareas/${tareaId}/entregas`);
  return data;
}

export async function calificarEntrega(
  entregaId: string,
  payload: CalificarEntregaPayload,
): Promise<{ mensaje: string; entrega: Entrega }> {
  const { data } = await apiClient.patch<{ mensaje: string; entrega: Entrega }>(
    `${BASE}/entregas/${entregaId}/calificar`,
    payload,
  );
  return data;
}

export async function calificarDirecto(
  tareaId: string,
  payload: {
    matriculaId: string;
    nota: number;
    retroalimentacion?: string;
  },
): Promise<{ mensaje: string; entrega: Entrega }> {
  const { data } = await apiClient.post<{ mensaje: string; entrega: Entrega }>(
    `${BASE}/tareas/${tareaId}/calificar-directo`,
    payload,
  );
  return data;
}

export async function getLibroNotas(
  cursoSeccionId: string,
  periodoId?: string,
): Promise<LibroNotas> {
  const { data } = await apiClient.get<LibroNotas>(`${BASE}/cursos/${cursoSeccionId}/libro-notas`, {
    params: periodoId ? { periodoId } : undefined,
  });
  return data;
}

export async function descargarExcelLibroNotas(
  cursoSeccionId: string,
  cursoNombre: string,
  periodoId?: string,
): Promise<void> {
  const response = await apiClient.get<Blob>(`${BASE}/cursos/${cursoSeccionId}/libro-notas/excel`, {
    params: periodoId ? { periodoId } : undefined,
    responseType: "blob",
  });

  const blob = new Blob([response.data], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Libro_Notas_${cursoNombre.replace(/\s+/g, "_")}.xlsx`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

export async function getMisNotas(periodoId?: string): Promise<CursoNotasEstudiante[]> {
  const { data } = await apiClient.get<CursoNotasEstudiante[]>(`${BASE}/mis-notas`, {
    params: periodoId ? { periodoId } : undefined,
  });
  return data;
}

export async function getNotasEstudiante(
  estudianteId: string,
  periodoId?: string,
): Promise<CursoNotasEstudiante[]> {
  const { data } = await apiClient.get<CursoNotasEstudiante[]>(
    `${BASE}/estudiantes/${estudianteId}/notas`,
    {
      params: periodoId ? { periodoId } : undefined,
    },
  );
  return data;
}
