"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/features/auth";
import { useAnioLectivo } from "@/features/anio-escolar/anio-lectivo-context";
import { ApiClientError } from "@/lib/api-client";
import { toast } from "@/lib/toast";
import { cerrarSeccion, createSeccion, getSeccionById, getSecciones, updateSeccion } from "../api";
import type { CreateSeccionPayload, SeccionQueryParams, UpdateSeccionPayload } from "../types";

export const seccionesKeys = {
  all: ["secciones"] as const,
  lists: () => [...seccionesKeys.all, "list"] as const,
  list: (anioId?: string, params?: SeccionQueryParams) =>
    [...seccionesKeys.lists(), anioId ?? "vigente", params ?? {}] as const,
  details: () => [...seccionesKeys.all, "detail"] as const,
  detail: (id: string) => [...seccionesKeys.details(), id] as const,
};

export const MENU_SECCIONES = "/admin/secciones";

/**
 * RF-008 HU1: Permiso para gestionar secciones.
 * Sin el menú /admin/secciones (y sin ser Administrador), el usuario solo puede consultar.
 */
export function usePuedeGestionarSecciones(): boolean {
  const { data } = useSession();
  const rol = data?.user.activeRoleName ?? data?.user.roles?.[0] ?? "";
  if (rol === "Administrador" || rol.toLowerCase().includes("admin")) return true;
  return data?.user.menuRoutes?.includes(MENU_SECCIONES) ?? false;
}

export function useSeccionesQuery(params?: SeccionQueryParams, enabled = true) {
  const { anio } = useAnioLectivo();
  return useQuery({
    queryKey: seccionesKeys.list(anio?.id, params),
    queryFn: () => getSecciones(params),
    enabled,
    staleTime: 1000 * 60 * 2,
  });
}

export function useSeccionQuery(id?: string, enabled = true) {
  return useQuery({
    queryKey: seccionesKeys.detail(id ?? ""),
    queryFn: () => getSeccionById(id!),
    enabled: Boolean(id) && enabled,
    staleTime: 1000 * 60 * 2,
  });
}

export function useCreateSeccionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateSeccionPayload) => createSeccion(payload),
    onSuccess: (seccion) => {
      queryClient.invalidateQueries({ queryKey: seccionesKeys.all });
      toast.success(`Sección ${seccion.gradoNombre} "${seccion.nombre}" creada exitosamente.`);
    },
    onError: (error: unknown) => {
      const msg = error instanceof ApiClientError ? error.message : "Error al crear la sección.";
      toast.error(msg);
    },
  });
}

export function useUpdateSeccionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateSeccionPayload }) =>
      updateSeccion(id, payload),
    onSuccess: (seccion) => {
      queryClient.invalidateQueries({ queryKey: seccionesKeys.all });
      toast.success(`Sección ${seccion.gradoNombre} "${seccion.nombre}" actualizada.`);
    },
    onError: (error: unknown) => {
      const msg =
        error instanceof ApiClientError ? error.message : "Error al actualizar la sección.";
      toast.error(msg);
    },
  });
}

export function useCerrarSeccionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => cerrarSeccion(id),
    onSuccess: (seccion) => {
      queryClient.invalidateQueries({ queryKey: seccionesKeys.all });
      toast.success(`Sección ${seccion.gradoNombre} "${seccion.nombre}" cerrada exitosamente.`);
    },
    onError: (error: unknown) => {
      const msg = error instanceof ApiClientError ? error.message : "Error al cerrar la sección.";
      toast.error(msg);
    },
  });
}
