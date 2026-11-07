"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiClientError } from "@/lib/api-client";
import { toast } from "@/lib/toast";
import { getEquiposAcceso, resolverEquipoAcceso } from "../api";
import { ACCION_EQUIPO_ACCESO_TEXTOS } from "../consts";
import type { AccionEquipoAcceso } from "../types";

export const equipoAccesoKeys = {
  all: ["equipos-acceso"] as const,
  lists: () => [...equipoAccesoKeys.all, "list"] as const,
};

export function useEquiposAccesoQuery() {
  return useQuery({
    queryKey: equipoAccesoKeys.lists(),
    queryFn: () => getEquiposAcceso(),
    staleTime: 1000 * 30,
  });
}

export function useResolverEquipoAccesoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      accion,
      motivo,
    }: {
      id: string;
      accion: AccionEquipoAcceso;
      motivo?: string;
    }) => resolverEquipoAcceso(id, accion, motivo),
    onSuccess: (_data, { accion }) => {
      queryClient.invalidateQueries({ queryKey: equipoAccesoKeys.lists() });
      toast.success(ACCION_EQUIPO_ACCESO_TEXTOS[accion].exito);
    },
    onError: (error: unknown) => {
      toast.error(
        error instanceof ApiClientError
          ? error.message || "No se pudo completar la acción."
          : "Ocurrió un error inesperado.",
      );
    },
  });
}
