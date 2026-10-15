"use client";

import * as React from "react";
import { Download01Icon, RefreshIcon, Clock01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { PageHeader } from "@/components/common/page-header";
import { ListToolbar } from "@/components/common/list-toolbar";
import { Spinner } from "@/components/common/spinner";
import { Button } from "@/components/ui/button";
import { useAnioLectivo } from "@/features/anio-escolar/anio-lectivo-context";
import { useSession } from "@/features/auth";
import { useListFilters } from "@/hooks/use-list-filters";
import { toast } from "@/lib/toast";
import { descargarFichaPdf, exportarExcel, obtenerSolicitudPendiente } from "../api";
import { generarFiltroDefsConsolidados } from "../config";
import { useConsolidadosQuery, useGenerarConsolidadosMutation } from "../hooks";
import type { ConsolidadoResumenItem, SolicitudRevisionItem } from "../types";
import { ConsolidadosMetricas } from "./metricas/consolidados-metricas";
import {
  ModalCerrarConsolidado,
  ModalDecisionDirector,
  ModalDetalleConsolidado,
  ModalHistorialVersiones,
  ModalReabrirConsolidado,
  ModalResolverSolicitud,
} from "./modals";
import { ConsolidadosTable } from "../views";

export function ConsolidadosVista() {
  const { anio } = useAnioLectivo();
  const { data: sessionData } = useSession();
  const rolesUsuario = sessionData?.user?.roles ?? [];
  const activeRole = sessionData?.user?.activeRoleName ?? "";
  const esDirectorOAdmin =
    rolesUsuario.includes("Director") ||
    rolesUsuario.includes("Administrador") ||
    activeRole === "Director" ||
    activeRole === "Administrador";

  const bimestres = React.useMemo(() => anio?.bimestres ?? [], [anio?.bimestres]);
  const primerBimestreId = bimestres[0]?.id ?? "";

  // Filtros sincronizados con la URL
  const filterDefs = React.useMemo(() => generarFiltroDefsConsolidados(bimestres), [bimestres]);
  const listFilters = useListFilters(filterDefs);

  const periodoFiltro = listFilters.getString("periodoId");
  const periodoActivo =
    (periodoFiltro && periodoFiltro !== "all" ? periodoFiltro : primerBimestreId) || "";
  const estadoFiltro = listFilters.getString("estado");
  const decisionFiltro = listFilters.getString("decision");
  const busquedaTexto = listFilters.getString("search");

  // Estado de exportación
  const [exportandoExcel, setExportandoExcel] = React.useState(false);

  // Estados de modales desacoplados
  const [detalleId, setDetalleId] = React.useState<string | null>(null);
  const [consolidadoDecision, setConsolidadoDecision] =
    React.useState<ConsolidadoResumenItem | null>(null);
  const [consolidadoReabrir, setConsolidadoReabrir] = React.useState<ConsolidadoResumenItem | null>(
    null,
  );
  const [consolidadoCerrar, setConsolidadoCerrar] = React.useState<ConsolidadoResumenItem | null>(
    null,
  );
  const [consolidadoHistorial, setConsolidadoHistorial] =
    React.useState<ConsolidadoResumenItem | null>(null);
  const [solicitudResolver, setSolicitudResolver] = React.useState<SolicitudRevisionItem | null>(
    null,
  );

  // Queries y Mutaciones
  const {
    data: consolidados = [],
    isLoading,
    isFetching,
    refetch,
  } = useConsolidadosQuery({ periodoId: periodoActivo }, Boolean(periodoActivo));

  const { mutateAsync: generarConsolidados, isPending: generando } =
    useGenerarConsolidadosMutation();

  const handleGenerar = async () => {
    if (!periodoActivo) {
      toast.error("Seleccione un bimestre para generar los consolidados.");
      return;
    }
    await generarConsolidados({ periodoId: periodoActivo });
  };

  const handleExportarExcel = async () => {
    if (!periodoActivo) {
      toast.error("Seleccione un bimestre para exportar.");
      return;
    }
    try {
      setExportandoExcel(true);
      await exportarExcel(periodoActivo);
      toast.success("Consolidado bimestral exportado en Excel correctamente.");
    } catch {
      toast.error("Error al exportar el consolidado a Excel.");
    } finally {
      setExportandoExcel(false);
    }
  };

  const handleDescargarPdf = async (id: string) => {
    try {
      await descargarFichaPdf(id);
      toast.success("Ficha de seguimiento descargada.");
    } catch {
      toast.error("Error al descargar la ficha de seguimiento en PDF.");
    }
  };

  const handleAbrirResolverSolicitud = async (consolidadoId: string) => {
    try {
      const solicitud = await obtenerSolicitudPendiente(consolidadoId);
      if (solicitud) {
        setSolicitudResolver(solicitud);
      } else {
        toast.info("No hay solicitudes de revisión pendientes para este consolidado.");
      }
    } catch {
      toast.error("Error al cargar la solicitud de revisión.");
    }
  };

  // Filtrado local reactivo
  const consolidadosFiltrados = React.useMemo(() => {
    return consolidados.filter((c) => {
      if (busquedaTexto && busquedaTexto.trim()) {
        const term = busquedaTexto.toLowerCase().trim();
        const coincideDocente = c.docenteNombre.toLowerCase().includes(term);
        const coincideDni = c.docenteDni.includes(term);
        if (!coincideDocente && !coincideDni) return false;
      }
      if (estadoFiltro && estadoFiltro !== "all" && c.estado !== estadoFiltro) {
        return false;
      }
      if (decisionFiltro && decisionFiltro !== "all" && c.decision !== decisionFiltro) {
        return false;
      }
      return true;
    });
  }, [consolidados, busquedaTexto, estadoFiltro, decisionFiltro]);

  // Cálculos de métricas
  const totalDocentes = consolidadosFiltrados.length;
  const promedioCumplimiento =
    totalDocentes > 0
      ? Math.round(
          consolidadosFiltrados.reduce((acc, c) => {
            const tasa =
              c.sesionesProgramadas > 0
                ? ((c.sesionesCumplidas + c.sesionesJustificadas) / c.sesionesProgramadas) * 100
                : 0;
            return acc + tasa;
          }, 0) / totalDocentes,
        )
      : 0;
  const totalMinutosFuera = consolidadosFiltrados.reduce((acc, c) => acc + c.minutosTotalFuera, 0);
  const solicitudesPendientesTotal = consolidadosFiltrados.reduce(
    (acc, c) => acc + (c.solicitudesPendientesCount ?? 0),
    0,
  );

  const headerActions = (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleExportarExcel}
        disabled={exportandoExcel || isLoading || consolidados.length === 0}
        className="gap-1.5"
      >
        {exportandoExcel ? (
          <Spinner className="size-3.5" />
        ) : (
          <HugeiconsIcon icon={Download01Icon} className="size-3.5" />
        )}
        <span>Exportar Excel</span>
      </Button>

      {esDirectorOAdmin && (
        <Button
          variant="default"
          size="sm"
          onClick={handleGenerar}
          disabled={generando || !periodoActivo}
          className="gap-1.5"
        >
          {generando ? (
            <Spinner className="size-3.5" />
          ) : (
            <HugeiconsIcon icon={RefreshIcon} className="size-3.5" />
          )}
          <span>Generar consolidados</span>
        </Button>
      )}
    </div>
  );

  return (
    <div className="animate-in fade-in-50 flex flex-col gap-6 duration-300">
      <PageHeader
        title="Consolidados y Fichas de Seguimiento Docente"
        description="Supervisión ejecutiva de horas dictadas, justificaciones de ausencia y emisión de fichas bimestrales."
        icon={Clock01Icon}
        breadcrumbs={[
          { label: "Inicio", href: "/admin/dashboard" },
          { label: "Consolidados docentes" },
        ]}
        actions={headerActions}
      />

      {/* Métricas consolidadas del bimestre */}
      <ConsolidadosMetricas
        totalDocentes={totalDocentes}
        promedioCumplimiento={promedioCumplimiento}
        totalMinutosFuera={totalMinutosFuera}
        solicitudesPendientesTotal={solicitudesPendientesTotal}
      />

      {/* Barra de filtros institucional con sincronización URL */}
      <ListToolbar
        filterDefs={filterDefs}
        listFilters={listFilters}
        onRefresh={() => void refetch()}
        isRefreshing={isFetching}
        refreshLabel="Actualizar listado"
      />

      {/* Tabla modular */}
      {isLoading ? (
        <div className="border-border/60 bg-card text-muted-foreground flex flex-col items-center justify-center gap-2 rounded-2xl border py-16">
          <Spinner className="size-6" />
          <p className="text-xs">Cargando consolidados docentes del periodo...</p>
        </div>
      ) : (
        <ConsolidadosTable
          consolidados={consolidadosFiltrados}
          esDirectorOAdmin={esDirectorOAdmin}
          onVerDetalle={(id) => setDetalleId(id)}
          onDescargarPdf={handleDescargarPdf}
          onAbrirDecision={(c) => setConsolidadoDecision(c)}
          onAbrirReabrir={(c) => setConsolidadoReabrir(c)}
          onAbrirCerrar={(c) => setConsolidadoCerrar(c)}
          onAbrirHistorial={(c) => setConsolidadoHistorial(c)}
          onResolverSolicitud={handleAbrirResolverSolicitud}
        />
      )}

      {/* Modales desacoplados */}
      <ModalDetalleConsolidado
        consolidadoId={detalleId}
        abierto={Boolean(detalleId)}
        onOpenChange={(abierto) => !abierto && setDetalleId(null)}
        onAbrirDecision={(c) => setConsolidadoDecision(c)}
        onAbrirReabrir={(c) => setConsolidadoReabrir(c)}
        onAbrirCerrar={(c) => setConsolidadoCerrar(c)}
        esDirectorOAdmin={esDirectorOAdmin}
      />

      <ModalDecisionDirector
        consolidado={consolidadoDecision}
        abierto={Boolean(consolidadoDecision)}
        onOpenChange={(abierto) => !abierto && setConsolidadoDecision(null)}
      />

      <ModalReabrirConsolidado
        consolidado={consolidadoReabrir}
        abierto={Boolean(consolidadoReabrir)}
        onOpenChange={(abierto) => !abierto && setConsolidadoReabrir(null)}
      />

      <ModalCerrarConsolidado
        consolidado={consolidadoCerrar}
        abierto={Boolean(consolidadoCerrar)}
        onOpenChange={(abierto) => !abierto && setConsolidadoCerrar(null)}
      />

      <ModalHistorialVersiones
        consolidado={consolidadoHistorial}
        abierto={Boolean(consolidadoHistorial)}
        onOpenChange={(abierto) => !abierto && setConsolidadoHistorial(null)}
      />

      <ModalResolverSolicitud
        solicitud={solicitudResolver}
        abierto={Boolean(solicitudResolver)}
        onOpenChange={(abierto) => !abierto && setSolicitudResolver(null)}
      />
    </div>
  );
}
