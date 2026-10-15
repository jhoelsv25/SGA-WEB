"use client";

import * as React from "react";
import { AlertCircleIcon, FileEditIcon } from "@hugeicons/core-free-icons";
import { DataTable } from "@/components/common/data-table";
import { EmptyState } from "@/components/common/empty-state";
import { ListToolbar } from "@/components/common/list-toolbar";
import { PageHeader } from "@/components/common/page-header";
import { useAnioLectivo } from "@/features/anio-escolar/anio-lectivo-context";
import { useListFilters } from "@/hooks/use-list-filters";
import { usePuedeGestionarSolicitudes, useSolicitudesRevision } from "../../hooks";
import type {
  EstadoSolicitudRevision,
  FiltroSolicitudesQueryDto,
  SolicitudRevisionResponseDto,
} from "../../types";
import { ModalDetalleSolicitud } from "./modal-detalle-solicitud";
import { ModalResolverSolicitud } from "./modal-resolver-solicitud";
import { getSolicitudesColumnas } from "./solicitudes-columnas";
import { generarFiltroDefsSolicitudes } from "./solicitudes-filtro-defs";
import { SolicitudesMetricas } from "./solicitudes-metricas";
import { SolicitudTarjetaMovil } from "./solicitud-tarjeta-movil";

/**
 * Vista principal de la bandeja «Solicitudes de revisión» para el Director (RF-013 HU3).
 * Incluye filtros reactivos por estado y bimestre, contador de pendientes,
 * tabla con tarjetas responsive para celulares y modales de detalle y resolución.
 */
