import { apiClient, handleApiError } from "@/lib/api-client";
import { OBSERVACIONES_ENDPOINTS as E } from "../consts";
import type {
  ArchivoDescargado,
  CalificarPayload,
  CompromisoPayload,
  CompromisoPorRevisar,
  Compromiso,
  CorregirCalificacionPayload,
  Cronograma,
  DetalleObservacion,
  FichaCalificacion,
  FiltrosMatriz,
  FiltrosObservaciones,
  HistorialDocente,
  IniciarPayload,
  Instrumento,
  InstrumentoPayload,
  Matriz,
  MiObservacionDetalle,
  MisObservaciones,
  NotaPayload,
  Observacion,
  ProgramarPayload,
  ReprogramarPayload,
  ResultadoCompromiso,
  ReunionPayload,
  ResumenConsolidado,
} from "../types";

/** Respuesta de una acción: la API manda un mensaje listo para mostrar y datos extra. */
export interface Accion {
  mensaje?: string;
  observacion?: Observacion;
  [clave: string]: unknown;
}

async function pedir<T>(promesa: Promise<{ data: T }>, porDefecto: string): Promise<T> {
  try {
    const { data } = await promesa;
    return data;
  } catch (error) {
    handleApiError(error, porDefecto);
  }
}

// ---------------------------------------------------------------- lecturas
export const getCronograma = () =>
  pedir(apiClient.get<Cronograma>(E.CRONOGRAMA), "Error al cargar el cronograma.");

export const getObservaciones = (filtros: FiltrosObservaciones = {}) =>
  pedir(
    apiClient.get<Observacion[]>(E.BASE, { params: filtros }),
    "Error al cargar las observaciones.",
  );

export const getDetalleObservacion = (id: string) =>
  pedir(apiClient.get<DetalleObservacion>(E.POR_ID(id)), "Error al cargar la observación.");

export const getFichaCalificacion = (id: string) =>
  pedir(apiClient.get<FichaCalificacion>(E.FICHA(id)), "Error al cargar la ficha de calificación.");

export const getSeguimientos = () =>
  pedir(
    apiClient.get<CompromisoPorRevisar[]>(E.SEGUIMIENTOS),
    "Error al cargar los seguimientos por revisar.",
  );

export const getMatriz = (filtros: FiltrosMatriz = {}) =>
  pedir(apiClient.get<Matriz>(E.MATRIZ, { params: filtros }), "Error al cargar la matriz.");

export const getHistorialDocente = (docenteId: string) =>
  pedir(
    apiClient.get<HistorialDocente>(E.HISTORIAL(docenteId)),
    "Error al cargar el historial del docente.",
  );

export const getResumenConsolidado = (docenteId: string, periodoId: string) =>
  pedir(
    apiClient.get<ResumenConsolidado>(E.RESUMEN_CONSOLIDADO, { params: { docenteId, periodoId } }),
    "Error al cargar el resumen de la observación.",
  );

export const getInstrumentos = () =>
  pedir(apiClient.get<Instrumento[]>(E.INSTRUMENTOS), "Error al cargar el instrumento.");

// ---------------------------------------------------------------- cronograma
export const programarObservacion = (dto: ProgramarPayload) =>
  pedir(apiClient.post<Accion>(E.BASE, dto), "Error al programar la observación.");

export const reprogramarObservacion = (id: string, dto: ReprogramarPayload) =>
  pedir(apiClient.patch<Accion>(E.REPROGRAMAR(id), dto), "Error al reprogramar la observación.");

export const cancelarObservacion = (id: string, motivo: string) =>
  pedir(apiClient.patch<Accion>(E.CANCELAR(id), { motivo }), "Error al cancelar la observación.");

export const programarReobservacion = (id: string, dto: { fecha: string; horaInicio?: string }) =>
  pedir(apiClient.post<Accion>(E.REOBSERVACION(id), dto), "Error al programar la reobservación.");

// ---------------------------------------------------------------- toma de notas
export const iniciarObservacion = (id: string, dto: IniciarPayload) =>
  pedir(apiClient.post<Accion>(E.INICIAR(id), dto), "Error al iniciar la observación.");

export const registrarNota = (id: string, dto: NotaPayload) =>
  pedir(apiClient.post<Accion>(E.NOTAS(id), dto), "Error al guardar la nota.");

export const editarNota = (id: string, notaId: string, texto: string) =>
  pedir(apiClient.patch<Accion>(E.NOTA(id, notaId), { texto }), "Error al editar la nota.");

export const cerrarNotas = (id: string, horaFin: string, confirmarDuracion?: boolean) =>
  pedir(
    apiClient.post<Accion>(E.CERRAR_NOTAS(id), { horaFin, confirmarDuracion }),
    "Error al cerrar la toma de notas.",
  );

