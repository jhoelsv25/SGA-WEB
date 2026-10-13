"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAnioLectivo } from "@/features/anio-escolar/anio-lectivo-context";
import { ApiClientError } from "@/lib/api-client";
import { toast } from "@/lib/toast";
import {
  actualizarMaterial,
  actualizarTarea,
  actualizarUnidad,
  calificarEntrega,
  cerrarTarea,
  crearTarea,
  crearUnidad,
  eliminarTarea,
  entregarTarea,
  getAula,
  getDetalleTarea,
  getEntregasDeTarea,
  getLibroNotas,
  getMisCursos,
  getMisNotas,
  getSeguimiento,
  getSolicitudes,
  getTareas,
  guardarProgreso,
  iniciarIntento,
  planificarMaterial,
  publicarExtra,
  publicarMaterial,
  publicarTarea,
  reemplazarMaterial,
  resolverSolicitud,
  retirarMaterial,
  solicitarCambioFecha,
} from "../api";
import type {
  CalificarEntregaPayload,
  ContenidoMaterial,
  CrearTareaPayload,
  EstadoSolicitudFecha,
  MaterialExtra,
  NuevaUnidad,
  PlanificarMaterial,
} from "../types";

export const aulaKeys = {
  all: ["aula-virtual"] as const,
  cursos: (anioId?: string) => [...aulaKeys.all, anioId ?? "vigente", "cursos"] as const,
  aula: (anioId: string | undefined, id: string) =>
    [...aulaKeys.all, anioId ?? "vigente", "aula", id] as const,
  solicitudes: (anioId: string | undefined, estado?: EstadoSolicitudFecha) =>
    [...aulaKeys.all, anioId ?? "vigente", "solicitudes", estado ?? "todas"] as const,
  seguimiento: (anioId: string | undefined, periodoId?: string) =>
    [...aulaKeys.all, anioId ?? "vigente", "seguimiento", periodoId ?? "en-curso"] as const,
  tareas: (anioId: string | undefined, cursoSeccionId: string, periodoId?: string) =>
    [...aulaKeys.all, anioId ?? "vigente", "tareas", cursoSeccionId, periodoId ?? "todos"] as const,
  tarea: (tareaId: string) => [...aulaKeys.all, "tarea", tareaId] as const,
  entregas: (tareaId: string) => [...aulaKeys.all, "entregas", tareaId] as const,
  libroNotas: (cursoSeccionId: string, periodoId?: string) =>
    [...aulaKeys.all, "libro-notas", cursoSeccionId, periodoId ?? "en-curso"] as const,
  misNotas: (periodoId?: string) => [...aulaKeys.all, "mis-notas", periodoId ?? "todos"] as const,
};

export function useMisCursos() {
  const { anio } = useAnioLectivo();
  return useQuery({
    queryKey: aulaKeys.cursos(anio?.id),
    queryFn: getMisCursos,
    staleTime: 5 * 60_000,
    gcTime: 10 * 60_000,
  });
}

export function useAula(cursoSeccionId: string) {
  const { anio } = useAnioLectivo();
  return useQuery({
    queryKey: aulaKeys.aula(anio?.id, cursoSeccionId),
    queryFn: () => getAula(cursoSeccionId),
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    retry: false,
  });
}

export function useSolicitudes(estado?: EstadoSolicitudFecha) {
  const { anio } = useAnioLectivo();
  return useQuery({
    queryKey: aulaKeys.solicitudes(anio?.id, estado),
    queryFn: () => getSolicitudes(estado),
    staleTime: 15_000,
  });
}

export function useSeguimiento(periodoId?: string) {
  const { anio } = useAnioLectivo();
  return useQuery({
    queryKey: aulaKeys.seguimiento(anio?.id, periodoId),
    queryFn: () => getSeguimiento(periodoId),
    staleTime: 30_000,
    retry: false,
  });
}

/** Cada mutación refresca el aula y avisa con el mensaje que devuelve el servidor. */
function useMutacionAula<TVariables, TRespuesta extends { mensaje?: string }>(
  funcion: (variables: TVariables) => Promise<TRespuesta>,
  mensajePorDefecto?: string,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: funcion,
    onSuccess: (respuesta) => {
      void queryClient.invalidateQueries({ queryKey: aulaKeys.all });
      const mensaje = respuesta.mensaje ?? mensajePorDefecto;
      if (mensaje) toast.success(mensaje);
    },
    onError: (error: ApiClientError) => toast.error(error.message),
  });
}

export function useCrearUnidad(cursoSeccionId: string) {
  return useMutacionAula(async (payload: NuevaUnidad) => ({
    ...(await crearUnidad(cursoSeccionId, payload)),
    mensaje: "Unidad creada.",
  }));
}

export function useActualizarUnidad() {
  return useMutacionAula(async ({ id, ...payload }: { id: string } & Partial<NuevaUnidad>) => ({
    ...(await actualizarUnidad(id, payload)),
    mensaje: "Unidad actualizada.",
  }));
}

