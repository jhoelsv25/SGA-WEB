"use client";

import * as React from "react";
import { DataTable } from "@/components/common/data-table";
import type { AusenciaResponseDto } from "../../types";
import { getMisAusenciasColumns } from "./mis-ausencias-columns";
import { MisAusenciaTarjetaMovil } from "./mis-ausencias-tarjetas";

export interface MisAusenciasTablaProps {
  ausencias: AusenciaResponseDto[];
  onVerDetalle: (ausencia: AusenciaResponseDto) => void;
  onAbrirDescargo: (ausencia: AusenciaResponseDto) => void;
}

/**
 * Tabla institucional para visualización de ausencias docentes basada en DataTable.
 * Proporciona soporte nativo responsivo en móviles mediante la prop mobileCard.
 */
export function MisAusenciasTabla({
  ausencias,
  onVerDetalle,
  onAbrirDescargo,
}: MisAusenciasTablaProps) {
  const columns = React.useMemo(
    () => getMisAusenciasColumns({ onVerDetalle, onAbrirDescargo }),
    [onVerDetalle, onAbrirDescargo],
  );

  const renderMobileCard = React.useCallback(
    (ausencia: AusenciaResponseDto) => (
      <MisAusenciaTarjetaMovil
        ausencia={ausencia}
        onVerDetalle={onVerDetalle}
        onAbrirDescargo={onAbrirDescargo}
      />
    ),
    [onVerDetalle, onAbrirDescargo],
  );

  return (
    <DataTable
      columns={columns}
      data={ausencias}
      pagination={false}
      mobileCard={renderMobileCard}
      caption="Historial de ausencias registradas en sesiones de clase y plazos de descargo"
      emptyMessage="No registra ausencias en sus sesiones de clase."
    />
  );
}
