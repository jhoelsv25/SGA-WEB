"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/lib/toast";
import { ApiClientError } from "@/lib/api-client";
import { getVariableHistorial, getVariables, updateVariable } from "../api";
import type { UpdateVariablePayload } from "../types";

export const variableKeys = {
  all: ["variables-sistema"] as const,
  lists: () => [...variableKeys.all, "list"] as const,
  list: (modulo?: string) => [...variableKeys.lists(), { modulo }] as const,
  historial: (codigo: string) => [...variableKeys.all, "historial", codigo] as const,
};

export function useVariablesQuery(modulo?: string) {
  return useQuery({
    queryKey: variableKeys.list(modulo),
    queryFn: () => getVariables(modulo),
    staleTime: 1000 * 60 * 2,
  });
}

export function useVariableHistorialQuery(codigo: string | null) {
  return useQuery({
    queryKey: variableKeys.historial(codigo || ""),
    queryFn: () => getVariableHistorial(codigo!),
    enabled: Boolean(codigo),
  });
}

export function useUpdateVariableMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ codigo, payload }: { codigo: string; payload: UpdateVariablePayload }) =>
      updateVariable(codigo, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: variableKeys.all });
      toast.success("Los datos se guardaron correctamente.");
    },
    onError: (error: unknown) => {
      if (error instanceof ApiClientError) {
        toast.error(error.message || "Error al actualizar la variable.");
      } else {
        toast.error("Ocurrió un error inesperado al actualizar la variable.");
      }
    },
  });
}