export function usePlanificarMaterial() {
  return useMutacionAula(({ unidadId, ...payload }: { unidadId: string } & PlanificarMaterial) =>
    planificarMaterial(unidadId, payload),
  );
}

export function useActualizarMaterial() {
  return useMutacionAula(
    ({ id, ...payload }: { id: string } & Partial<PlanificarMaterial> & { visible?: boolean }) =>
      actualizarMaterial(id, payload),
  );
}

export function usePublicarMaterial() {
  return useMutacionAula(({ id, ...contenido }: { id: string } & ContenidoMaterial) =>
    publicarMaterial(id, contenido),
  );
}

export function usePublicarExtra() {
  return useMutacionAula(({ unidadId, ...material }: { unidadId: string } & MaterialExtra) =>
    publicarExtra(unidadId, material),
  );
}

export function useReemplazarMaterial() {
  return useMutacionAula(({ id, ...contenido }: { id: string } & ContenidoMaterial) =>
    reemplazarMaterial(id, contenido),
  );
}

export function useRetirarMaterial() {
  return useMutacionAula((id: string) => retirarMaterial(id));
}

export function useSolicitarCambioFecha() {
  return useMutacionAula(
    ({ id, ...payload }: { id: string; fechaSolicitada: string; motivo: string }) =>
      solicitarCambioFecha(id, payload),
  );
}

export function useResolverSolicitud() {
  return useMutacionAula(
    ({
      id,
      accion,
      respuesta,
    }: {
      id: string;
      accion: "aprobar" | "rechazar";
      respuesta?: string;
    }) => resolverSolicitud(id, accion, respuesta),
  );
}

// ==========================================
// RF-016: Hooks de tareas, entregas y notas
// ==========================================

export function useTareas(cursoSeccionId: string, periodoId?: string) {
  const { anio } = useAnioLectivo();
  return useQuery({
    queryKey: aulaKeys.tareas(anio?.id, cursoSeccionId, periodoId),
    queryFn: () => getTareas(cursoSeccionId, periodoId),
    enabled: Boolean(cursoSeccionId),
    staleTime: 30_000,
  });
}

export function useDetalleTarea(tareaId: string) {
  return useQuery({
    queryKey: aulaKeys.tarea(tareaId),
    queryFn: () => getDetalleTarea(tareaId),
    enabled: Boolean(tareaId),
    staleTime: 15_000,
  });
}

export function useEntregasDeTarea(tareaId: string) {
  return useQuery({
    queryKey: aulaKeys.entregas(tareaId),
    queryFn: () => getEntregasDeTarea(tareaId),
    enabled: Boolean(tareaId),
    staleTime: 15_000,
  });
}

export function useLibroNotas(cursoSeccionId: string, periodoId?: string) {
  return useQuery({
    queryKey: aulaKeys.libroNotas(cursoSeccionId, periodoId),
    queryFn: () => getLibroNotas(cursoSeccionId, periodoId),
    enabled: Boolean(cursoSeccionId),
    staleTime: 30_000,
  });
}

export function useMisNotas(periodoId?: string) {
  return useQuery({
    queryKey: aulaKeys.misNotas(periodoId),
    queryFn: () => getMisNotas(periodoId),
    staleTime: 30_000,
  });
}

export function useCrearTarea(cursoSeccionId: string) {
  return useMutacionAula((payload: CrearTareaPayload) => crearTarea(cursoSeccionId, payload));
}

export function useActualizarTarea() {
  return useMutacionAula(({ id, ...payload }: { id: string } & Partial<CrearTareaPayload>) =>
    actualizarTarea(id, payload),
  );
}

export function usePublicarTarea() {
  return useMutacionAula((tareaId: string) => publicarTarea(tareaId));
}

export function useCerrarTarea() {
  return useMutacionAula((tareaId: string) => cerrarTarea(tareaId));
}

export function useEliminarTarea() {
  return useMutacionAula((tareaId: string) => eliminarTarea(tareaId));
}

export function useIniciarIntento() {
  return useMutacionAula((tareaId: string) => iniciarIntento(tareaId));
}

export function useGuardarProgreso() {
  return useMutation({
    mutationFn: ({
      tareaId,
      respuestas,
    }: {
      tareaId: string;
      respuestas: Record<string, unknown>;
    }) => guardarProgreso(tareaId, respuestas),
  });
}

export function useEntregarTarea() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      tareaId,
      ...payload
    }: {
      tareaId: string;
      texto?: string;
      enlaceUrl?: string;
      archivo?: File | null;
      respuestas?: Record<string, unknown>;
    }) => entregarTarea(tareaId, payload),
    onSuccess: (res) => {
      void queryClient.invalidateQueries({ queryKey: aulaKeys.all });
      if (res.mensaje) toast.success(res.mensaje);
    },
    onError: (error: ApiClientError) => toast.error(error.message),
  });
}

export function useCalificarEntrega() {
  return useMutacionAula(
    ({
      entregaId,
      ...payload
    }: {
      entregaId: string;
    } & CalificarEntregaPayload) => calificarEntrega(entregaId, payload),
  );
}
