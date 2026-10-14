"use client";

import * as React from "react";
import { DataTable } from "@/components/common/data-table";
import type { AusenciaResponseDto } from "@/features/ausencias-docente/types";
import { AusenciaTarjetaMovil } from "./ausencia-tarjeta-movil";
import { getAusenciasColumnas } from "./columna-ausencias";

export interface AusenciasTablaProps {
  data: AusenciaResponseDto[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  usuarioActualId?: string;
  onVerDetalle: (ausencia: AusenciaResponseDto) => void;
  onVerHistorial: (ausencia: AusenciaResponseDto) => void;
  onCorregir: (ausencia: AusenciaResponseDto) => void;
  onAnular: (ausencia: AusenciaResponseDto) => void;
  hasActiveFilters?: boolean;
}

/**
 * Tabla interactiva basada en TanStack Table con vista responsive móvil en tarjetas.
 */
export function AusenciasTabla({
  data,
  isLoading,
  isError,
  onRetry,
  usuarioActualId,
  onVerDetalle,
  onVerHistorial,
  onCorregir,
  onAnular,
  hasActiveFilters = false,
}: AusenciasTablaProps) {
  const columns = React.useMemo(
    () =>
      getAusenciasColumnas({
        usuarioActualId,
        onVerDetalle,
        onVerHistorial,
        onCorregir,
        onAnular,
      }),
    [usuarioActualId, onVerDetalle, onVerHistorial, onCorregir, onAnular],
  );

  const renderMobileCard = React.useCallback(
    (ausencia: AusenciaResponseDto) => (
      <AusenciaTarjetaMovil
        ausencia={ausencia}
        usuarioActualId={usuarioActualId}
        onVerDetalle={onVerDetalle}
        onVerHistorial={onVerHistorial}
        onCorregir={onCorregir}
        onAnular={onAnular}
      />
    ),
    [usuarioActualId, onVerDetalle, onVerHistorial, onCorregir, onAnular],
  );

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
      emptyMessage="No se encontraron ausencias registradas con los filtros seleccionados."
      caption="Listado de ausencias docentes supervisadas"
    />
  );
}
