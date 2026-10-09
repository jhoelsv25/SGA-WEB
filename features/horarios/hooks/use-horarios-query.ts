"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAnioLectivo } from "@/features/anio-escolar/anio-lectivo-context";
import { ApiClientError } from "@/lib/api-client";
import { toast } from "@/lib/toast";
import {
  copiarHorario,
  createBloque,
  deleteBloque,
  getCargaSeccion,
  getGrillaPropuesta,
  getHorarioSeccion,
  getSeccionesPorGrado,
  updateBloque,
} from "../api";
import type { CreateBloquePayload, UpdateBloquePayload } from "../types";

export const horariosKeys = {
  all: ["horarios"] as const,
  secciones: () => [...horariosKeys.all, "secciones"] as const,
  seccionesPorGrado: (anioId?: string, gradoId?: string | null) =>
    [...horariosKeys.secciones(), anioId ?? "vigente", gradoId ?? "todos"] as const,
  horariosSeccion: () => [...horariosKeys.all, "seccion"] as const,
  seccion: (anioId?: string, seccionId?: string | null) =>
    [...horariosKeys.horariosSeccion(), anioId ?? "vigente", seccionId ?? ""] as const,
  grillas: () => [...horariosKeys.all, "grilla"] as const,
  grilla: (anioId?: string, seccionId?: string | null, horaEntrada?: string) =>
    [
      ...horariosKeys.grillas(),
      anioId ?? "vigente",
      seccionId ?? "",
      horaEntrada ?? "default",
    ] as const,
  cargas: () => [...horariosKeys.all, "carga"] as const,
  cargaSeccion: (anioId?: string, seccionId?: string | null) =>
    [...horariosKeys.cargas(), anioId ?? "vigente", seccionId ?? ""] as const,
};

function extraerMensajeError(error: unknown, fallback: string): string {
  if (error instanceof ApiClientError && error.message) {
    return error.message;
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallback;
}

export function useHorarioSeccionQuery(seccionId: string | null) {
  const { anio } = useAnioLectivo();
  return useQuery({
    queryKey: horariosKeys.seccion(anio?.id, seccionId),
    queryFn: () =>
      seccionId ? getHorarioSeccion(seccionId) : Promise.reject(new Error("Sin sección")),
    enabled: Boolean(seccionId),
    staleTime: 60_000,
  });
}

export function useGrillaPropuestaQuery(
  seccionId: string | null,
  horaEntrada?: string,
  enabled = false,
) {
  const { anio } = useAnioLectivo();
  return useQuery({
    queryKey: horariosKeys.grilla(anio?.id, seccionId, horaEntrada),
    queryFn: () =>
      seccionId
        ? getGrillaPropuesta(seccionId, horaEntrada)
        : Promise.reject(new Error("Sin sección")),
    enabled: Boolean(seccionId && enabled),
    staleTime: 60_000,
  });
}

export function useSeccionesPorGradoQuery(gradoId: string | null) {
  const { anio } = useAnioLectivo();
  return useQuery({
    queryKey: horariosKeys.seccionesPorGrado(anio?.id, gradoId),
    queryFn: () =>
      gradoId ? getSeccionesPorGrado(gradoId) : Promise.reject(new Error("Sin grado")),
    enabled: Boolean(gradoId),
    staleTime: 60_000,
  });
}

export function useCargaSeccionQuery(seccionId: string | null) {
  const { anio } = useAnioLectivo();
  return useQuery({
    queryKey: horariosKeys.cargaSeccion(anio?.id, seccionId),
    queryFn: () =>
      seccionId ? getCargaSeccion(seccionId) : Promise.reject(new Error("Sin sección")),
    enabled: Boolean(seccionId),
    staleTime: 60_000,
  });
}

export function useCreateBloqueMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ seccionId, payload }: { seccionId: string; payload: CreateBloquePayload }) =>
      createBloque(seccionId, payload),
    onSuccess: (res, { seccionId }) => {
      queryClient.invalidateQueries({ queryKey: horariosKeys.all });
      queryClient.invalidateQueries({ queryKey: ["secciones", "carga", seccionId] });

      if (res.mensaje) {
        toast.info(res.mensaje);
      } else {
        toast.success("Bloque guardado exitosamente.");
      }
    },
    onError: (error: unknown) => {
      toast.error(extraerMensajeError(error, "No se pudo registrar el bloque."));
    },
  });
}

export function useUpdateBloqueMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      seccionId: string;
      payload: UpdateBloquePayload;
    }) => updateBloque(id, payload),
    onSuccess: (res, { seccionId }) => {
      queryClient.invalidateQueries({ queryKey: horariosKeys.all });
      queryClient.invalidateQueries({ queryKey: ["secciones", "carga", seccionId] });

      if (res.mensaje) {
        toast.info(res.mensaje);
      } else {
        toast.success("Bloque actualizado exitosamente.");
      }
    },
    onError: (error: unknown) => {
      toast.error(extraerMensajeError(error, "No se pudo actualizar el bloque."));
    },
  });
}

export function useDeleteBloqueMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string; seccionId: string }) => deleteBloque(id),
    onSuccess: (_, { seccionId }) => {
      queryClient.invalidateQueries({ queryKey: horariosKeys.all });
      queryClient.invalidateQueries({ queryKey: ["secciones", "carga", seccionId] });
      toast.success("El bloque se eliminó del horario.");
    },
    onError: (error: unknown) => {
      toast.error(extraerMensajeError(error, "No se pudo eliminar el bloque."));
    },
  });
}

export function useCopiarHorarioMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ destinoId, origenId }: { destinoId: string; origenId: string }) =>
      copiarHorario(destinoId, origenId),
    onSuccess: (res, { destinoId }) => {
      queryClient.invalidateQueries({ queryKey: horariosKeys.all });
      queryClient.invalidateQueries({ queryKey: ["secciones", "carga", destinoId] });
      toast.success(`Se copiaron ${res.bloquesCreados} bloques exitosamente.`);
    },
    onError: (error: unknown) => {
      toast.error(extraerMensajeError(error, "No se pudo copiar el horario."));
    },
  });
}
