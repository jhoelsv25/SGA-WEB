"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/features/auth";
import { useAnioLectivo } from "@/features/anio-escolar/anio-lectivo-context";
import { miHorarioApi } from "../api";
import type {
  BloqueHorarioVista,
  HorarioEstudianteResponse,
  MiHorarioDocenteResponse,
  RolHorarioActivo,
} from "../types";
import {
  mapearBloqueDocenteAVista,
  mapearBloqueEstudianteAVista,
  unificarBloquesContiguos,
} from "../utils";

export const miHorarioKeys = {
  all: ["mi-horario"] as const,
  docente: (anioId?: string) => [...miHorarioKeys.all, "docente", anioId] as const,
  estudiante: (estudianteId?: string, anioId?: string) =>
    [...miHorarioKeys.all, "estudiante", estudianteId, anioId] as const,
};

/**
 * Hook para consultar el horario propio del docente autenticado.
 */
export function useMiHorarioDocente(anioId?: string, enabled = true) {
  return useQuery<MiHorarioDocenteResponse>({
    queryKey: miHorarioKeys.docente(anioId),
    queryFn: () => miHorarioApi.getMiHorarioDocente(),
    enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Hook para consultar el horario de la sección de un estudiante.
 */
export function useHorarioEstudiante(estudianteId?: string, anioId?: string, enabled = true) {
  return useQuery<HorarioEstudianteResponse>({
    queryKey: miHorarioKeys.estudiante(estudianteId, anioId),
    queryFn: () => miHorarioApi.getHorarioEstudiante(estudianteId!),
    enabled: Boolean(estudianteId) && enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Hook orquestador principal que identifica el rol activo de la sesión
 * institucional y despacha la consulta correspondiente según RF-008 HU3.
 */
export function useMiHorarioActivo() {
  const { data: sessionData, isLoading: isLoadingSession } = useSession();
  const { anio: anioLectivo, cargando: isLoadingAnio } = useAnioLectivo();
  const anioId = anioLectivo?.id;

  const user = sessionData?.user;
  const activeRoleName = (user?.activeRoleName ?? "").trim().toLowerCase();

  const rol: RolHorarioActivo = React.useMemo(() => {
    if (!activeRoleName) return "otro";
    if (activeRoleName.includes("docente")) return "docente";
    if (activeRoleName.includes("estudiante")) return "estudiante";
    if (activeRoleName.includes("apoderado")) return "apoderado";
    return "otro";
  }, [activeRoleName]);

  const estudianteId = React.useMemo(() => {
    if (rol !== "estudiante" || !user) return undefined;
    return (user as { personaId?: string }).personaId || user.id;
  }, [rol, user]);

  const queryDocente = useMiHorarioDocente(anioId, rol === "docente" && !isLoadingSession);
  const queryEstudiante = useHorarioEstudiante(
    estudianteId,
    anioId,
    rol === "estudiante" && Boolean(estudianteId) && !isLoadingSession,
  );

  const bloques: BloqueHorarioVista[] = React.useMemo(() => {
    if (rol === "docente" && queryDocente.data?.bloques) {
      const mapeados = queryDocente.data.bloques.map(mapearBloqueDocenteAVista);
      return unificarBloquesContiguos(mapeados);
    }

    if (rol === "estudiante" && queryEstudiante.data?.bloques) {
      const mapeados = queryEstudiante.data.bloques.map(mapearBloqueEstudianteAVista);
      return unificarBloquesContiguos(mapeados);
    }

    return [];
  }, [rol, queryDocente.data, queryEstudiante.data]);

  const isLoading =
    isLoadingSession ||
    isLoadingAnio ||
    (rol === "docente" && queryDocente.isLoading) ||
    (rol === "estudiante" && queryEstudiante.isLoading);

  const isError =
    (rol === "docente" && queryDocente.isError) ||
    (rol === "estudiante" && queryEstudiante.isError);

  const error =
    rol === "docente" ? queryDocente.error : rol === "estudiante" ? queryEstudiante.error : null;

  const isFetching =
    (rol === "docente" && queryDocente.isFetching) ||
    (rol === "estudiante" && queryEstudiante.isFetching);

  const refetch = React.useCallback(() => {
    if (rol === "docente") void queryDocente.refetch();
    if (rol === "estudiante") void queryEstudiante.refetch();
  }, [rol, queryDocente, queryEstudiante]);

  return {
    rol,
    user,
    anioLectivo,
    bloques,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  };
}
