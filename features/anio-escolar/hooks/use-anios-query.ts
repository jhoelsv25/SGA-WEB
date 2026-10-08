"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/features/auth";
import { ApiClientError } from "@/lib/api-client";
import { toast } from "@/lib/toast";
import {
  cerrarAnio,
  cerrarBimestre,
  createAnio,
  getAnioEnCurso,
  getAnios,
  guardarBimestres,
  iniciarAnio,
  iniciarBimestre,
  reabrirAnio,
  updateAnio,
} from "../api";
import type {
  BimestreFechaInput,
  CreateAnioPayload,
  ReabrirAnioPayload,
  UpdateAnioPayload,
} from "../types";

export const anioKeys = {
  all: ["anios-academicos"] as const,
  lists: () => [...anioKeys.all, "list"] as const,
  vigente: () => [...anioKeys.all, "vigente"] as const,
};

function mensaje(error: unknown, fallback: string): string {
  if (error instanceof ApiClientError && error.message) return error.message;
  return fallback;
}

export function useEsAdministrador(): boolean {
  const { data } = useSession();
  const rol = (data?.user.roles?.[0] ?? "").toLowerCase();
  return rol.includes("admin");
}

export function useAniosQuery(enabled = true) {
  return useQuery({
    queryKey: anioKeys.lists(),
    queryFn: getAnios,
    enabled,
  });
}

export function useAnioVigenteQuery() {
  return useQuery({
    queryKey: anioKeys.vigente(),
    queryFn: getAnioEnCurso,
    retry: false,
  });
}

function invalidarAnios(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: anioKeys.all });
  queryClient.invalidateQueries({ queryKey: ["calendario"] });
}

export function useCreateAnioMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateAnioPayload) => createAnio(payload),
    onSuccess: () => {
      invalidarAnios(queryClient);
      toast.success("El año escolar quedó en planificado, con sus bimestres.");
    },
    onError: (error: unknown) => toast.error(mensaje(error, "No se pudo crear el año escolar.")),
  });
}

export function useUpdateAnioMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateAnioPayload }) =>
      updateAnio(id, payload),
    onSuccess: () => {
      invalidarAnios(queryClient);
      toast.success("Las fechas del año se guardaron.");
    },
    onError: (error: unknown) => toast.error(mensaje(error, "No se pudieron guardar las fechas.")),
  });
}

export function useGuardarBimestresMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, bimestres }: { id: string; bimestres: BimestreFechaInput[] }) =>
      guardarBimestres(id, bimestres),
    onSuccess: () => {
      invalidarAnios(queryClient);
      toast.success("Las fechas de los bimestres se guardaron.");
    },
    onError: (error: unknown) =>
      toast.error(mensaje(error, "No se pudieron guardar los bimestres.")),
  });
}

export function useIniciarAnioMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => iniciarAnio(id),
    onSuccess: () => {
      invalidarAnios(queryClient);
      toast.success("El año escolar está en curso.");
    },
    onError: (error: unknown) => toast.error(mensaje(error, "No se pudo iniciar el año.")),
  });
}

export function useCerrarAnioMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => cerrarAnio(id),
    onSuccess: () => {
      invalidarAnios(queryClient);
      toast.success("El año escolar quedó cerrado.");
    },
    onError: (error: unknown) => toast.error(mensaje(error, "No se pudo cerrar el año.")),
  });
}

export function useReabrirAnioMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ReabrirAnioPayload }) =>
      reabrirAnio(id, payload),
    onSuccess: () => {
      invalidarAnios(queryClient);
      toast.success("El año quedó reabierto hasta la fecha límite.");
    },
    onError: (error: unknown) => toast.error(mensaje(error, "No se pudo reabrir el año.")),
  });
}

export function useIniciarBimestreMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ anioId, bimestreId }: { anioId: string; bimestreId: string }) =>
      iniciarBimestre(anioId, bimestreId),
    onSuccess: () => {
      invalidarAnios(queryClient);
      toast.success("El bimestre está en curso.");
    },
    onError: (error: unknown) => toast.error(mensaje(error, "No se pudo iniciar el bimestre.")),
  });
}

export function useCerrarBimestreMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ anioId, bimestreId }: { anioId: string; bimestreId: string }) =>
      cerrarBimestre(anioId, bimestreId),
    onSuccess: () => {
      invalidarAnios(queryClient);
      toast.success("El bimestre quedó cerrado. Sus fechas ya no admiten sesiones ni ausencias.");
    },
    onError: (error: unknown) => toast.error(mensaje(error, "No se pudo cerrar el bimestre.")),
  });
}
