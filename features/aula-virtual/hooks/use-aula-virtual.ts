"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAnioLectivo } from "@/features/anio-escolar/anio-lectivo-context";
import { ApiClientError } from "@/lib/api-client";
import { toast } from "@/lib/toast";
import {
  actualizarMaterial,
  actualizarUnidad,
  crearUnidad,
  getAula,
  getMisCursos,
  getSeguimiento,
  getSolicitudes,
  planificarMaterial,
  publicarExtra,
  publicarMaterial,
  reemplazarMaterial,
  resolverSolicitud,
  retirarMaterial,
  solicitarCambioFecha,
} from "../api";
import type {
  ContenidoMaterial,
  EstadoSolicitudFecha,
  MaterialExtra,
  NuevaUnidad,
  PlanificarMaterial,
} from "../types";
import { aulaKeys } from "./query-keys";

/** Cada mutación refresca el aula y avisa con el mensaje que devuelve el servidor. */
export function useMutacionAula<TVariables, TRespuesta extends { mensaje?: string }>(
  funcion: (variables: TVariables) => Promise<TRespuesta>,
  mensajePorDefecto?: string,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: funcion,
    onSuccess: (respuesta) => {
      void queryClient.invalidateQueries({ queryKey: aulaKeys.all });
      const mensaje = respuesta.mensaje ?? mensajePorDefecto;
      if (mensaje) toast.success(mensaje);
    },
    onError: (error: ApiClientError) => toast.error(error.message),
  });
}

export function useMisCursos() {
  const { anio } = useAnioLectivo();
  return useQuery({
    queryKey: aulaKeys.cursos(anio?.id),
    queryFn: getMisCursos,
    staleTime: 5 * 60_000,
    gcTime: 10 * 60_000,
  });
}

export function useAula(cursoSeccionId: string) {
  const { anio } = useAnioLectivo();
  return useQuery({
    queryKey: aulaKeys.aula(anio?.id, cursoSeccionId),
    queryFn: () => getAula(cursoSeccionId),
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    retry: false,
  });
}

export function useSolicitudes(estado?: EstadoSolicitudFecha) {
  const { anio } = useAnioLectivo();
  return useQuery({
    queryKey: aulaKeys.solicitudes(anio?.id, estado),
    queryFn: () => getSolicitudes(estado),
    staleTime: 15_000,
  });
}

export function useSeguimiento(periodoId?: string) {
  const { anio } = useAnioLectivo();
  return useQuery({
    queryKey: aulaKeys.seguimiento(anio?.id, periodoId),
    queryFn: () => getSeguimiento(periodoId),
    staleTime: 30_000,
    retry: false,
  });
}

export function useCrearUnidad(cursoSeccionId: string) {
  return useMutacionAula(async (payload: NuevaUnidad) => ({
    ...(await crearUnidad(cursoSeccionId, payload)),
    mensaje: "Unidad creada.",
  }));
}

export function useActualizarUnidad() {
  return useMutacionAula(async ({ id, ...payload }: { id: string } & Partial<NuevaUnidad>) => ({
    ...(await actualizarUnidad(id, payload)),
    mensaje: "Unidad actualizada.",
  }));
}

export function usePlanificarMaterial() {
  return useMutacionAula(({ unidadId, ...payload }: { unidadId: string } & PlanificarMaterial) =>
    planificarMaterial(unidadId, payload),
  );
}

export function useActualizarMaterial() {
  return useMutacionAula(
    ({ id, ...payload }: { id: string } & Partial<PlanificarMaterial> & { visible?: boolean }) =>
      actualizarMaterial(id, payload),
  );
}

export function usePublicarMaterial() {
  return useMutacionAula(({ id, ...contenido }: { id: string } & ContenidoMaterial) =>
    publicarMaterial(id, contenido),
  );
}

export function usePublicarExtra() {
  return useMutacionAula(({ unidadId, ...material }: { unidadId: string } & MaterialExtra) =>
    publicarExtra(unidadId, material),
  );
}

export function useReemplazarMaterial() {
  return useMutacionAula(({ id, ...contenido }: { id: string } & ContenidoMaterial) =>
    reemplazarMaterial(id, contenido),
  );
}

export function useRetirarMaterial() {
  return useMutacionAula((id: string) => retirarMaterial(id));
}

export function useSolicitarCambioFecha() {
  return useMutacionAula(
    ({ id, ...payload }: { id: string; fechaSolicitada: string; motivo: string }) =>
      solicitarCambioFecha(id, payload),
  );
}

export function useResolverSolicitud() {
  return useMutacionAula(
    ({
      id,
      accion,
      respuesta,
    }: {
      id: string;
      accion: "aprobar" | "rechazar";
      respuesta?: string;
    }) => resolverSolicitud(id, accion, respuesta),
  );
}
