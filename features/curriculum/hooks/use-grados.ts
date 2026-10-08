"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/lib/toast";
import { ApiClientError } from "@/lib/api-client";
import { getGrados, updateGrado } from "../api";
import { curriculumKeys } from "./curriculum-keys";
import type { UpdateGradoPayload } from "../types";

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
