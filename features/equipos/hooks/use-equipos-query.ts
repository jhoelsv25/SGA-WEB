"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/lib/toast";
import { ApiClientError } from "@/lib/api-client";
import {
  autorizarEquipo,
  createEquipo,
  getEquipos,
  updateEquipo,
  validarKiosko,
  type GetEquiposFilters,
} from "../api";
import { KIOSK_TOKEN_STORAGE_KEY } from "../consts";
import type { CreateEquipoPayload, UpdateEquipoPayload } from "../types";

export const equipoKeys = {
  all: ["equipos"] as const,
  lists: () => [...equipoKeys.all, "list"] as const,
  list: (filters?: GetEquiposFilters) => [...equipoKeys.lists(), { filters }] as const,
  details: () => [...equipoKeys.all, "detail"] as const,
  detail: (id: string) => [...equipoKeys.details(), id] as const,
  validar: (token?: string) => [...equipoKeys.all, "validar", token] as const,
};

export function useEquiposQuery(filters?: GetEquiposFilters) {
  return useQuery({
    queryKey: equipoKeys.list(filters),
    queryFn: () => getEquipos(filters),
    staleTime: 1000 * 60 * 3, // 3 minutos
  });
}

export function useCreateEquipoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateEquipoPayload) => createEquipo(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: equipoKeys.lists() });
      toast.success("Equipo registrado exitosamente.");
    },
    onError: (error: unknown) => {
      if (error instanceof ApiClientError) {
        toast.error(error.message || "Error al registrar el equipo.");
      } else {
        toast.error("Ocurrió un error inesperado al registrar el equipo.");
      }
    },
  });
}

export function useUpdateEquipoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateEquipoPayload }) =>
      updateEquipo(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: equipoKeys.lists() });
      toast.success("Los datos se guardaron correctamente.");
    },
    onError: (error: unknown) => {
      if (error instanceof ApiClientError) {
        toast.error(error.message || "Error al actualizar el equipo.");
      } else {
        toast.error("Ocurrió un error inesperado al actualizar el equipo.");
      }
    },
  });
}

export function useToggleEquipoActivoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, activo }: { id: string; activo: boolean }) => updateEquipo(id, { activo }),
    onSuccess: (_data, { activo }) => {
      queryClient.invalidateQueries({ queryKey: equipoKeys.lists() });
      toast.success(
        activo
          ? "Equipo activado exitosamente."
          : "Equipo desactivado. Dejará de funcionar de inmediato.",
      );
    },
    onError: (error: unknown) => {
      if (error instanceof ApiClientError) {
        toast.error(error.message || "Error al cambiar el estado del equipo.");
      } else {
        toast.error("Ocurrió un error inesperado.");
      }
    },
  });
}

export function useAutorizarEquipoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => autorizarEquipo(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: equipoKeys.lists() });
      // Guardar token en localStorage para que este dispositivo quede autorizado
      if (typeof window !== "undefined" && data.tokenAutorizacion) {
        localStorage.setItem(KIOSK_TOKEN_STORAGE_KEY, data.tokenAutorizacion);
      }
      toast.success("Equipo autorizado. Ya puede usarse como kiosko.");
    },
    onError: (error: unknown) => {
      if (error instanceof ApiClientError) {
        toast.error(error.message || "Error al autorizar el equipo.");
      } else {
        toast.error("No se pudo completar la autorización del equipo.");
      }
    },
  });
}

export function useValidarKioskoQuery(token?: string) {
  return useQuery({
    queryKey: equipoKeys.validar(token),
    queryFn: () => validarKiosko(token),
    enabled: Boolean(token),
    retry: 1,
    staleTime: 1000 * 60 * 1, // 1 minuto
  });
}
