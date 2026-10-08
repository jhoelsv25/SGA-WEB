"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/lib/toast";
import { ApiClientError } from "@/lib/api-client";
import { createTurno, getTurnos, updateTurno } from "../api";
import type { CreateTurnoPayload, Turno, UpdateTurnoPayload } from "../types";

export const turnoKeys = {
  all: ["turnos"] as const,
  lists: () => [...turnoKeys.all, "list"] as const,
  details: () => [...turnoKeys.all, "detail"] as const,
  detail: (id: string) => [...turnoKeys.details(), id] as const,
};

export function useTurnosQuery() {
  return useQuery({
    queryKey: turnoKeys.lists(),
    queryFn: getTurnos,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

export function useCreateTurnoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTurnoPayload) => createTurno(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: turnoKeys.lists() });
      toast.success("Turno registrado exitosamente.");
    },
    onError: (error: unknown) => {
      if (error instanceof ApiClientError) {
        toast.error(error.message || "Error al registrar el turno.");
      } else {
        toast.error("Ocurrió un error inesperado al registrar el turno.");
      }
    },
  });
}

export function useUpdateTurnoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateTurnoPayload }) =>
      updateTurno(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: turnoKeys.lists() });
      toast.success("Los datos se guardaron correctamente.");
    },
    onError: (error: unknown) => {
      if (error instanceof ApiClientError) {
        toast.error(error.message || "Error al actualizar el turno.");
      } else {
        toast.error("Ocurrió un error inesperado al actualizar el turno.");
      }
    },
  });
}

export function useToggleTurnoActivoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, activo }: { id: string; activo: boolean }) => updateTurno(id, { activo }),
    onMutate: async ({ id, activo }) => {
      await queryClient.cancelQueries({ queryKey: turnoKeys.lists() });
      const previousTurnos = queryClient.getQueryData<Turno[]>(turnoKeys.lists());

      if (previousTurnos) {
        queryClient.setQueryData<Turno[]>(
          turnoKeys.lists(),
          previousTurnos.map((t) => (t.id === id ? { ...t, activo } : t)),
        );
      }

      return { previousTurnos };
    },
    onError: (error: unknown, _variables, context) => {
      if (context?.previousTurnos) {
        queryClient.setQueryData(turnoKeys.lists(), context.previousTurnos);
      }
      if (error instanceof ApiClientError) {
        toast.error(error.message || "Error al cambiar el estado del turno.");
      } else {
        toast.error("Ocurrió un error al cambiar el estado del turno.");
      }
    },
    onSuccess: (_data, { activo }) => {
      toast.success(
        activo
          ? "Turno activado. Las tardanzas se calcularán normalmente."
          : "Turno desactivado. Las marcaciones se registrarán sin calcular tardanza.",
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: turnoKeys.lists() });
    },
  });
}
