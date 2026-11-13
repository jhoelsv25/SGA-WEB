"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAnioLectivo } from "@/features/anio-escolar/anio-lectivo-context";
import { useSession } from "@/features/auth";
import type { ApiClientError } from "@/lib/api-client";
import { toast } from "@/lib/toast";
import {
  agregarCompromiso,
  calificarDesempeno,
  cancelarObservacion,
  cerrarCalificacion,
  cerrarCompromisoObservacion,
  cerrarNotas,
  cerrarRetroalimentacion,
  comentarObservacion,
  corregirCalificacion,
  crearInstrumento,
  editarNota,
  getCronograma,
  getDetalleObservacion,
  getFichaCalificacion,
  getHistorialDocente,
  getInstrumentos,
  getMatriz,
  getMiObservacion,
  getMisObservaciones,
  getObservaciones,
  getResumenConsolidado,
  getSeguimientos,
  iniciarObservacion,
  marcarEnterado,
  marcarInstrumentoVigente,
  programarObservacion,
  programarReobservacion,
  reprogramarObservacion,
  registrarNota,
  registrarReunion,
  subirArchivoFirmado,
} from "../api";
import { ROL_ADMINISTRADOR, ROL_DIRECTOR } from "../consts";
import type { FiltrosMatriz, FiltrosObservaciones } from "../types";
import { esConfirmacion, mensajeDe } from "../utils";

export const observacionesKeys = {
  all: ["observaciones-aula"] as const,
  cronograma: (anioId?: string) =>
    [...observacionesKeys.all, anioId ?? "vigente", "cronograma"] as const,
  lista: (anioId: string | undefined, filtros: FiltrosObservaciones) =>
    [...observacionesKeys.all, anioId ?? "vigente", "lista", filtros] as const,
  detalle: (id: string) => [...observacionesKeys.all, "detalle", id] as const,
  ficha: (id: string) => [...observacionesKeys.all, "ficha", id] as const,
  seguimientos: (anioId?: string) =>
    [...observacionesKeys.all, anioId ?? "vigente", "seguimientos"] as const,
  matriz: (anioId: string | undefined, filtros: FiltrosMatriz) =>
    [...observacionesKeys.all, anioId ?? "vigente", "matriz", filtros] as const,
  historial: (anioId: string | undefined, docenteId: string) =>
    [...observacionesKeys.all, anioId ?? "vigente", "historial", docenteId] as const,
  resumen: (docenteId: string, periodoId: string) =>
    [...observacionesKeys.all, "resumen", docenteId, periodoId] as const,
  instrumentos: () => [...observacionesKeys.all, "instrumentos"] as const,
  mis: (anioId?: string) => [...observacionesKeys.all, anioId ?? "vigente", "mis"] as const,
  mia: (id: string) => [...observacionesKeys.all, "mia", id] as const,
};

/** Datos del usuario que decide qué botones se muestran (la API vuelve a validar). */
export function useActorObservacion() {
  const { data } = useSession();
  const rol = data?.user.activeRoleName ?? data?.user.roles?.[0] ?? "";
  return {
    usuarioId: data?.user.id,
    rol,
    esAdministrador: rol === ROL_ADMINISTRADOR,
    /** Quienes corrigen lo ya cerrado: Director y Administrador. */
    puedeCorregir: rol === ROL_ADMINISTRADOR || rol === ROL_DIRECTOR,
  };
}

// ---------------------------------------------------------------- consultas
export function useCronograma() {
  const { anio } = useAnioLectivo();
  return useQuery({
    queryKey: observacionesKeys.cronograma(anio?.id),
    queryFn: getCronograma,
    staleTime: 30_000,
  });
}

export function useObservaciones(filtros: FiltrosObservaciones = {}) {
  const { anio } = useAnioLectivo();
  return useQuery({
    queryKey: observacionesKeys.lista(anio?.id, filtros),
    queryFn: () => getObservaciones(filtros),
    staleTime: 30_000,
  });
}

