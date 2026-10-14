import { apiClient, API_BASE_URL } from "@/lib/api-client";
import type {
  AulaVirtual,
  ContenidoMaterial,
  CursoAula,
  EstadoSolicitudFecha,
  MaterialExtra,
  MutacionMaterial,
  NuevaUnidad,
  PlanificarMaterial,
  Seguimiento,
  SolicitudCambio,
  Unidad,
} from "../types";

const BASE = "/aula-virtual";

export function aFormData(
  campos: Record<string, string | undefined>,
  archivo?: File | null,
): FormData {
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
