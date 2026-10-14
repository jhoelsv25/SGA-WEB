"use client";

import * as React from "react";
import { AlertCircleIcon, Clock01Icon } from "@hugeicons/core-free-icons";
import { EmptyState } from "@/components/common/empty-state";
import { ListToolbar } from "@/components/common/list-toolbar";
import { PageHeader } from "@/components/common/page-header";
import { useAnioLectivo } from "@/features/anio-escolar/anio-lectivo-context";
import {
  useAusenciasSupervisor,
  usePuedeGestionarAusencias,
} from "@/features/ausencias-docente/hooks";
import type {
  AusenciaResponseDto,
  FiltroAusenciasQueryDto,
} from "@/features/ausencias-docente/types";
import { useSession } from "@/features/auth";
import { useDocentesQuery } from "@/features/docentes/hooks/use-docentes";
import { useListFilters } from "@/hooks/use-list-filters";
import { generarFiltroDefsSupervision } from "./ausencias-filtro-defs";
import { AusenciasMetricas } from "./ausencias-metricas";
import { AusenciasTabla } from "./ausencias-tabla";
import { ModalAnularAusencia } from "./modal-anular-ausencia";
import { ModalCorregirAusencia } from "./modal-corregir-ausencia";
import { ModalDetalleAusencia } from "./modal-detalle-ausencia";
import { ModalHistorialAusencia } from "./modal-historial-ausencia";

/**
 * Vista principal de supervisión de ausencias docentes (RF-012 HU2 y HU4).
 * Permite filtrar por bimestre, docente y fechas, consultar el total de minutos sin anuladas,
 * acceder al historial de cambios, corregir y anular registros.
 */
