"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiClientError } from "@/lib/api-client";
import { toast } from "@/lib/toast";
import { asignarCodigoBiometrico, getCodigoBiometrico, quitarCodigoBiometrico } from "../api";

export const biometricoKeys = {
  all: ["biometrico"] as const,
  codigo: (personaId: string) => [...biometricoKeys.all, "codigo", personaId] as const,
};

export function useCodigoBiometrico(personaId: string | undefined) {
  return useQuery({
    queryKey: biometricoKeys.codigo(personaId ?? ""),
    queryFn: () => getCodigoBiometrico(personaId as string),
    enabled: Boolean(personaId),
    staleTime: 0,
  });
}

export function useAsignarCodigoBiometrico() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ personaId, codigo }: { personaId: string; codigo: string }) =>
      asignarCodigoBiometrico(personaId, codigo),
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: biometricoKeys.codigo(data.personaId) });
      toast.success(data.mensaje);
    },
    onError: (error: ApiClientError) => toast.error(error.message),
  });
}

export function useQuitarCodigoBiometrico() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (personaId: string) => quitarCodigoBiometrico(personaId),
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: biometricoKeys.codigo(data.personaId) });
      toast.success(data.mensaje);
    },
    onError: (error: ApiClientError) => toast.error(error.message),
  });
}