export function SolicitudesRevisionVista() {
  const puedeGestionar = usePuedeGestionarSolicitudes();
  const { anio } = useAnioLectivo();

  // Estados de modales desacoplados
  const [solicitudDetalle, setSolicitudDetalle] =
    React.useState<SolicitudRevisionResponseDto | null>(null);
  const [resolucion, setResolucion] = React.useState<{
    solicitud: SolicitudRevisionResponseDto;
    accion: "aceptar" | "rechazar";
  } | null>(null);

  // Configuración de filtros sincronizada con la URL
  const filterDefs = React.useMemo(
    () => generarFiltroDefsSolicitudes(anio?.bimestres),
    [anio?.bimestres],
  );

  const listFilters = useListFilters(filterDefs);
  const periodoId = listFilters.getString("periodoId");
  const estadoFiltro = listFilters.getString("estado");
  const busquedaTexto = listFilters.getString("search");

  // Query params tipados para la API
  const queryParams = React.useMemo<FiltroSolicitudesQueryDto>(() => {
    const params: FiltroSolicitudesQueryDto = {};
    if (periodoId && periodoId !== "all") {
      params.periodoId = periodoId;
    }
    if (
      estadoFiltro &&
      estadoFiltro !== "all" &&
      ["solicitada", "aceptada", "rechazada"].includes(estadoFiltro)
    ) {
      params.estado = estadoFiltro as EstadoSolicitudRevision;
    }
    return params;
  }, [periodoId, estadoFiltro]);

  const {
    data: solicitudes = [],
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useSolicitudesRevision(queryParams, puedeGestionar);

  // Filtrado complementario en memoria para búsqueda textual
  const solicitudesFiltradas = React.useMemo(() => {
    if (!busquedaTexto || !busquedaTexto.trim()) {
      return solicitudes;
    }
    const termino = busquedaTexto.toLowerCase().trim();
    return solicitudes.filter((item) => {
      const docente = item.docenteNombre?.toLowerCase() ?? "";
      const documento = item.docenteDocumento?.toLowerCase() ?? "";
      const motivo = item.motivo?.toLowerCase() ?? "";
      const periodo = item.periodoNombre?.toLowerCase() ?? "";

      return (
        docente.includes(termino) ||
        documento.includes(termino) ||
        motivo.includes(termino) ||
        periodo.includes(termino)
      );
    });
  }, [solicitudes, busquedaTexto]);

  const hasActiveFilters = Boolean(
    (periodoId && periodoId !== "all") ||
    (estadoFiltro && estadoFiltro !== "all") ||
    Boolean(busquedaTexto && busquedaTexto.trim()),
  );

  // Handlers para acciones
  const handleVerDetalle = React.useCallback((sol: SolicitudRevisionResponseDto) => {
    setSolicitudDetalle(sol);
  }, []);

  const handleAceptar = React.useCallback((sol: SolicitudRevisionResponseDto) => {
    setResolucion({ solicitud: sol, accion: "aceptar" });
  }, []);

  const handleRechazar = React.useCallback((sol: SolicitudRevisionResponseDto) => {
    setResolucion({ solicitud: sol, accion: "rechazar" });
  }, []);

  // Columnas de la tabla
  const columns = React.useMemo(
    () =>
      getSolicitudesColumnas({
        onVerDetalle: handleVerDetalle,
        onAceptar: handleAceptar,
        onRechazar: handleRechazar,
      }),
    [handleVerDetalle, handleAceptar, handleRechazar],
  );

  // Tarjeta móvil para vista adaptativa
  const renderMobileCard = React.useCallback(
    (sol: SolicitudRevisionResponseDto) => (
      <SolicitudTarjetaMovil
        solicitud={sol}
        onVerDetalle={handleVerDetalle}
        onAceptar={handleAceptar}
        onRechazar={handleRechazar}
      />
    ),
    [handleVerDetalle, handleAceptar, handleRechazar],
  );

  if (!puedeGestionar) {
    return (
      <div className="animate-in fade-in-50 flex flex-col gap-6 duration-300">
        <PageHeader
          title="Solicitudes de revisión"
          description="Bandeja directiva para revisar, aceptar o rechazar solicitudes de revisión de consolidados docentes."
          icon={FileEditIcon}
          breadcrumbs={[
            { label: "Inicio", href: "/admin/dashboard" },
            { label: "Solicitudes de revisión" },
          ]}
        />
        <EmptyState
          title="Acceso restringido"
          description="Su rol no tiene autorización para acceder a las solicitudes de revisión ni modificarlas."
          icon={AlertCircleIcon}
        />
      </div>
    );
  }

  return (
    <div className="animate-in fade-in-50 flex flex-col gap-6 duration-300">
      <PageHeader
        title="Solicitudes de revisión"
        description="Bandeja directiva para revisar, aceptar o rechazar solicitudes de revisión de consolidados docentes."
        icon={FileEditIcon}
        breadcrumbs={[
          { label: "Inicio", href: "/admin/dashboard" },
          { label: "Consolidado de bimestre", href: "/admin/consolidado-bimestre" },
          { label: "Solicitudes de revisión" },
        ]}
      />

      {/* Contador de pendientes y métricas */}
      <SolicitudesMetricas solicitudes={solicitudes} isLoading={isLoading} />

      {/* Barra de herramientas con filtros reactivos sincronizados a la URL */}
      <ListToolbar
        filterDefs={filterDefs}
        listFilters={listFilters}
        onRefresh={() => void refetch()}
        isRefreshing={isFetching}
        refreshLabel="Actualizar solicitudes"
      />

      {/* Tabla y vista adaptativa en tarjetas móviles */}
      <DataTable
        columns={columns}
        data={solicitudesFiltradas}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => void refetch()}
        pagination={true}
        mobileCard={renderMobileCard}
        hasActiveFilters={hasActiveFilters}
        emptyState={{
          title: "No hay solicitudes de revisión",
          description: hasActiveFilters
            ? "No se encontraron solicitudes con los filtros seleccionados."
            : "Las solicitudes de revisión enviadas por los docentes aparecerán aquí.",
        }}
        caption="Bandeja de solicitudes de revisión de consolidado docente"
      />

      {/* Modal de detalle completo */}
      <ModalDetalleSolicitud
        solicitud={solicitudDetalle}
        open={Boolean(solicitudDetalle)}
        onOpenChange={(abierto) => !abierto && setSolicitudDetalle(null)}
        onAceptar={handleAceptar}
        onRechazar={handleRechazar}
      />

      {/* Modal para aceptar o rechazar con respuesta obligatoria */}
      <ModalResolverSolicitud
        solicitud={resolucion?.solicitud ?? null}
        accion={resolucion?.accion ?? null}
        open={Boolean(resolucion)}
        onOpenChange={(abierto) => !abierto && setResolucion(null)}
        onSuccess={() => void refetch()}
      />
    </div>
  );
}
