import { apiClient, API_BASE_URL } from "@/lib/api-client";
import type {
  AulaVirtual,
  CalificarEntregaPayload,
  ContenidoMaterial,
  CrearTareaPayload,
  CursoAula,
  CursoNotasEstudiante,
  Entrega,
  EstadoSolicitudFecha,
  LibroNotas,
  MaterialExtra,
  MutacionMaterial,
  NuevaUnidad,
  PlanificarMaterial,
  Seguimiento,
  SolicitudCambio,
  Tarea,
  Unidad,
} from "../types";

const BASE = "/aula-virtual";

function aFormData(campos: Record<string, string | undefined>, archivo?: File | null): FormData {
  const formulario = new FormData();
  Object.entries(campos).forEach(([clave, valor]) => {
    if (valor !== undefined && valor !== "") formulario.append(clave, valor);
  });
  if (archivo) formulario.append("archivo", archivo);
  return formulario;
}

/** Los archivos se sirven desde el API (`/uploads/...`), sin el prefijo `/api`. */
export function urlDeArchivo(url: string): string {
  if (url.startsWith("http")) return url;
  return `${API_BASE_URL.replace(/\/api\/?$/, "")}${url}`;
}

export async function getMisCursos(): Promise<CursoAula[]> {
  const { data } = await apiClient.get<CursoAula[]>(`${BASE}/mis-cursos`);
  return data;
}

export async function getAula(cursoSeccionId: string): Promise<AulaVirtual> {
  const { data } = await apiClient.get<AulaVirtual>(`${BASE}/cursos/${cursoSeccionId}`);
  return data;
}

export async function crearUnidad(cursoSeccionId: string, payload: NuevaUnidad): Promise<Unidad> {
  const { data } = await apiClient.post<Unidad>(
    `${BASE}/cursos/${cursoSeccionId}/unidades`,
    payload,
  );
  return data;
}

export async function actualizarUnidad(
  unidadId: string,
  payload: Partial<NuevaUnidad>,
): Promise<Unidad> {
  const { data } = await apiClient.patch<Unidad>(`${BASE}/unidades/${unidadId}`, payload);
  return data;
}

export async function planificarMaterial(
  unidadId: string,
  payload: PlanificarMaterial,
): Promise<MutacionMaterial> {
  const { data } = await apiClient.post<MutacionMaterial>(
    `${BASE}/unidades/${unidadId}/materiales/planificar`,
    payload,
  );
  return data;
}

export async function actualizarMaterial(
  materialId: string,
  payload: Partial<PlanificarMaterial> & { visible?: boolean },
): Promise<MutacionMaterial> {
  const { data } = await apiClient.patch<MutacionMaterial>(
    `${BASE}/materiales/${materialId}`,
    payload,
  );
  return data;
}

export async function publicarMaterial(
  materialId: string,
  contenido: ContenidoMaterial,
): Promise<MutacionMaterial> {
  const { data } = await apiClient.post<MutacionMaterial>(
    `${BASE}/materiales/${materialId}/publicar`,
    aFormData({ enlace: contenido.enlace }, contenido.archivo),
  );
  return data;
}

export async function publicarExtra(
  unidadId: string,
  material: MaterialExtra,
): Promise<MutacionMaterial> {
  const { data } = await apiClient.post<MutacionMaterial>(
    `${BASE}/unidades/${unidadId}/materiales/extra`,
    aFormData(
      {
        titulo: material.titulo,
        descripcion: material.descripcion,
        tipo: material.tipo,
        enlace: material.enlace,
      },
      material.archivo,
    ),
  );
  return data;
}

export async function reemplazarMaterial(
  materialId: string,
  contenido: ContenidoMaterial,
): Promise<MutacionMaterial> {
  const { data } = await apiClient.post<MutacionMaterial>(
    `${BASE}/materiales/${materialId}/reemplazar`,
    aFormData({ enlace: contenido.enlace }, contenido.archivo),
  );
  return data;
}

export async function retirarMaterial(materialId: string): Promise<{ mensaje: string }> {
  const { data } = await apiClient.patch<{ mensaje: string }>(
    `${BASE}/materiales/${materialId}/retirar`,
  );
  return data;
}

export async function solicitarCambioFecha(
  materialId: string,
  payload: { fechaSolicitada: string; motivo: string },
): Promise<{ mensaje: string; id: string }> {
  const { data } = await apiClient.post<{ mensaje: string; id: string }>(
    `${BASE}/materiales/${materialId}/solicitudes-cambio-fecha`,
    payload,
  );
  return data;
}

export async function getSolicitudes(estado?: EstadoSolicitudFecha): Promise<SolicitudCambio[]> {
  const { data } = await apiClient.get<SolicitudCambio[]>(`${BASE}/solicitudes-cambio-fecha`, {
    params: estado ? { estado } : undefined,
  });
  return data;
}

export async function resolverSolicitud(
  id: string,
  accion: "aprobar" | "rechazar",
  respuesta?: string,
): Promise<{ mensaje: string }> {
  const { data } = await apiClient.patch<{ mensaje: string }>(
    `${BASE}/solicitudes-cambio-fecha/${id}/${accion}`,
    { respuesta },
  );
  return data;
}

export async function getSeguimiento(periodoId?: string): Promise<Seguimiento> {
  const { data } = await apiClient.get<Seguimiento>(`${BASE}/seguimiento`, {
    params: periodoId ? { periodoId } : undefined,
  });
  return data;
}

// ==========================================
// RF-016: API de tareas, entregas y libro de notas
// ==========================================

export async function getTareas(cursoSeccionId: string, periodoId?: string): Promise<Tarea[]> {
  const { data } = await apiClient.get<Tarea[]>(`${BASE}/cursos/${cursoSeccionId}/tareas`, {
    params: periodoId ? { periodoId } : undefined,
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

export async function getDetalleTarea(tareaId: string): Promise<Tarea> {
  const { data } = await apiClient.get<Tarea>(`${BASE}/tareas/${tareaId}`);
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

export async function cerrarTarea(tareaId: string): Promise<{ mensaje: string; tarea: Tarea }> {
  const { data } = await apiClient.post<{ mensaje: string; tarea: Tarea }>(
    `${BASE}/tareas/${tareaId}/cerrar`,
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
