"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAnioLectivo } from "@/features/anio-escolar/anio-lectivo-context";
import { useSession } from "@/features/auth";
import { ApiClientError } from "@/lib/api-client";
import { toast } from "@/lib/toast";
import {
  aprobarJustificacion,
  asignarReemplazo,
  corregirTema,
  getJustificacionesSolicitadas,
  getMisSesiones,
  getPanelSesionesHoy,
  rechazarJustificacion,
  solicitarJustificacion,
} from "../api";
import { INTERVALO_PANEL_SESIONES_MS, MENU_JUSTIFICACIONES_SESION } from "../consts";

export const sesionesKeys = {
  all: ["sesiones-clase"] as const,
  panel: (anioId?: string) => [...sesionesKeys.all, anioId ?? "vigente", "panel-hoy"] as const,
  justificaciones: (anioId?: string) =>
    [...sesionesKeys.all, anioId ?? "vigente", "justificaciones"] as const,
  mias: (anioId: string | undefined, desde: string, hasta: string) =>
    [...sesionesKeys.all, anioId ?? "vigente", "mis-sesiones", desde, hasta] as const,
};

export function usePanelSesionesHoy() {
  const { anio } = useAnioLectivo();
  return useQuery({
    queryKey: sesionesKeys.panel(anio?.id),
    queryFn: getPanelSesionesHoy,
    refetchInterval: INTERVALO_PANEL_SESIONES_MS,
    staleTime: 10_000,
    gcTime: 5 * 60_000,
  });
}

export function useJustificacionesSolicitadas() {
  const { anio } = useAnioLectivo();
  return useQuery({
    queryKey: sesionesKeys.justificaciones(anio?.id),
    queryFn: getJustificacionesSolicitadas,
    staleTime: 30_000,
    gcTime: 5 * 60_000,
  });
}

export function useMisSesiones(rango?: { desde: string; hasta: string }) {
  const { anio } = useAnioLectivo();
  return useQuery({
    queryKey: sesionesKeys.mias(anio?.id, rango?.desde ?? "", rango?.hasta ?? ""),
    queryFn: () => getMisSesiones(rango!.desde, rango!.hasta),
    enabled: Boolean(rango),
    staleTime: 60_000,
    gcTime: 5 * 60_000,
  });
}

function useMutacionSesion<TVariables>(
  mutationFn: (variables: TVariables) => Promise<unknown>,
  mensaje: (resultado: unknown) => string,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: (resultado) => {
      void queryClient.invalidateQueries({ queryKey: sesionesKeys.all });
      toast.success(mensaje(resultado));
    },
    onError: (error: ApiClientError) => toast.error(error.message),
  });
}

const mensajeDe = (resultado: unknown, porDefecto: string): string =>
  resultado && typeof resultado === "object" && "mensaje" in resultado
    ? String((resultado as { mensaje: unknown }).mensaje)
    : porDefecto;

export function useAsignarReemplazo() {
  return useMutacionSesion(
    ({ id, docenteId }: { id: string; docenteId: string }) => asignarReemplazo(id, docenteId),
    () => "Reemplazo asignado.",
  );
}

export function useAprobarJustificacion() {
  return useMutacionSesion(
    (id: string) => aprobarJustificacion(id),
    (r) => mensajeDe(r, "Sesión justificada."),
  );
}

export function useRechazarJustificacion() {
  return useMutacionSesion(
    ({ id, comentario }: { id: string; comentario: string }) =>
      rechazarJustificacion(id, comentario),
    (r) => mensajeDe(r, "La justificación fue rechazada."),
  );
}

export function useCorregirTema() {
  return useMutacionSesion(
    ({ id, tema }: { id: string; tema: string }) => corregirTema(id, tema),
    () => "Tema actualizado.",
  );
}

export function useSolicitarJustificacion() {
  return useMutacionSesion(
    ({ id, ...payload }: { id: string; motivo: string; documentoUrl?: string }) =>
      solicitarJustificacion(id, payload),
    (r) => mensajeDe(r, "Su justificación fue enviada al subdirector."),
  );
}

/** El reemplazo y las justificaciones requieren el menú de justificaciones (Subdirección). */
export function usePuedeGestionarSesiones(): boolean {
  const { data } = useSession();
  if (data?.user.activeRoleName === "Administrador") return true;
  return data?.user.menuRoutes?.includes(MENU_JUSTIFICACIONES_SESION) ?? false;
}
