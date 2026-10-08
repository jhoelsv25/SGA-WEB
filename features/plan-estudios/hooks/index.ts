"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/lib/toast";
import { ApiClientError } from "@/lib/api-client";
import { addCursoPlan, copyPlan, getPlanEstudio, removeCursoPlan, updateHorasPlan } from "../api";
import type { AddCursoPlanPayload, UpdateHorasPlanPayload } from "../types";

export const planEstudiosKeys = {
  all: ["plan-estudios"] as const,
  byGrado: (gradoId: string) => [...planEstudiosKeys.all, gradoId] as const,
};

export function usePlanEstudioQuery(gradoId: string) {
  return useQuery({
    queryKey: planEstudiosKeys.byGrado(gradoId),
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
      queryClient.invalidateQueries({ queryKey: planEstudiosKeys.byGrado(gradoId) });
      queryClient.invalidateQueries({ queryKey: ["curriculum"] });
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
      queryClient.invalidateQueries({ queryKey: planEstudiosKeys.byGrado(gradoId) });
      queryClient.invalidateQueries({ queryKey: ["curriculum"] });
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
      queryClient.invalidateQueries({ queryKey: planEstudiosKeys.byGrado(gradoId) });
      queryClient.invalidateQueries({ queryKey: ["curriculum"] });
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
      queryClient.invalidateQueries({ queryKey: planEstudiosKeys.byGrado(gradoId) });
      queryClient.invalidateQueries({ queryKey: ["curriculum"] });
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
