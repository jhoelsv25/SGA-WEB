import { apiClient, handleApiError } from "@/lib/api-client";
import { PLANIFICACION_ENDPOINTS as E } from "../consts";
import type {
  Area,
  ArchivoDescargado,
  CompetenciaCatalogo,
  ComentarioPlanificacion,
  DesempenoCatalogo,
  DocumentoSesion,
  EnfoqueCatalogo,
  FiltroHistorial,
  GuardarPlanificacionPayload,
  ItemHistorial,
  HorasRealesPayload,
  OpcionCatalogo,
  PanelSupervision,
  Planificacion,
  RespuestaPlanificacion,
  Semana,
} from "../types";

async function pedir<T>(promesa: Promise<{ data: T }>, porDefecto: string): Promise<T> {
  try {
    const { data } = await promesa;
    return data;
  } catch (error) {
    handleApiError(error, porDefecto);
  }
}

// ─── Docente ───
export const getSemana = (fecha?: string) =>
  pedir(apiClient.get<Semana>(E.SEMANA, { params: { fecha } }), "Error al cargar su semana.");

export const getPlanificacion = (id: string) =>
  pedir(apiClient.get<Planificacion>(E.POR_ID(id)), "Error al cargar la planificación.");

export const guardarPlanificacion = (payload: GuardarPlanificacionPayload) =>
  pedir(
    apiClient.put<RespuestaPlanificacion>(E.BASE, payload),
    "No se pudo guardar la planificación.",
  );

export const marcarLista = (id: string) =>
  pedir(
    apiClient.post<RespuestaPlanificacion>(E.LISTA(id)),
    "No se pudo marcar la planificación como lista.",
  );

export const copiarPlanificacion = (id: string, destinos: { horarioId: string; fecha: string }[]) =>
  pedir(
    apiClient.post<{ mensaje: string }>(E.COPIAR(id), { destinos }),
    "No se pudo copiar la planificación.",
  );

export const getDocumento = (id: string) =>
  pedir(apiClient.get<DocumentoSesion>(E.DOCUMENTO(id)), "Error al cargar la vista previa.");

async function pedirArchivo(
  url: string,
  tipo: string,
  respaldo: string,
): Promise<ArchivoDescargado> {
  try {
    const respuesta = await apiClient.get<ArrayBuffer>(url, { responseType: "arraybuffer" });
    const cabecera = respuesta.headers["content-disposition"] as unknown;
    const nombre =
      typeof cabecera === "string"
        ? (/filename="?([^";]+)"?/i.exec(cabecera)?.[1] ?? respaldo)
        : respaldo;
    return { blob: new Blob([respuesta.data], { type: tipo }), nombre };
  } catch (error) {
    handleApiError(error, "Error al descargar el archivo.");
  }
}

export const descargarPdf = (id: string) =>
  pedirArchivo(E.PDF(id), "application/pdf", "sesion.pdf");

export const descargarDocx = (id: string) =>
  pedirArchivo(
    E.DOCX(id),
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "sesion.docx",
  );

// ─── Catálogo ───
export const getAreas = () => pedir(apiClient.get<Area[]>(E.AREAS), "Error al cargar las áreas.");

export const getCompetencias = (area?: string) =>
  pedir(
    apiClient.get<CompetenciaCatalogo[]>(E.COMPETENCIAS, { params: { area } }),
    "Error al cargar las competencias.",
  );

export const getDesempenos = (competenciaId: string, grado?: number) =>
  pedir(
    apiClient.get<DesempenoCatalogo[]>(E.DESEMPENOS(competenciaId), { params: { grado } }),
    "Error al cargar los desempeños.",
  );

export const getEnfoques = () =>
  pedir(apiClient.get<EnfoqueCatalogo[]>(E.ENFOQUES), "Error al cargar los enfoques.");

export const getOpciones = (tipo?: string) =>
  pedir(
    apiClient.get<OpcionCatalogo[]>(E.OPCIONES, { params: { tipo } }),
    "Error al cargar las listas.",
  );

export const crearDesempeno = (payload: { competenciaId: string; grado: number; texto: string }) =>
  pedir(
    apiClient.post<DesempenoCatalogo>(E.DESEMPENOS_BASE, payload),
    "No se pudo agregar el desempeño.",
  );

export const editarDesempeno = (id: string, texto: string) =>
  pedir(
    apiClient.patch<DesempenoCatalogo>(E.DESEMPENO(id), { texto }),
    "No se pudo corregir el desempeño.",
  );

// ─── Supervisión ───
export const getPanelSupervision = (fecha?: string) =>
  pedir(
    apiClient.get<PanelSupervision>(E.SUPERVISION, { params: { fecha } }),
    "Error al cargar las planificaciones del día.",
  );

export const getPlanificacionSupervision = (id: string) =>
  pedir(
    apiClient.get<Planificacion>(E.SUPERVISION_DETALLE(id)),
    "Error al cargar la planificación.",
  );

export const comentarPlanificacion = (id: string, texto: string) =>
  pedir(
    apiClient.post<{ mensaje: string; comentarios: ComentarioPlanificacion[] }>(E.COMENTARIOS(id), {
      texto,
    }),
    "No se pudo enviar el comentario.",
  );

export const registrarHorasReales = (sesionId: string, payload: HorasRealesPayload) =>
  pedir(
    apiClient.put<{ mensaje: string }>(E.HORAS_REALES(sesionId), payload),
    "No se pudieron registrar las horas reales.",
  );

export const getHistorial = (filtro: FiltroHistorial) =>
  pedir(
    apiClient.get<ItemHistorial[]>(E.HISTORIAL, { params: filtro }),
    "Error al cargar el historial de planificaciones.",
  );

export const getHistorialSupervision = (filtro: FiltroHistorial) =>
  pedir(
    apiClient.get<ItemHistorial[]>(E.SUPERVISION_HISTORIAL, { params: filtro }),
    "Error al cargar las planificaciones.",
  );
