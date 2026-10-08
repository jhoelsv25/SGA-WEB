import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/lib/toast";
import { ApiClientError } from "@/lib/api-client";
import { getGrados, updateGrado } from "../api";
import type { UpdateGradoPayload } from "../types";

export const GRADOS_QUERY_KEY = ["grados"] as const;

export function useGradosQuery() {
  return useQuery({
    queryKey: GRADOS_QUERY_KEY,
    queryFn: getGrados,
  });
}

export function useUpdateGradoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateGradoPayload }) =>
      updateGrado(id, payload),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: GRADOS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["plan-estudios"] });
      queryClient.invalidateQueries({ queryKey: ["curriculum"] });
      toast.success(`Grado actualizado a "${updated.nombre}" exitosamente.`);
    },
    onError: (error: unknown) => {
      if (error instanceof ApiClientError) {
        toast.error(error.message);
      } else {
        toast.error("Error al actualizar el grado.");
      }
    },
  });
}