// ---------------------------------------------------------------- calificación
export const calificarDesempeno = (id: string, desempeno: number, dto: CalificarPayload) =>
  pedir(
    apiClient.put<Accion>(E.CALIFICAR(id, desempeno), dto),
    "Error al guardar la calificación del desempeño.",
  );

export const cerrarCalificacion = (id: string) =>
  pedir(apiClient.post<Accion>(E.CERRAR_CALIFICACION(id)), "Error al cerrar la calificación.");

export const corregirCalificacion = (
  id: string,
  desempeno: number,
  dto: CorregirCalificacionPayload,
) =>
  pedir(
    apiClient.patch<Accion>(E.CORREGIR_CALIFICACION(id, desempeno), dto),
    "Error al corregir la calificación.",
  );

// ---------------------------------------------------------------- retroalimentación
export const registrarReunion = (id: string, dto: ReunionPayload) =>
  pedir(apiClient.put<Accion>(E.REUNION(id), dto), "Error al registrar la reunión.");

export const agregarCompromiso = (id: string, dto: CompromisoPayload) =>
  pedir(
    apiClient.post<{ compromiso: Compromiso }>(E.COMPROMISOS(id), dto),
    "Error al agregar el compromiso.",
  );

export const cerrarRetroalimentacion = (id: string, sinCompromisos?: boolean) =>
  pedir(
    apiClient.post<Accion>(E.CERRAR_RETRO(id), { sinCompromisos }),
    "Error al cerrar la retroalimentación.",
  );

export const cerrarCompromisoObservacion = (compromisoId: string, resultado: ResultadoCompromiso) =>
  pedir(
    apiClient.patch<Accion & { sugerirReobservacion?: boolean }>(
      E.CERRAR_COMPROMISO(compromisoId),
      {
        resultado,
      },
    ),
    "Error al cerrar el compromiso.",
  );

export async function subirArchivoFirmado(id: string, archivo: File): Promise<Accion> {
  const formulario = new FormData();
  formulario.append("archivo", archivo);
  return pedir(
    apiClient.post<Accion>(E.ARCHIVO_FIRMADO(id), formulario, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
    "Error al subir el archivo firmado.",
  );
}

// ---------------------------------------------------------------- instrumento
export const crearInstrumento = (dto: InstrumentoPayload) =>
  pedir(apiClient.post<Instrumento>(E.INSTRUMENTOS, dto), "Error al guardar el instrumento.");

export const marcarInstrumentoVigente = (id: string) =>
  pedir(
    apiClient.patch<Instrumento>(E.INSTRUMENTO_MARCAR_VIGENTE(id)),
    "Error al marcar el instrumento como vigente.",
  );

// ---------------------------------------------------------------- docente
export const getMisObservaciones = () =>
  pedir(apiClient.get<MisObservaciones>(E.MIS), "Error al cargar sus observaciones.");

export const getMiObservacion = (id: string) =>
  pedir(apiClient.get<MiObservacionDetalle>(E.MI(id)), "Error al cargar la observación.");

export const marcarEnterado = (id: string) =>
  pedir(apiClient.post<Accion>(E.MI_ENTERADO(id)), "Error al registrar el enterado.");

export const comentarObservacion = (id: string, texto: string) =>
  pedir(apiClient.post<Accion>(E.MI_COMENTARIO(id), { texto }), "Error al guardar el comentario.");

// ---------------------------------------------------------------- descargas
/**
 * Las descargas piden el archivo como bytes; si el servidor responde con un error en JSON, el
 * mensaje llega dentro de esos bytes. Se decodifica para que `apiClient` lo muestre tal cual.
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
  return /filename="?([^";]+)"?/i.exec(valor)?.[1] ?? respaldo;
}

async function pedirArchivo(
  url: string,
  params: Record<string, string | number | undefined>,
  tipo: string,
  respaldo: string,
): Promise<ArchivoDescargado> {
  try {
    const respuesta = await apiClient.get<ArrayBuffer>(url, {
      params,
      responseType: "arraybuffer",
      transformResponse: [decodificarErrorJson],
    });
    return {
      blob: new Blob([respuesta.data], { type: tipo }),
      nombre: nombreDeContentDisposition(respuesta.headers["content-disposition"], respaldo),
    };
  } catch (error) {
    handleApiError(error, "Error al descargar el archivo.");
  }
}

export const descargarProtocoloPdf = (id: string) =>
  pedirArchivo(E.PROTOCOLO_PDF(id), {}, "application/pdf", "protocolo-retroalimentacion.pdf");

export const descargarMatrizExcel = (filtros: FiltrosMatriz = {}) =>
  pedirArchivo(
    E.MATRIZ_EXCEL,
    { ...filtros },
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "observaciones-aula.xlsx",
  );
