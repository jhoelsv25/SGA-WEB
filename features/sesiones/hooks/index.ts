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
  getDetalleJustificacion,
  firmarIngresoWeb,
  firmarSalidaWeb,
  getJustificacionesSolicitadas,
  getMiJornadaHoy,
  getMisSesiones,
  getMotivosJustificacion,
  getPanelSesionesHoy,
  rechazarJustificacion,
  solicitarJustificacion,
} from "../api";
import { INTERVALO_PANEL_SESIONES_MS, MENU_JUSTIFICACIONES_SESION } from "../consts";
import type { FiltrosBandejaJustificaciones, SolicitudJustificacionPayload } from "../types";
import { extraerMensajeSesion } from "../utils";

export const sesionesKeys = {
  all: ["sesiones-clase"] as const,
  panel: (anioId?: string) => [...sesionesKeys.all, anioId ?? "vigente", "panel-hoy"] as const,
  justificaciones: (anioId?: string, filtros?: FiltrosBandejaJustificaciones) =>
    [...sesionesKeys.all, anioId ?? "vigente", "justificaciones", filtros ?? {}] as const,
  detalleJustificacion: (anioId: string | undefined, id: string) =>
    [...sesionesKeys.all, anioId ?? "vigente", "justificacion", id] as const,
  motivos: () => [...sesionesKeys.all, "motivos-justificacion"] as const,
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

export function useJustificacionesSolicitadas(filtros: FiltrosBandejaJustificaciones = {}) {
  const { anio } = useAnioLectivo();
  return useQuery({
    queryKey: sesionesKeys.justificaciones(anio?.id, filtros),
    queryFn: () => getJustificacionesSolicitadas(filtros),
    staleTime: 30_000,
    gcTime: 5 * 60_000,
  });
}

/** Detalle de una solicitud con el contador de permisos personales del año. */
export function useDetalleJustificacion(id?: string) {
  const { anio } = useAnioLectivo();
  return useQuery({
    queryKey: sesionesKeys.detalleJustificacion(anio?.id, id ?? ""),
    queryFn: () => getDetalleJustificacion(id!),
    enabled: Boolean(id),
    staleTime: 15_000,
    gcTime: 5 * 60_000,
  });
}

/** Catálogo de motivos con la regla del documento y el aviso de la norma (viene de la API). */
export function useMotivosJustificacion() {
  return useQuery({
    queryKey: sesionesKeys.motivos(),
    queryFn: getMotivosJustificacion,
    staleTime: 5 * 60_000,
    gcTime: 30 * 60_000,
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

/**
 * Aprueba una solicitud. Si el docente superaría el tope de permisos personales, la API responde
 * 409 con el mensaje a mostrar; la pantalla pide confirmar y vuelve a llamar con `confirmarTope`.
 * Ese 409 no se muestra como error.
 */
export function useAprobarJustificacion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, confirmarTope }: { id: string; confirmarTope?: boolean }) =>
      aprobarJustificacion(id, confirmarTope),
    onSuccess: (resultado) => {
      void queryClient.invalidateQueries({ queryKey: sesionesKeys.all });
      toast.success(extraerMensajeSesion(resultado, "Sesión justificada."));
    },
    onError: (error: ApiClientError) => {
      if (!esConfirmacionDeTope(error)) toast.error(error.message);
    },
  });
}

/** El 409 de aprobar significa "supera el tope, ¿continuar?" (única causa de conflicto allí). */
export function esConfirmacionDeTope(error: unknown): boolean {
  return error instanceof ApiClientError && error.statusCode === 409;
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
    ({ id, ...payload }: { id: string } & SolicitudJustificacionPayload) =>
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
