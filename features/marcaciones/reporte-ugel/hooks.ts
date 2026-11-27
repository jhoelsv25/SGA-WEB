"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiClientError } from "@/lib/api-client";
import { toast } from "@/lib/toast";
import { marcacionesKeys } from "../hooks";
import {
  anularJustificacion,
  crearJustificacion,
  descargarAnexos,
  getJustificaciones,
  getPersonasDelReporte,
  getReporteUgel,
} from "./api";
import type { NuevaJustificacion } from "./types";

const clave = [...marcacionesKeys.all, "reporte-ugel"] as const;

export function useReporteUgel(mes: string) {
  return useQuery({ queryKey: [...clave, mes], queryFn: () => getReporteUgel(mes) });
}

export function useJustificaciones(mes: string) {
  return useQuery({
    queryKey: [...clave, "justificaciones", mes],
    queryFn: () => getJustificaciones(mes),
  });
}

export function usePersonasDelReporte(mes: string, activo: boolean) {
  return useQuery({
    queryKey: [...clave, "personas", mes],
    queryFn: () => getPersonasDelReporte(mes),
    enabled: activo,
  });
}

function useCambio<T>(accion: (valor: T) => Promise<{ mensaje: string }>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: accion,
    onSuccess: ({ mensaje }) => {
      void queryClient.invalidateQueries({ queryKey: clave });
      toast.success(mensaje);
    },
    onError: (error: ApiClientError) => toast.error(error.message),
  });
}

export const useCrearJustificacion = () =>
  useCambio((payload: NuevaJustificacion) => crearJustificacion(payload));

export const useAnularJustificacion = () =>
  useCambio(({ id, motivo }: { id: string; motivo: string }) => anularJustificacion(id, motivo));

export function useDescargarAnexos(mes: string) {
  return useMutation({
    mutationFn: (formato: "pdf" | "xlsx") => descargarAnexos(mes, formato),
    onError: (error: ApiClientError) => toast.error(error.message),
  });
}
