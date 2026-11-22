"use client";

import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ApiClientError } from "@/lib/api-client";
import { useAnioLectivo } from "@/features/anio-escolar/anio-lectivo-context";
import { useSession } from "@/features/auth";
import { getSecciones } from "@/features/secciones/api";
import type { Seccion } from "@/features/secciones/types";
import {
  descargarTrabajoReporte,
  eliminarTrabajoReporte,
  encolarReporte,
  limpiarTrabajosReporte,
  listarTrabajosReporte,
} from "../api/reportes.api";
import { CATALOGO_REPORTES, type ReporteCatalogoItem } from "../constants";
import type {
  CategoriaReporte,
  GradoOpcionReporte,
  PermisosReportes,
  SolicitarReportePayload,
  TrabajoReporteItem,
} from "../types";

export type FiltroCategoriaTab = "todos" | CategoriaReporte;

export function useReportes() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const { anio } = useAnioLectivo();

  const permisos = React.useMemo<PermisosReportes>(() => {
    const rol = (session?.user?.activeRoleName || session?.user?.roles?.[0] || "").toLowerCase();
    const esAdmin = rol.includes("admin");
    const esDirectivo = esAdmin || rol.includes("director");
    const esSecretaria = esAdmin || rol.includes("secretaria");
    const esAuxiliar = rol.includes("auxiliar");
    const puedeVerAcademico = esDirectivo || esSecretaria;
    const puedeVerAsistencia = puedeVerAcademico || esAuxiliar;
    return {
      esAdmin,
      esDirectivo,
      esSecretaria,
      esAuxiliar,
      puedeVerAcademico,
      puedeVerAsistencia,
      tieneAcceso: puedeVerAsistencia,
    };
  }, [session?.user]);

  const [categoriaTab, setCategoriaTab] = React.useState<FiltroCategoriaTab>("todos");
  const [busqueda, setBusqueda] = React.useState("");
  const [reporteActivo, setReporteActivo] = React.useState<ReporteCatalogoItem | null>(null);
  const [descargandoKey, setDescargandoKey] = React.useState<string | null>(null);
  const [descargadosIds, setDescargadosIds] = React.useState<string[]>([]);
  const [eliminandoId, setEliminandoId] = React.useState<string | null>(null);

  const anioId = anio?.id ?? "";

  const { data: secciones = [] } = useQuery<Seccion[], ApiClientError>({
    queryKey: ["secciones", "centro-reportes", anioId],
    queryFn: () => getSecciones({ estado: "activa" }, anioId),
    enabled: Boolean(permisos.tieneAcceso && anioId),
  });

  const grados = React.useMemo<GradoOpcionReporte[]>(() => {
    const mapa = new Map<string, GradoOpcionReporte>();
    for (const s of secciones) {
      if (!mapa.has(s.gradoId)) {
        mapa.set(s.gradoId, { id: s.gradoId, numero: s.gradoNumero, nombre: s.gradoNombre });
      }
    }
    return Array.from(mapa.values()).sort((a, b) => a.numero - b.numero);
  }, [secciones]);

  const reportesPermitidos = React.useMemo(
    () => CATALOGO_REPORTES.filter((item) => item.permitido(permisos)),
    [permisos],
  );

  const reportesVisibles = React.useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return reportesPermitidos.filter((item) => {
      if (categoriaTab !== "todos" && item.categoria !== categoriaTab) return false;
      if (!q) return true;
      return (
        item.titulo.toLowerCase().includes(q) ||
        item.descripcion.toLowerCase().includes(q) ||
        item.chips.some((c) => c.toLowerCase().includes(q))
      );
    });
  }, [reportesPermitidos, categoriaTab, busqueda]);

  const trabajosQuery = useQuery<TrabajoReporteItem[], ApiClientError>({
    queryKey: ["reportes-trabajos"],
    queryFn: listarTrabajosReporte,
    enabled: permisos.tieneAcceso,
    refetchInterval: (query) => {
      const lista = query.state.data ?? [];
      const hayActivos = lista.some((t) => t.estado === "encolado" || t.estado === "procesando");
      return hayActivos ? 1500 : false;
    },
  });

  const encolarMutation = useMutation<TrabajoReporteItem, ApiClientError, SolicitarReportePayload>({
    mutationFn: encolarReporte,
    onSuccess: (trabajo) => {
      toast.success(`Preparando «${trabajo.etiqueta}». Estará listo en Descargas recientes.`);
      void queryClient.invalidateQueries({ queryKey: ["reportes-trabajos"] });
    },
    onError: (err) => {
      toast.error(err.message || "No se pudo encolar el reporte.");
    },
  });

  const eliminarTrabajoMutation = useMutation<void, ApiClientError, string>({
    mutationFn: async (jobId) => {
      setEliminandoId(jobId);
      await eliminarTrabajoReporte(jobId);
    },
    onSuccess: (_data, jobId) => {
      queryClient.setQueryData<TrabajoReporteItem[]>(["reportes-trabajos"], (prev) =>
        (prev ?? []).filter((t) => t.jobId !== jobId),
      );
      void queryClient.invalidateQueries({ queryKey: ["reportes-trabajos"] });
    },
    onError: (err) => {
      toast.error(err.message || "No se pudo quitar el reporte.");
    },
    onSettled: () => {
      setEliminandoId(null);
    },
  });

  const limpiarTrabajosMutation = useMutation<{ eliminados: number }, ApiClientError, void>({
    mutationFn: limpiarTrabajosReporte,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["reportes-trabajos"] });
    },
    onError: (err) => {
      toast.error(err.message || "No se pudo limpiar la lista.");
    },
  });

  const ejecutarDescarga = React.useCallback(async (key: string, fn: () => Promise<string>) => {
    setDescargandoKey(key);
    try {
      const nombre = await fn();
      toast.success(`Reporte descargado: ${nombre}`);
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "No se pudo generar el reporte.";
      toast.error(msg);
      return false;
    } finally {
      setDescargandoKey(null);
    }
  }, []);

  const descargarTrabajo = React.useCallback(
    (trabajo: TrabajoReporteItem) => {
      void ejecutarDescarga(`job-${trabajo.jobId}`, () =>
        descargarTrabajoReporte(trabajo.jobId, trabajo.nombreArchivo || `sga_${trabajo.tipo}.xlsx`),
      ).then((ok) => {
        if (ok) {
          setDescargadosIds((prev) =>
            prev.includes(trabajo.jobId) ? prev : [...prev, trabajo.jobId],
          );
        }
      });
    },
    [ejecutarDescarga],
  );

  return {
    anio,
    permisos,
    grados,
    secciones,
    categoriaTab,
    setCategoriaTab,
    busqueda,
    setBusqueda,
    reportesPermitidos,
    reportesVisibles,
    reporteActivo,
    setReporteActivo,
    trabajos: trabajosQuery.data ?? [],
    encolando: encolarMutation.isPending,
    encolarReporte: (payload: SolicitarReportePayload) => encolarMutation.mutate(payload),
    descargandoKey,
    descargadosIds,
    eliminandoId,
    limpiandoTrabajos: limpiarTrabajosMutation.isPending,
    ejecutarDescarga,
    descargarTrabajo,
    eliminarTrabajo: (jobId: string) => eliminarTrabajoMutation.mutate(jobId),
    limpiarTrabajos: () => limpiarTrabajosMutation.mutate(),
  };
}
