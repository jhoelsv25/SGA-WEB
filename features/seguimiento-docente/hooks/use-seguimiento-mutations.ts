"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiClientError } from "@/lib/api-client";
import { toast } from "@/lib/toast";
import {
  aceptarSolicitudRevision,
  cerrarConsolidado,
  crearSolicitudRevision,
  descargarFichaPdf,
  exportarReporteExcel,
  generarConsolidadoDocente,
  generarTodosConsolidados,
  reabrirConsolidado,
  rechazarSolicitudRevision,
  registrarDecisionConsolidado,
} from "../api";
import { MENSAJES_CONSOLIDADO } from "../consts";
import type {
  CerrarConsolidadoDto,
  CrearSolicitudRevisionPayload,
  RechazarSolicitudDto,
  RegistrarDecisionDto,
  ResolverSolicitudDto,
} from "../types";
import { seguimientoKeys } from "./seguimiento-keys";

/**
 * HU1: Mutación para generar el consolidado de todos los docentes del bimestre.
 */
export function useGenerarTodosConsolidados() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (periodoId: string) => generarTodosConsolidados(periodoId),
    onSuccess: (resultado) => {
      void queryClient.invalidateQueries({ queryKey: seguimientoKeys.all });
      toast.success(resultado.mensaje || "Consolidados generados exitosamente.");
    },
    onError: (error: ApiClientError) => {
      toast.error(error.message || "Error al generar los consolidados del bimestre.");
    },
  });
}

/**
 * HU1: Mutación para generar el consolidado individual de un docente específico.
 */
export function useGenerarConsolidadoDocente() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ periodoId, docenteId }: { periodoId: string; docenteId: string }) =>
      generarConsolidadoDocente(periodoId, docenteId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: seguimientoKeys.all });
      toast.success("Consolidado docente generado exitosamente.");
    },
    onError: (error: ApiClientError) => {
      toast.error(error.message || "Error al generar el consolidado docente.");
    },
  });
}

/**
 * HU1: Mutación para registrar o actualizar la decisión y observación directiva.
 */
export function useRegistrarDecisionConsolidado() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: RegistrarDecisionDto }) =>
      registrarDecisionConsolidado(id, dto),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: seguimientoKeys.all });
      toast.success("Decisión directiva registrada exitosamente.");
    },
    onError: (error: ApiClientError) => {
      toast.error(error.message || "Error al registrar la decisión directiva.");
    },
  });
}

/**
 * HU2: Mutación para reabrir un consolidado cerrado (habilita edición en sesiones y ausencias).
 */
export function useReabrirConsolidado() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => reabrirConsolidado(id),
    onSuccess: (resultado) => {
      void queryClient.invalidateQueries({ queryKey: seguimientoKeys.all });
      void queryClient.invalidateQueries({ queryKey: ["sesiones-clase"] });
      void queryClient.invalidateQueries({ queryKey: ["ausencias-docente"] });
      toast.success(resultado.mensaje || MENSAJES_CONSOLIDADO.CONSOLIDADO_REABIERTO);
    },
    onError: (error: ApiClientError) => {
      toast.error(error.message || "Error al reabrir el consolidado.");
    },
  });
}

/**
 * HU2: Mutación para volver a cerrar un consolidado reabierto, creando una nueva versión.
 */
export function useCerrarConsolidado() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: CerrarConsolidadoDto }) =>
      cerrarConsolidado(id, dto),
    onSuccess: (resultado) => {
      void queryClient.invalidateQueries({ queryKey: seguimientoKeys.all });
      void queryClient.invalidateQueries({ queryKey: ["sesiones-clase"] });
      void queryClient.invalidateQueries({ queryKey: ["ausencias-docente"] });
      const mensaje =
        resultado.mensaje ||
        (resultado.version
          ? MENSAJES_CONSOLIDADO.NUEVA_VERSION(resultado.version)
          : "Consolidado cerrado exitosamente.");
      toast.success(mensaje);
    },
    onError: (error: ApiClientError) => {
      toast.error(error.message || "Error al cerrar el consolidado.");
    },
  });
}

/**
 * HU3: Mutación para que el docente envíe una solicitud de revisión sobre su consolidado.
 */
export function useCrearSolicitudRevision() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CrearSolicitudRevisionPayload) => crearSolicitudRevision(payload),
    onSuccess: (resultado) => {
      void queryClient.invalidateQueries({ queryKey: seguimientoKeys.miSeguimiento() });
      void queryClient.invalidateQueries({ queryKey: seguimientoKeys.solicitudes() });
      toast.success(resultado.mensaje || MENSAJES_CONSOLIDADO.SOLICITUD_ENVIADA);
    },
    onError: (error: ApiClientError) => {
      toast.error(error.message || "Error al enviar la solicitud de revisión.");
    },
  });
}

/**
 * HU3: Mutación para que el Director acepte una solicitud de revisión (reabre el consolidado).
 */
export function useAceptarSolicitudRevision() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto?: ResolverSolicitudDto }) =>
      aceptarSolicitudRevision(id, dto),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: seguimientoKeys.all });
      void queryClient.invalidateQueries({ queryKey: ["sesiones-clase"] });
      void queryClient.invalidateQueries({ queryKey: ["ausencias-docente"] });
      toast.success("Solicitud de revisión aceptada y consolidado reabierto.");
    },
    onError: (error: ApiClientError) => {
      toast.error(error.message || "Error al aceptar la solicitud de revisión.");
    },
  });
}

/**
 * HU3: Mutación para que el Director rechace una solicitud de revisión con respuesta obligatoria.
 */
export function useRechazarSolicitudRevision() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: RechazarSolicitudDto }) =>
      rechazarSolicitudRevision(id, dto),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: seguimientoKeys.solicitudes() });
      void queryClient.invalidateQueries({ queryKey: seguimientoKeys.miSeguimiento() });
      toast.success("Solicitud de revisión rechazada.");
    },
    onError: (error: ApiClientError) => {
      toast.error(error.message || "Error al rechazar la solicitud de revisión.");
    },
  });
}

/**
 * HU4: Mutación para descargar la ficha oficial de seguimiento docente en PDF.
 */
export function useDescargarFichaPdf() {
  return useMutation({
    mutationFn: ({ id, nombreArchivo }: { id: string; nombreArchivo?: string }) =>
      descargarFichaPdf(id, nombreArchivo),
    onSuccess: () => {
      toast.success("Ficha descargada exitosamente.");
    },
    onError: (error: ApiClientError) => {
      toast.error(error.message || "Error al descargar la ficha de seguimiento.");
    },
  });
}

/**
 * HU4: Mutación para exportar el reporte consolidado del bimestre a Excel (.xlsx).
 */
export function useExportarReporteExcel() {
  return useMutation({
    mutationFn: ({ periodoId, nombreArchivo }: { periodoId: string; nombreArchivo?: string }) =>
      exportarReporteExcel(periodoId, nombreArchivo),
    onSuccess: () => {
      toast.success("Reporte exportado exitosamente.");
    },
    onError: (error: ApiClientError) => {
      toast.error(error.message || "Error al exportar el reporte a Excel.");
    },
  });
}
