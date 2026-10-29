"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAnioLectivo } from "@/features/anio-escolar/anio-lectivo-context";
import { ApiClientError } from "@/lib/api-client";
import { toast } from "@/lib/toast";
import {
  actualizarTarea,
  calificarEntrega,
  cerrarTarea,
  crearTarea,
  eliminarTarea,
  entregarTarea,
  getDetalleTarea,
  getEntregasDeTarea,
  getLibroNotas,
  getMisNotas,
  getNotasEstudiante,
  getTareas,
  guardarProgreso,
  iniciarIntento,
  publicarTarea,
} from "../api";
import type { CalificarEntregaPayload, CrearTareaPayload } from "../types";
import { aulaKeys } from "./query-keys";
import { useMutacionAula } from "./use-aula-virtual";

export function useTareas(cursoSeccionId: string, periodoId?: string, estudianteId?: string) {
  const { anio } = useAnioLectivo();
  return useQuery({
    queryKey: aulaKeys.tareas(anio?.id, cursoSeccionId, periodoId, estudianteId),
    queryFn: () => getTareas(cursoSeccionId, periodoId, estudianteId),
    enabled: Boolean(cursoSeccionId),
    staleTime: 30_000,
  });
}

export function useDetalleTarea(tareaId: string, estudianteId?: string) {
  return useQuery({
    queryKey: aulaKeys.tarea(tareaId, estudianteId),
    queryFn: () => getDetalleTarea(tareaId, estudianteId),
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

export function useMisNotas(periodoId?: string, estudianteId?: string) {
  return useQuery({
    queryKey: aulaKeys.misNotas(periodoId, estudianteId),
    queryFn: () =>
      estudianteId ? getNotasEstudiante(estudianteId, periodoId) : getMisNotas(periodoId),
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
  return useMutacionAula((input: string | { tareaId: string; asignarCeroSinEntrega?: boolean }) => {
    if (typeof input === "string") {
      return cerrarTarea(input);
    }
    return cerrarTarea(input.tareaId, input.asignarCeroSinEntrega);
  });
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