export function useDetalleObservacion(id: string) {
  return useQuery({
    queryKey: observacionesKeys.detalle(id),
    queryFn: () => getDetalleObservacion(id),
    staleTime: 10_000,
  });
}

export function useFichaCalificacion(id: string, habilitada: boolean) {
  return useQuery({
    queryKey: observacionesKeys.ficha(id),
    queryFn: () => getFichaCalificacion(id),
    enabled: habilitada,
    staleTime: 5_000,
  });
}

export function useSeguimientos() {
  const { anio } = useAnioLectivo();
  return useQuery({
    queryKey: observacionesKeys.seguimientos(anio?.id),
    queryFn: getSeguimientos,
    staleTime: 30_000,
  });
}

export function useMatriz(filtros: FiltrosMatriz = {}) {
  const { anio } = useAnioLectivo();
  return useQuery({
    queryKey: observacionesKeys.matriz(anio?.id, filtros),
    queryFn: () => getMatriz(filtros),
    staleTime: 30_000,
  });
}

export function useHistorialDocente(docenteId?: string) {
  const { anio } = useAnioLectivo();
  return useQuery({
    queryKey: observacionesKeys.historial(anio?.id, docenteId ?? ""),
    queryFn: () => getHistorialDocente(docenteId!),
    enabled: Boolean(docenteId),
    staleTime: 30_000,
  });
}

export function useResumenConsolidado(docenteId?: string, periodoId?: string) {
  return useQuery({
    queryKey: observacionesKeys.resumen(docenteId ?? "", periodoId ?? ""),
    queryFn: () => getResumenConsolidado(docenteId!, periodoId!),
    enabled: Boolean(docenteId && periodoId),
    staleTime: 60_000,
  });
}

export function useInstrumentos() {
  return useQuery({
    queryKey: observacionesKeys.instrumentos(),
    queryFn: getInstrumentos,
    staleTime: 60_000,
  });
}

export function useMisObservaciones() {
  const { anio } = useAnioLectivo();
  return useQuery({
    queryKey: observacionesKeys.mis(anio?.id),
    queryFn: getMisObservaciones,
    staleTime: 30_000,
  });
}

export function useMiObservacion(id: string) {
  return useQuery({
    queryKey: observacionesKeys.mia(id),
    queryFn: () => getMiObservacion(id),
    staleTime: 10_000,
  });
}

// ---------------------------------------------------------------- mutaciones
/** Crea una mutación que invalida todo el módulo y muestra el mensaje que manda la API. */
function useMutacion<TVariables, TResultado>(
  mutationFn: (variables: TVariables) => Promise<TResultado>,
  mensajeExito: string,
) {
  const queryClient = useQueryClient();
  return useMutation<TResultado, ApiClientError, TVariables>({
    mutationFn,
    onSuccess: (resultado) => {
      void queryClient.invalidateQueries({ queryKey: observacionesKeys.all });
      toast.success(mensajeDe(resultado, mensajeExito));
    },
    onError: (error) => toast.error(error.message),
  });
}

export const useProgramarObservacion = () =>
  useMutacion(programarObservacion, "Observación programada.");

export const useReprogramarObservacion = () =>
  useMutacion(
    ({ id, ...dto }: { id: string; fecha: string; horaInicio?: string; motivo: string }) =>
      reprogramarObservacion(id, dto),
    "Observación reprogramada.",
  );

export const useCancelarObservacion = () =>
  useMutacion(
    ({ id, motivo }: { id: string; motivo: string }) => cancelarObservacion(id, motivo),
    "Observación cancelada.",
  );

export const useProgramarReobservacion = () =>
  useMutacion(
    ({ id, ...dto }: { id: string; fecha: string; horaInicio?: string }) =>
      programarReobservacion(id, dto),
    "Reobservación programada.",
  );

export const useIniciarObservacion = () =>
  useMutacion(
    ({ id, ...dto }: { id: string; horaInicio: string; estudiantesPresentes: number }) =>
      iniciarObservacion(id, dto),
    "Observación iniciada. Ya puede tomar notas.",
  );

