"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/features/auth";
import { ApiClientError } from "@/lib/api-client";
import { toast } from "@/lib/toast";
import { createEvento, deleteEvento, getCalendario, updateEvento } from "../api";
import type { EventoCalendario, GuardarEventoPayload } from "../types";

export const calendarioKeys = {
  all: ["calendario"] as const,
  mes: (anio?: number, mes?: number, anioAcademicoId?: string) =>
    [...calendarioKeys.all, anioAcademicoId ?? "vigente", anio ?? "vigente", mes ?? "mes"] as const,
};

function mensaje(error: unknown, fallback: string): string {
  if (error instanceof ApiClientError && error.message) return error.message;
  return fallback;
}

function avisarEvento(evento: EventoCalendario, fallback: string) {
  if (evento.mensaje) {
    toast.info(evento.mensaje);
    return;
  }
  toast.success(fallback);
}

export function useCalendarioQuery(
  mes?: number,
  anio?: number,
  anioAcademicoId?: string,
  enabled = true,
) {
  return useQuery({
    queryKey: calendarioKeys.mes(anio, mes, anioAcademicoId),
    queryFn: () => getCalendario(mes, anio),
    enabled,
    retry: false,
  });
}

const MENU_CALENDARIO = "/admin/calendario";

/** RF-002 V3: el acceso es por menú (Roles-Menú); el servidor también lo valida. */
export function usePuedeRegistrarCalendario(): boolean {
  const { data } = useSession();
  const rol = data?.user.activeRoleName ?? data?.user.roles?.[0] ?? "";
  if (rol === "Administrador") return true;
  return data?.user.menuRoutes?.includes(MENU_CALENDARIO) ?? false;
}

export function useEsAdministrador(): boolean {
  const { data } = useSession();
  const rol = (data?.user.roles?.[0] ?? "").toLowerCase();
  return rol.includes("admin");
}

export function useCreateEventoMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: GuardarEventoPayload) => createEvento(payload),
    onSuccess: (evento) => {
      queryClient.invalidateQueries({ queryKey: calendarioKeys.all });
      avisarEvento(evento, "El evento quedó en el calendario.");
    },
    onError: (error: unknown) => toast.error(mensaje(error, "No se pudo registrar el evento.")),
  });
}

export function useUpdateEventoMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<GuardarEventoPayload> }) =>
      updateEvento(id, payload),
    onSuccess: (evento) => {
      queryClient.invalidateQueries({ queryKey: calendarioKeys.all });
      avisarEvento(evento, "El evento se actualizó.");
    },
    onError: (error: unknown) => toast.error(mensaje(error, "No se pudo editar el evento.")),
  });
}

export function useDeleteEventoMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteEvento(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: calendarioKeys.all });
      toast.success("El evento se eliminó del calendario.");
    },
    onError: (error: unknown) => toast.error(mensaje(error, "No se pudo eliminar el evento.")),
  });
}
