"use client";

import * as React from "react";
import { PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { DataTable } from "@/components/common/data-table";
import { Button } from "@/components/ui/button";
import type { ConsolidadoResumenDto } from "../../types";
import { getConsolidadoColumnas } from "./columna-consolidados";
import { ConsolidadoTarjetaMovil } from "./consolidado-tarjeta-movil";

export interface ConsolidadoTablaProps {
  data: ConsolidadoResumenDto[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  puedeGestionar: boolean;
  hasActiveFilters?: boolean;
  onGenerarTodos?: () => void;
  onVerDetalle: (consolidado: ConsolidadoResumenDto) => void;
  onVerHistorial: (consolidado: ConsolidadoResumenDto) => void;
  onDescargarFicha: (consolidado: ConsolidadoResumenDto) => void;
  onReabrir?: (consolidado: ConsolidadoResumenDto) => void;
  onCerrar?: (consolidado: ConsolidadoResumenDto) => void;
  onRegistrarDecision?: (consolidado: ConsolidadoResumenDto) => void;
  onGenerarUno?: (consolidado: ConsolidadoResumenDto) => void;
}

/**
 * Tabla principal interactiva con ordenamiento en todas las columnas y vista móvil en tarjetas (RF-013 HU4).
 */
export function ConsolidadoTabla({
  data,
  isLoading,
  isError,
  onRetry,
  puedeGestionar,
  hasActiveFilters = false,
  onGenerarTodos,
  onVerDetalle,
  onVerHistorial,
  onDescargarFicha,
  onReabrir,
  onCerrar,
  onRegistrarDecision,
  onGenerarUno,
}: ConsolidadoTablaProps) {
  const columns = React.useMemo(
    () =>
      getConsolidadoColumnas({
        puedeGestionar,
        onVerDetalle,
        onVerHistorial,
        onDescargarFicha,
        onReabrir,
        onCerrar,
        onRegistrarDecision,
        onGenerarUno,
      }),
    [
      puedeGestionar,
      onVerDetalle,
      onVerHistorial,
      onDescargarFicha,
      onReabrir,
      onCerrar,
      onRegistrarDecision,
      onGenerarUno,
    ],
  );

  const renderMobileCard = React.useCallback(
    (consolidado: ConsolidadoResumenDto) => (
      <ConsolidadoTarjetaMovil
        consolidado={consolidado}
        puedeGestionar={puedeGestionar}
        onVerDetalle={onVerDetalle}
        onVerHistorial={onVerHistorial}
        onDescargarFicha={onDescargarFicha}
        onReabrir={onReabrir}
        onCerrar={onCerrar}
        onRegistrarDecision={onRegistrarDecision}
        onGenerarUno={onGenerarUno}
      />
    ),
    [
      puedeGestionar,
      onVerDetalle,
      onVerHistorial,
      onDescargarFicha,
      onReabrir,
      onCerrar,
      onRegistrarDecision,
      onGenerarUno,
    ],
  );

  const emptyAction =
    puedeGestionar && onGenerarTodos ? (
      <Button
        type="button"
        variant="default"
        size="sm"
        onClick={onGenerarTodos}
        className="gap-1.5 text-xs shadow-xs"
      >
        <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
        <span>Generar consolidado del bimestre</span>
      </Button>
    ) : undefined;

  return (
    <DataTable
      columns={columns}
      data={data}
      isLoading={isLoading}
      isError={isError}
      onRetry={onRetry}
      pagination={true}
      mobileCard={renderMobileCard}
      hasActiveFilters={hasActiveFilters}
      emptyState={{
        title: "Consolidado aún no generado",
        description:
          "El consolidado para este bimestre todavía no ha sido generado. Puede generarlo para todos los docentes usando la opción directiva.",
        action: emptyAction,
      }}
      emptyMessage="No se encontraron docentes con los criterios de búsqueda especificados."
      caption="Listado del consolidado bimestral de docentes"
    />
  );
}
