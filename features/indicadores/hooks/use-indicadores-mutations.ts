"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiClientError } from "@/lib/api-client";
import { toast } from "@/lib/toast";
import { cerrarMedicion, crearNuevaVersionMedicion, registrarPretest } from "../api";
import { MENSAJES_INDICADORES } from "../consts";
import type { CerrarMedicionDto, NuevaVersionMedicionDto, RegistrarPretestDto } from "../types";
import { indicadoresKeys } from "./indicadores-keys";

/**
 * Mutación para registrar un pretest manual de un indicador con validación de fuente.
 */
export function useRegistrarPretestMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: RegistrarPretestDto) => registrarPretest(dto),
    onSuccess: (res, dto) => {
      void queryClient.invalidateQueries({ queryKey: indicadoresKeys.all });
      toast.success(
        res.mensaje ||
          MENSAJES_INDICADORES.PRETEST_REGISTRADO(dto.indicador, res.pretest?.porcentaje ?? 0),
      );
    },
    onError: (error: ApiClientError) => {
      toast.error(error.message || "Error al registrar el pretest.");
    },
  });
}

/**
 * Mutación para cerrar la medición de un bimestre cerrado y congelar los valores postest.
 */
export function useCerrarMedicionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CerrarMedicionDto) => cerrarMedicion(dto),
    onSuccess: (res) => {
      void queryClient.invalidateQueries({ queryKey: indicadoresKeys.all });
      toast.success(res.mensaje || "Medición del bimestre cerrada exitosamente.");
    },
    onError: (error: ApiClientError) => {
      toast.error(error.message || "Error al cerrar la medición del bimestre.");
    },
  });
}

/**
 * Mutación para registrar una nueva versión congelada de una medición con motivo obligatorio.
 */
export function useNuevaVersionMedicionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: NuevaVersionMedicionDto }) =>
      crearNuevaVersionMedicion(id, dto),
    onSuccess: (res) => {
      void queryClient.invalidateQueries({ queryKey: indicadoresKeys.all });
      toast.success(res.mensaje || "Nueva versión de la medición generada exitosamente.");
    },
    onError: (error: ApiClientError) => {
      toast.error(error.message || "Error al generar la nueva versión de la medición.");
    },
  });
}