export const useRegistrarNota = () =>
  useMutacion(
    ({ id, ...dto }: { id: string; desempeno: number; texto: string; horaAproximada?: string }) =>
      registrarNota(id, dto),
    "Nota guardada.",
  );

export const useEditarNota = () =>
  useMutacion(
    ({ id, notaId, texto }: { id: string; notaId: string; texto: string }) =>
      editarNota(id, notaId, texto),
    "Nota actualizada.",
  );

/**
 * Cerrar notas: si la duración queda fuera de 45 a 90 min la API responde 409 con el aviso. Ese
 * 409 no es un error: la pantalla pide confirmar y vuelve a llamar con `confirmarDuracion`.
 */
export function useCerrarNotas() {
  const queryClient = useQueryClient();
  return useMutation<
    Awaited<ReturnType<typeof cerrarNotas>>,
    ApiClientError,
    { id: string; horaFin: string; confirmarDuracion?: boolean }
  >({
    mutationFn: ({ id, horaFin, confirmarDuracion }) => cerrarNotas(id, horaFin, confirmarDuracion),
    onSuccess: (resultado) => {
      void queryClient.invalidateQueries({ queryKey: observacionesKeys.all });
      toast.success(mensajeDe(resultado, "Toma de notas cerrada."));
    },
    onError: (error) => {
      if (!esConfirmacion(error)) toast.error(error.message);
    },
  });
}

export const useCalificarDesempeno = () =>
  useMutacion(
    ({
      id,
      desempeno,
      ...dto
    }: {
      id: string;
      desempeno: number;
      nivel: number;
      fundamento: string;
    }) => calificarDesempeno(id, desempeno, dto),
    "Calificación guardada.",
  );

export const useCerrarCalificacion = () =>
  useMutacion((id: string) => cerrarCalificacion(id), "Calificación cerrada.");

export const useCorregirCalificacion = () =>
  useMutacion(
    ({
      id,
      desempeno,
      ...dto
    }: {
      id: string;
      desempeno: number;
      nivel?: number;
      motivo: string;
    }) => corregirCalificacion(id, desempeno, dto),
    "Calificación corregida.",
  );

export const useRegistrarReunion = () =>
  useMutacion(
    ({
      id,
      ...dto
    }: {
      id: string;
      fecha: string;
      horaInicio: string;
      horaFin: string;
      resumen: string;
    }) => registrarReunion(id, dto),
    "Reunión registrada.",
  );

export const useAgregarCompromiso = () =>
  useMutacion(
    ({
      id,
      ...dto
    }: {
      id: string;
      desempeno: number;
      descripcion: string;
      fechaRevision: string;
    }) => agregarCompromiso(id, dto),
    "Compromiso agregado.",
  );

export const useCerrarRetroalimentacion = () =>
  useMutacion(
    ({ id, sinCompromisos }: { id: string; sinCompromisos?: boolean }) =>
      cerrarRetroalimentacion(id, sinCompromisos),
    "Retroalimentación registrada.",
  );

export const useCerrarCompromisoObservacion = () =>
  useMutacion(
    ({
      compromisoId,
      resultado,
    }: {
      compromisoId: string;
      resultado: "cumplido" | "no_cumplido";
    }) => cerrarCompromisoObservacion(compromisoId, resultado),
    "Compromiso cerrado.",
  );

export const useSubirArchivoFirmado = () =>
  useMutacion(
    ({ id, archivo }: { id: string; archivo: File }) => subirArchivoFirmado(id, archivo),
    "Archivo firmado guardado.",
  );

export const useCrearInstrumento = () =>
  useMutacion(crearInstrumento, "Versión del instrumento guardada.");

export const useMarcarInstrumentoVigente = () =>
  useMutacion((id: string) => marcarInstrumentoVigente(id), "Versión marcada como vigente.");

export const useMarcarEnterado = () =>
  useMutacion((id: string) => marcarEnterado(id), "Quedó registrado su enterado.");

export const useComentarObservacion = () =>
  useMutacion(
    ({ id, texto }: { id: string; texto: string }) => comentarObservacion(id, texto),
    "Su comentario fue registrado.",
  );
