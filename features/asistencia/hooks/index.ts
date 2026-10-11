"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAnioLectivo } from "@/features/anio-escolar/anio-lectivo-context";
import { ApiClientError } from "@/lib/api-client";
import { toast } from "@/lib/toast";
import {
  getAsistenciaEstudiante,
  getAsistenciaSeccion,
  getListaSesion,
  getMisEstudiantes,
  getMisSecciones,
  guardarAsistenciaSesion,
  justificarFalta,
} from "../api";
import type { ExcepcionAsistencia, RangoFechas } from "../types";

export const asistenciaKeys = {
  all: ["asistencia"] as const,
  sesion: (anioId: string | undefined, id: string) =>
    [...asistenciaKeys.all, anioId ?? "vigente", "sesion", id] as const,
  misSecciones: (anioId?: string) =>
    [...asistenciaKeys.all, anioId ?? "vigente", "mis-secciones"] as const,
  misEstudiantes: (anioId?: string) =>
    [...asistenciaKeys.all, anioId ?? "vigente", "mis-estudiantes"] as const,
  estudiante: (anioId: string | undefined, id: string, rango: RangoFechas) =>
    [...asistenciaKeys.all, anioId ?? "vigente", "estudiante", id, rango] as const,
  seccion: (anioId: string | undefined, id: string, rango: RangoFechas) =>
    [...asistenciaKeys.all, anioId ?? "vigente", "seccion", id, rango] as const,
};

export function useListaSesion(sesionId?: string) {
  const { anio } = useAnioLectivo();
  return useQuery({
    queryKey: asistenciaKeys.sesion(anio?.id, sesionId ?? ""),
    queryFn: () => getListaSesion(sesionId!),
    enabled: Boolean(sesionId),
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    retry: false,
  });
}

export function useGuardarAsistencia(sesionId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (excepciones: ExcepcionAsistencia[]) =>
      guardarAsistenciaSesion(sesionId, excepciones),
    onSuccess: (respuesta) => {
      void queryClient.invalidateQueries({ queryKey: asistenciaKeys.all });
      toast.success(respuesta.mensaje);
    },
    onError: (error: ApiClientError) => toast.error(error.message),
  });
}

export function useJustificarFalta() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string; motivo: string; documentoUrl?: string }) =>
      justificarFalta(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: asistenciaKeys.all });
      toast.success("La falta quedó justificada.");
    },
    onError: (error: ApiClientError) => toast.error(error.message),
  });
}

export function useMisSecciones() {
  const { anio } = useAnioLectivo();
  return useQuery({
    queryKey: asistenciaKeys.misSecciones(anio?.id),
    queryFn: getMisSecciones,
    staleTime: 5 * 60_000,
    gcTime: 10 * 60_000,
  });
}

export function useMisEstudiantes() {
  const { anio } = useAnioLectivo();
  return useQuery({
    queryKey: asistenciaKeys.misEstudiantes(anio?.id),
    queryFn: getMisEstudiantes,
    staleTime: 5 * 60_000,
    gcTime: 10 * 60_000,
  });
}

export function useAsistenciaEstudiante(estudianteId?: string, rango?: RangoFechas) {
  const { anio } = useAnioLectivo();
  return useQuery({
    queryKey: asistenciaKeys.estudiante(
      anio?.id,
      estudianteId ?? "",
      rango ?? { desde: "", hasta: "" },
    ),
    queryFn: () => getAsistenciaEstudiante(estudianteId!, rango!),
    enabled: Boolean(estudianteId && rango),
    staleTime: 60_000,
    gcTime: 5 * 60_000,
  });
}

export function useAsistenciaSeccion(seccionId?: string, rango?: RangoFechas) {
  const { anio } = useAnioLectivo();
  return useQuery({
    queryKey: asistenciaKeys.seccion(anio?.id, seccionId ?? "", rango ?? { desde: "", hasta: "" }),
    queryFn: () => getAsistenciaSeccion(seccionId!, rango!),
    enabled: Boolean(seccionId && rango),
    staleTime: 60_000,
    gcTime: 5 * 60_000,
  });
}
