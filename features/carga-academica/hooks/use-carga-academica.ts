"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/features/auth";
import { useAnioLectivo } from "@/features/anio-escolar/anio-lectivo-context";
import type { ApiClientError } from "@/lib/api-client";
import { cargaAcademicaApi } from "../api";
import { MENU_SECCIONES, ROL_ADMINISTRADOR } from "../consts";
import type {
  AsignarDocentePayload,
  AsignarDocenteResultado,
  CargaDocenteDetalle,
  CargaSeccionResponse,
  SeccionDetalleHeader,
} from "../types";

export const cargaAcademicaKeys = {
  all: ["carga-academica"] as const,
  secciones: () => [...cargaAcademicaKeys.all, "seccion"] as const,
  seccion: (seccionId: string, anioId?: string) =>
    [...cargaAcademicaKeys.secciones(), seccionId, anioId ?? "vigente"] as const,
  seccionDetalles: () => [...cargaAcademicaKeys.all, "seccion-detalle"] as const,
  seccionDetalle: (seccionId: string, anioId?: string) =>
    [...cargaAcademicaKeys.seccionDetalles(), seccionId, anioId ?? "vigente"] as const,
  docentes: () => [...cargaAcademicaKeys.all, "docente"] as const,
  docente: (docenteId: string, anioId?: string) =>
    [...cargaAcademicaKeys.docentes(), docenteId, anioId ?? "vigente"] as const,
};

export function usePuedeGestionarCarga(): boolean {
  const { data } = useSession();
  const rol = data?.user.activeRoleName ?? data?.user.roles?.[0] ?? "";
  if (rol === ROL_ADMINISTRADOR || rol.toLowerCase().includes("admin")) return true;
  return data?.user.menuRoutes?.includes(MENU_SECCIONES) ?? false;
}

export function useCargaSeccionQuery(seccionId: string, enabled = true) {
  const { anio } = useAnioLectivo();
  return useQuery<CargaSeccionResponse, ApiClientError>({
    queryKey: cargaAcademicaKeys.seccion(seccionId, anio?.id),
    queryFn: () => cargaAcademicaApi.getCargaSeccion(seccionId),
    enabled: Boolean(seccionId) && enabled,
    staleTime: 1000 * 60 * 2,
  });
}

export function useSeccionDetalleQuery(seccionId: string, enabled = true) {
  const { anio } = useAnioLectivo();
  return useQuery<SeccionDetalleHeader, ApiClientError>({
    queryKey: cargaAcademicaKeys.seccionDetalle(seccionId, anio?.id),
    queryFn: () => cargaAcademicaApi.getSeccionDetalle(seccionId),
    enabled: Boolean(seccionId) && enabled,
    staleTime: 1000 * 60 * 2,
  });
}

export function useCargaDocenteQuery(docenteId: string, enabled = true) {
  const { anio } = useAnioLectivo();
  return useQuery<CargaDocenteDetalle, ApiClientError>({
    queryKey: cargaAcademicaKeys.docente(docenteId, anio?.id),
    queryFn: () => cargaAcademicaApi.getCargaDocente(docenteId),
    enabled: Boolean(docenteId) && enabled,
    staleTime: 1000 * 60 * 2,
  });
}

export function useAsignarDocenteMutation(seccionId: string) {
  const queryClient = useQueryClient();

  return useMutation<
    AsignarDocenteResultado,
    ApiClientError,
    { cursoSeccionId: string; payload: AsignarDocentePayload }
  >({
    mutationFn: ({ cursoSeccionId, payload }) =>
      cargaAcademicaApi.asignarDocente(cursoSeccionId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...cargaAcademicaKeys.secciones(), seccionId],
      });
      queryClient.invalidateQueries({
        queryKey: [...cargaAcademicaKeys.seccionDetalles(), seccionId],
      });
      queryClient.invalidateQueries({
        queryKey: cargaAcademicaKeys.docentes(),
      });
      queryClient.invalidateQueries({
        queryKey: cargaAcademicaKeys.all,
      });
    },
  });
}
