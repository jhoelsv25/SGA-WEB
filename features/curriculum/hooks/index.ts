"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/lib/toast";
import { ApiClientError } from "@/lib/api-client";
import {
  addCursoPlan,
  copyPlan,
  createCurso,
  desactivarCurso,
  getCursos,
  getGrados,
  getPlanEstudio,
  reactivarCurso,
  removeCursoPlan,
  updateCurso,
  updateGrado,
  updateHorasPlan,
} from "../api";
import type {
  AddCursoPlanPayload,
  CreateCursoPayload,
  FilterCursoParams,
  UpdateCursoPayload,
  UpdateGradoPayload,
  UpdateHorasPlanPayload,
} from "../types";

export const curriculumKeys = {
  all: ["curriculum"] as const,
  grados: () => [...curriculumKeys.all, "grados"] as const,
  cursos: (filter?: FilterCursoParams) => [...curriculumKeys.all, "cursos", filter] as const,
  planEstudio: (gradoId: string) => [...curriculumKeys.all, "plan-estudio", gradoId] as const,
};

// ==================== GRADOS (HU1) ====================

export function useGradosQuery() {
  return useQuery({
    queryKey: curriculumKeys.grados(),
    queryFn: getGrados,
    staleTime: 1000 * 60 * 5,
  });
}

export function useUpdateGradoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateGradoPayload }) =>
      updateGrado(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: curriculumKeys.grados() });
      queryClient.invalidateQueries({ queryKey: curriculumKeys.all });
      toast.success("Nombre del grado actualizado correctamente.");
    },
    onError: (error: unknown) => {
      if (error instanceof ApiClientError) {
        toast.error(error.message);
      } else {
        toast.error("Error al actualizar el nombre del grado.");
      }
    },
  });
}

// ==================== CURSOS (HU2) ====================

export function useCursosQuery(filter?: FilterCursoParams) {
  return useQuery({
    queryKey: curriculumKeys.cursos(filter),
    queryFn: () => getCursos(filter),
    staleTime: 1000 * 60 * 2,
  });
}

export function useCreateCursoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCursoPayload) => createCurso(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: curriculumKeys.all });
      toast.success("Curso creado exitosamente.");
    },
    onError: (error: unknown) => {
      if (error instanceof ApiClientError) {
        toast.error(error.message);
      } else {
        toast.error("Error al crear el curso.");
      }
    },
  });
}

export function useUpdateCursoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateCursoPayload }) =>
      updateCurso(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: curriculumKeys.all });
      toast.success("Curso modificado exitosamente.");
    },
    onError: (error: unknown) => {
      if (error instanceof ApiClientError) {
        toast.error(error.message);
      } else {
        toast.error("Error al modificar el curso.");
      }
    },
  });
}

export function useDesactivarCursoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => desactivarCurso(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: curriculumKeys.all });
      toast.success("Curso desactivado correctamente.");
    },
    onError: (error: unknown) => {
      if (error instanceof ApiClientError) {
        toast.error(error.message);
      } else {
        toast.error("Error al desactivar el curso.");
      }
    },
  });
}

export function useReactivarCursoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => reactivarCurso(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: curriculumKeys.all });
      toast.success("Curso reactivado exitosamente.");
    },
    onError: (error: unknown) => {
      if (error instanceof ApiClientError) {
        toast.error(error.message);
      } else {
        toast.error("Error al reactivar el curso.");
      }
    },
  });
}

// ==================== PLAN DE ESTUDIOS (HU3) ====================

export function usePlanEstudioQuery(gradoId: string) {
  return useQuery({
    queryKey: curriculumKeys.planEstudio(gradoId),
    queryFn: () => getPlanEstudio(gradoId),
    enabled: Boolean(gradoId),
    staleTime: 1000 * 60 * 2,
  });
}

export function useAddCursoPlanMutation(gradoId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AddCursoPlanPayload) => addCursoPlan(gradoId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: curriculumKeys.planEstudio(gradoId) });
      toast.success("Asignatura agregada al plan de estudios.");
    },
    onError: (error: unknown) => {
      if (error instanceof ApiClientError) {
        toast.error(error.message);
      } else {
        toast.error("Error al agregar la asignatura al plan.");
      }
    },
  });
}

export function useUpdateHorasPlanMutation(gradoId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateHorasPlanPayload }) =>
      updateHorasPlan(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: curriculumKeys.planEstudio(gradoId) });
      toast.success("Horas pedagógicas actualizadas.");
    },
    onError: (error: unknown) => {
      if (error instanceof ApiClientError) {
        toast.error(error.message);
      } else {
        toast.error("Error al actualizar las horas.");
      }
    },
  });
}

export function useRemoveCursoPlanMutation(gradoId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => removeCursoPlan(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: curriculumKeys.planEstudio(gradoId) });
      toast.success("Curso retirado del plan de estudios exitosamente.");
    },
    onError: (error: unknown) => {
      if (error instanceof ApiClientError) {
        toast.error(error.message);
      } else {
        toast.error("Error al retirar el curso del plan.");
      }
    },
  });
}

export function useCopyPlanMutation(gradoId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (origenGradoId: string) => copyPlan(gradoId, origenGradoId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: curriculumKeys.planEstudio(gradoId) });
      toast.success(
        data.mensaje || "Se copió el plan de estudios. Revise las horas antes de guardar.",
      );
    },
    onError: (error: unknown) => {
      if (error instanceof ApiClientError) {
        toast.error(error.message);
      } else {
        toast.error("Error al copiar el plan de estudios.");
      }
    },
  });
}
