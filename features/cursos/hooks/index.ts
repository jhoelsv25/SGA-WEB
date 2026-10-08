"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/lib/toast";
import { ApiClientError } from "@/lib/api-client";
import { createCurso, desactivarCurso, getCursos, reactivarCurso, updateCurso } from "../api";
import type { CreateCursoPayload, FilterCursoParams, UpdateCursoPayload } from "../types";

export const cursosKeys = {
  all: ["cursos"] as const,
  lists: () => [...cursosKeys.all, "list"] as const,
  list: (filter?: FilterCursoParams) => [...cursosKeys.lists(), filter] as const,
  detail: (id: string) => [...cursosKeys.all, "detail", id] as const,
};

export function useCursosQuery(filter?: FilterCursoParams) {
  return useQuery({
    queryKey: cursosKeys.list(filter),
    queryFn: () => getCursos(filter),
    staleTime: 1000 * 60 * 2,
  });
}

export function useCreateCursoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCursoPayload) => createCurso(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cursosKeys.all });
      queryClient.invalidateQueries({ queryKey: ["curriculum"] });
      queryClient.invalidateQueries({ queryKey: ["plan-estudios"] });
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
      queryClient.invalidateQueries({ queryKey: cursosKeys.all });
      queryClient.invalidateQueries({ queryKey: ["curriculum"] });
      queryClient.invalidateQueries({ queryKey: ["plan-estudios"] });
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
      queryClient.invalidateQueries({ queryKey: cursosKeys.all });
      queryClient.invalidateQueries({ queryKey: ["curriculum"] });
      queryClient.invalidateQueries({ queryKey: ["plan-estudios"] });
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
      queryClient.invalidateQueries({ queryKey: cursosKeys.all });
      queryClient.invalidateQueries({ queryKey: ["curriculum"] });
      queryClient.invalidateQueries({ queryKey: ["plan-estudios"] });
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
