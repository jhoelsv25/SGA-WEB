import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { API_BASE_URL } from "@/lib/api-client";
import { importacionApi } from "../api/importacion.api";
import type {
  EjecutarImportacionInput,
  EstadoImportacionJobResponse,
  IniciarImportacionResponse,
  PrevisualizarImportacionInput,
  TipoImportacion,
  VistaPreviaResponse,
} from "../types/importacion.types";
import { downloadBlob } from "../utils/excel-parser";

export function useDescargarPlantilla() {
  return useMutation({
    mutationFn: async (tipo: TipoImportacion) => {
      const blob = await importacionApi.descargarPlantilla(tipo);
      downloadBlob(blob, `plantilla_${tipo}.xlsx`);
      return true;
    },
    onSuccess: (_, tipo) => {
      toast.success(`Plantilla de ${tipo} descargada correctamente.`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al descargar la plantilla.");
    },
  });
}

export function usePrevisualizarImportacion() {
  return useMutation<VistaPreviaResponse, Error, PrevisualizarImportacionInput>({
    mutationFn: (input) => importacionApi.previsualizar(input),
    onError: (error: Error) => {
      toast.error(error.message || "Error al previsualizar el archivo.");
    },
  });
}

export function useEjecutarImportacion() {
  const queryClient = useQueryClient();

  return useMutation<IniciarImportacionResponse, Error, EjecutarImportacionInput>({
    mutationFn: (input) => importacionApi.ejecutar(input),
    onSuccess: (data, variables) => {
      if (data.estado === "completado") {
        toast.success(data.mensaje);
        queryClient.invalidateQueries({ queryKey: [variables.tipo] });
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al iniciar la importación masiva.");
    },
  });
}

export function useEstadoJobQuery(jobId?: string, enabled = true) {
  const queryClient = useQueryClient();

  React.useEffect(() => {
    if (!jobId || !enabled) return;

    const url = `${API_BASE_URL}/importacion/jobs/${jobId}/progreso`;
    let es: EventSource | null = null;

    try {
      es = new EventSource(url, { withCredentials: true });

      es.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as EstadoImportacionJobResponse;
          queryClient.setQueryData(["importacion", "job", jobId], data);

          if (data.estado === "completado" || data.estado === "fallido") {
            if (data.estado === "completado") {
              queryClient.invalidateQueries({ queryKey: ["estudiantes"] });
              queryClient.invalidateQueries({ queryKey: ["docentes"] });
              queryClient.invalidateQueries({ queryKey: ["apoderados"] });
              queryClient.invalidateQueries({ queryKey: ["personas"] });
              queryClient.invalidateQueries({ queryKey: ["matriculas"] });
              queryClient.invalidateQueries({ queryKey: ["secciones"] });
              queryClient.invalidateQueries({ queryKey: ["carga-academica"] });
              queryClient.invalidateQueries({ queryKey: ["horarios"] });
              queryClient.invalidateQueries({ queryKey: ["plan-estudios"] });
            }
            es?.close();
          }
        } catch {
          // Si el mensaje no es JSON válido, ignorar
        }
      };

      es.onerror = () => {
        es?.close();
      };
    } catch {
      // Si el navegador no soporta EventSource o falla la inicialización
    }

    return () => {
      es?.close();
    };
  }, [jobId, enabled, queryClient]);

  return useQuery<EstadoImportacionJobResponse, Error>({
    queryKey: ["importacion", "job", jobId],
    queryFn: async () => {
      const res = await importacionApi.getEstadoJob(jobId!);
      if (res.estado === "completado") {
        queryClient.invalidateQueries({ queryKey: ["estudiantes"] });
        queryClient.invalidateQueries({ queryKey: ["docentes"] });
        queryClient.invalidateQueries({ queryKey: ["apoderados"] });
        queryClient.invalidateQueries({ queryKey: ["personas"] });
        queryClient.invalidateQueries({ queryKey: ["matriculas"] });
        queryClient.invalidateQueries({ queryKey: ["secciones"] });
        queryClient.invalidateQueries({ queryKey: ["carga-academica"] });
        queryClient.invalidateQueries({ queryKey: ["horarios"] });
        queryClient.invalidateQueries({ queryKey: ["plan-estudios"] });
      }
      return res;
    },
    enabled: Boolean(jobId) && enabled,
    refetchInterval: false,
  });
}

export function useDescargarReporteCredenciales() {
  return useMutation({
    mutationFn: async ({ jobId, tipo }: { jobId: string; tipo: TipoImportacion }) => {
      const blob = await importacionApi.descargarReporteCredenciales(jobId);
      const fecha = new Date().toISOString().split("T")[0];
      downloadBlob(blob, `Reporte_Credenciales_${tipo}_${fecha}.xlsx`);
      return true;
    },
    onSuccess: () => {
      toast.success("Reporte institucional de credenciales descargado exitosamente.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al descargar el reporte de credenciales.");
    },
  });
}
