"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiClientError } from "@/lib/api-client";
import { toast } from "@/lib/toast";
import {
  cerrarConsolidado,
  generarConsolidados,
  reabrirConsolidado,
  registrarDecisionDirector,
  resolverSolicitudRevision,
  solicitarRevision,
} from "../api";
import type {
  ActualizarDecisionDto,
  CerrarConsolidadoDto,
  GenerarConsolidadoDto,
  ResolverSolicitudRevisionDto,
  SolicitarRevisionDto,
} from "../types";
import { consolidadoKeys } from "./consolidado-keys";

export function useGenerarConsolidadosMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: GenerarConsolidadoDto) => generarConsolidados(dto),
    onSuccess: (res) => {
      void queryClient.invalidateQueries({ queryKey: consolidadoKeys.all });
      toast.success(res.mensaje || "Consolidado generado exitosamente.");
    },
    onError: (error: ApiClientError) => {
      toast.error(error.message || "Error al generar consolidados.");
    },
  });
}

export function useRegistrarDecisionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: ActualizarDecisionDto }) =>
      registrarDecisionDirector(id, dto),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: consolidadoKeys.all });
      toast.success("Decisión del Director guardada exitosamente.");
    },
    onError: (error: ApiClientError) => {
      toast.error(error.message || "Error al registrar la decisión.");
    },
  });
}

export function useReabrirConsolidadoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => reabrirConsolidado(id),
    onSuccess: (res) => {
      void queryClient.invalidateQueries({ queryKey: consolidadoKeys.all });
      toast.success(res.mensaje || "Consolidado reabierto exitosamente.");
    },
    onError: (error: ApiClientError) => {
      toast.error(error.message || "Error al reabrir el consolidado.");
    },
  });
}

export function useCerrarConsolidadoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: CerrarConsolidadoDto }) =>
      cerrarConsolidado(id, dto),
    onSuccess: (res) => {
      void queryClient.invalidateQueries({ queryKey: consolidadoKeys.all });
      toast.success(res.mensaje || "Consolidado cerrado exitosamente.");
    },
    onError: (error: ApiClientError) => {
      toast.error(error.message || "Error al cerrar el consolidado.");
    },
  });
}

export function useSolicitarRevisionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: SolicitarRevisionDto }) =>
      solicitarRevision(id, dto),
    onSuccess: (res) => {
      void queryClient.invalidateQueries({ queryKey: consolidadoKeys.all });
      toast.success(res.mensaje || "Solicitud de revisión enviada.");
    },
    onError: (error: ApiClientError) => {
      toast.error(error.message || "Error al enviar la solicitud.");
    },
  });
}

export function useResolverSolicitudMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      solicitudId,
      dto,
    }: {
      solicitudId: string;
      dto: ResolverSolicitudRevisionDto;
    }) => resolverSolicitudRevision(solicitudId, dto),
    onSuccess: (res) => {
      void queryClient.invalidateQueries({ queryKey: consolidadoKeys.all });
      toast.success(res.mensaje || "Solicitud resuelta exitosamente.");
    },
    onError: (error: ApiClientError) => {
      toast.error(error.message || "Error al resolver la solicitud.");
    },
  });
}
