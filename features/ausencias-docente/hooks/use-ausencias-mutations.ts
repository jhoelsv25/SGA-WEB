"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiClientError } from "@/lib/api-client";
import { toast } from "@/lib/toast";
import { anularAusencia, corregirAusencia, presentarDescargo, registrarAusencia } from "../api";
import type {
  AnularAusenciaDto,
  CorregirAusenciaPayload,
  RegistrarAusenciaPayload,
  RegistrarDescargoDto,
} from "../types";
import { ausenciasKeys } from "./ausencias-keys";

/**
 * Hook de mutación para registrar una nueva ausencia docente con fotos opcionales.
 */
export function useRegistrarAusencia() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RegistrarAusenciaPayload) => registrarAusencia(payload),
    onSuccess: (resultado) => {
      void queryClient.invalidateQueries({ queryKey: ausenciasKeys.all });
      // Invalida panel de sesiones para refrescar indicadores si está abierto
      void queryClient.invalidateQueries({ queryKey: ["sesiones-clase"] });
      toast.success(resultado.mensaje || "Ausencia registrada exitosamente.");
    },
    onError: (error: ApiClientError) => {
      toast.error(error.message || "Error al registrar la ausencia docente.");
    },
  });
}

/**
 * Hook de mutación para corregir una ausencia existente dentro de las 24 horas.
 */
export function useCorregirAusencia() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CorregirAusenciaPayload) => corregirAusencia(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ausenciasKeys.all });
      void queryClient.invalidateQueries({ queryKey: ["sesiones-clase"] });
      toast.success("Ausencia corregida exitosamente.");
    },
    onError: (error: ApiClientError) => {
      toast.error(error.message || "Error al corregir la ausencia.");
    },
  });
}

/**
 * Hook de mutación para anular una ausencia docente indicando el motivo.
 */
export function useAnularAusencia() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: AnularAusenciaDto }) => anularAusencia(id, dto),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ausenciasKeys.all });
      void queryClient.invalidateQueries({ queryKey: ["sesiones-clase"] });
      toast.success("Ausencia anulada exitosamente.");
    },
    onError: (error: ApiClientError) => {
      toast.error(error.message || "Error al anular la ausencia.");
    },
  });
}

/**
 * Hook de mutación para que el docente presente su descargo único a una ausencia.
 */
export function usePresentarDescargo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: RegistrarDescargoDto }) =>
      presentarDescargo(id, dto),
    onSuccess: (resultado) => {
      void queryClient.invalidateQueries({ queryKey: ausenciasKeys.all });
      toast.success(resultado.mensaje || "Su descargo fue registrado.");
    },
    onError: (error: ApiClientError) => {
      toast.error(error.message || "Error al registrar el descargo.");
    },
  });
}