export function AusenciasSupervisionVista() {
  const puedeGestionar = usePuedeGestionarAusencias();
  const { data: sessionData } = useSession();
  const usuarioActual = sessionData?.user;

  const { anio } = useAnioLectivo();
  const { data: docentesResponse } = useDocentesQuery({ limit: 100, estado: "activo" });

  // Estados de modales desacoplados
  const [ausenciaDetalle, setAusenciaDetalle] = React.useState<AusenciaResponseDto | null>(null);
  const [ausenciaHistorial, setAusenciaHistorial] = React.useState<AusenciaResponseDto | null>(
    null,
  );
  const [ausenciaCorregir, setAusenciaCorregir] = React.useState<AusenciaResponseDto | null>(null);
  const [ausenciaAnular, setAusenciaAnular] = React.useState<AusenciaResponseDto | null>(null);

  // Definición de filtros con sincronización en la URL
  const filterDefs = React.useMemo(
    () => generarFiltroDefsSupervision(anio?.bimestres, docentesResponse?.data),
    [anio?.bimestres, docentesResponse?.data],
  );

  const listFilters = useListFilters(filterDefs);

  const periodoId = listFilters.getString("periodoId");
  const docenteId = listFilters.getString("docenteId");
  const fechaDesde = listFilters.getString("fechaDesde");
  const fechaHasta = listFilters.getString("fechaHasta");
  const busquedaTexto = listFilters.getString("search");

  const queryParams = React.useMemo<FiltroAusenciasQueryDto>(
    () => ({
      periodoId: periodoId && periodoId !== "all" ? periodoId : undefined,
      docenteId: docenteId && docenteId !== "all" ? docenteId : undefined,
      fechaDesde: fechaDesde || undefined,
      fechaHasta: fechaHasta || undefined,
    }),
    [periodoId, docenteId, fechaDesde, fechaHasta],
  );

  const {
    data: resumenResponse,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useAusenciasSupervisor(queryParams);

  // Filtrado complementario por texto de búsqueda en el cliente
  const ausenciasFiltradas = React.useMemo(() => {
    const lista = resumenResponse?.data ?? [];
    if (!busquedaTexto || busquedaTexto.trim() === "") {
      return lista;
    }
    const termino = busquedaTexto.toLowerCase().trim();
    return lista.filter((item) => {
      const docente = item.sesion.docenteNombre?.toLowerCase() ?? "";
      const curso = item.sesion.cursoNombre?.toLowerCase() ?? "";
      const seccion = item.sesion.seccionNombre?.toLowerCase() ?? "";
      const observacion = item.observacion?.toLowerCase() ?? "";
      const motivo = item.motivo?.toLowerCase() ?? "";

      return (
        docente.includes(termino) ||
        curso.includes(termino) ||
        seccion.includes(termino) ||
        observacion.includes(termino) ||
        motivo.includes(termino)
      );
    });
  }, [resumenResponse?.data, busquedaTexto]);

  const hasActiveFilters = Boolean(
    (periodoId && periodoId !== "all") ||
    (docenteId && docenteId !== "all") ||
    fechaDesde ||
    fechaHasta ||
    busquedaTexto,
  );

  if (!puedeGestionar) {
    return (
      <div className="animate-in fade-in-50 flex flex-col gap-6 duration-300">
        <PageHeader
          title="Ausencias docentes"
          description="Supervisión y control de ausencias de docentes en sesiones de clase."
          icon={Clock01Icon}
          breadcrumbs={[
            { label: "Inicio", href: "/admin/dashboard" },
            { label: "Ausencias docentes" },
          ]}
        />
        <EmptyState
          title="Acceso restringido"
          description="No cuenta con los permisos necesarios para supervisar ausencias docentes."
          icon={AlertCircleIcon}
        />
      </div>
    );
  }

  return (
    <div className="animate-in fade-in-50 flex flex-col gap-6 duration-300">
      <PageHeader
        title="Ausencias docentes"
        description="Supervisión y control de ausencias de docentes en sesiones de clase."
        icon={Clock01Icon}
        breadcrumbs={[
          { label: "Inicio", href: "/admin/dashboard" },
          { label: "Ausencias docentes" },
        ]}
      />

      {/* Métricas consolidadas (incluye total de minutos sin contar anuladas) */}
      <AusenciasMetricas
        totalMinutos={resumenResponse?.totalMinutos ?? 0}
        totalAusencias={resumenResponse?.totalAusencias ?? 0}
        totalAnuladas={resumenResponse?.totalAnuladas ?? 0}
      />

      {/* Barra de filtros de búsqueda sincronizada con la URL */}
      <ListToolbar
        filterDefs={filterDefs}
        listFilters={listFilters}
        onRefresh={() => void refetch()}
        isRefreshing={isFetching}
        refreshLabel="Actualizar listado"
      />

      {/* Tabla y vista adaptativa en tarjetas */}
      <AusenciasTabla
        data={ausenciasFiltradas}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => void refetch()}
        usuarioActualId={usuarioActual?.id}
        onVerDetalle={(a) => setAusenciaDetalle(a)}
        onVerHistorial={(a) => setAusenciaHistorial(a)}
        onCorregir={(a) => setAusenciaCorregir(a)}
        onAnular={(a) => setAusenciaAnular(a)}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Modales desacoplados de interacción */}
      <ModalDetalleAusencia
        ausencia={ausenciaDetalle}
        open={Boolean(ausenciaDetalle)}
        onOpenChange={(open) => !open && setAusenciaDetalle(null)}
      />

      <ModalHistorialAusencia
        ausencia={ausenciaHistorial}
        open={Boolean(ausenciaHistorial)}
        onOpenChange={(open) => !open && setAusenciaHistorial(null)}
      />

      <ModalCorregirAusencia
        ausencia={ausenciaCorregir}
        open={Boolean(ausenciaCorregir)}
        onOpenChange={(open) => !open && setAusenciaCorregir(null)}
      />

      <ModalAnularAusencia
        ausencia={ausenciaAnular}
        open={Boolean(ausenciaAnular)}
        onOpenChange={(open) => !open && setAusenciaAnular(null)}
      />
    </div>
  );
}
