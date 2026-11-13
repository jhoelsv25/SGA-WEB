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
  firmarIngresoWeb,
  firmarSalidaWeb,
  getJustificacionesSolicitadas,
  getMiJornadaHoy,
  getMisSesiones,
  getPanelSesionesHoy,
  rechazarJustificacion,
  solicitarJustificacion,
} from "../api";
import { INTERVALO_PANEL_SESIONES_MS, MENU_JUSTIFICACIONES_SESION } from "../consts";
import { extraerMensajeSesion } from "../utils";

export const sesionesKeys = {
  all: ["sesiones-clase"] as const,
  panel: (anioId?: string) => [...sesionesKeys.all, anioId ?? "vigente", "panel-hoy"] as const,
  justificaciones: (anioId?: string) =>
    [...sesionesKeys.all, anioId ?? "vigente", "justificaciones"] as const,
  mias: (anioId: string | undefined, desde: string, hasta: string) =>
    [...sesionesKeys.all, anioId ?? "vigente", "mis-sesiones", desde, hasta] as const,
  jornadaHoy: (anioId?: string) =>
    [...sesionesKeys.all, anioId ?? "vigente", "mi-jornada-hoy"] as const,
};

export function usePanelSesionesHoy() {
  const { anio } = useAnioLectivo();
  return useQuery({
    queryKey: sesionesKeys.panel(anio?.id),
    queryFn: getPanelSesionesHoy,
    refetchInterval: INTERVALO_PANEL_SESIONES_MS,
    refetchIntervalInBackground: false,
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

export function useMiJornadaHoy(enabled: boolean) {
  const { anio } = useAnioLectivo();
  return useQuery({
    queryKey: sesionesKeys.jornadaHoy(anio?.id),
    queryFn: getMiJornadaHoy,
    enabled,
    refetchInterval: 60_000,
    refetchIntervalInBackground: false,
    staleTime: 30_000,
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

export function useAsignarReemplazo() {
  return useMutacionSesion(
    ({ id, docenteId }: { id: string; docenteId: string }) => asignarReemplazo(id, docenteId),
    () => "Reemplazo asignado.",
  );
}

export function useAprobarJustificacion() {
  return useMutacionSesion(
    (id: string) => aprobarJustificacion(id),
    (r) => extraerMensajeSesion(r, "Sesión justificada."),
  );
}

export function useRechazarJustificacion() {
  return useMutacionSesion(
    ({ id, comentario }: { id: string; comentario: string }) =>
      rechazarJustificacion(id, comentario),
    (r) => extraerMensajeSesion(r, "La justificación fue rechazada."),
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
    (r) => extraerMensajeSesion(r, "Su justificación fue enviada al subdirector."),
  );
}

export function useFirmarIngresoWeb() {
  return useMutacionSesion(
    ({ id, tema }: { id: string; tema: string }) => firmarIngresoWeb(id, tema),
    (r) => extraerMensajeSesion(r, "Ingreso de sesión firmado."),
  );
}

export function useFirmarSalidaWeb() {
  return useMutacionSesion(
    (id: string) => firmarSalidaWeb(id),
    (r) => extraerMensajeSesion(r, "Salida de sesión firmada."),
  );
}

/** El reemplazo y las justificaciones requieren el menú de justificaciones (Subdirección). */
export function usePuedeGestionarSesiones(): boolean {
  const { data } = useSession();
  if (data?.user.activeRoleName === "Administrador") return true;
  return data?.user.menuRoutes?.includes(MENU_JUSTIFICACIONES_SESION) ?? false;
}
