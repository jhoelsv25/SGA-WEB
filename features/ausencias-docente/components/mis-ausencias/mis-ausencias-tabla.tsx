"use client";

import * as React from "react";
import { DataTable } from "@/components/common/data-table";
import type { AusenciaResponseDto } from "../../types";
import { getMisAusenciasColumns } from "./mis-ausencias-columns";

export interface MisAusenciasTablaProps {
  ausencias: AusenciaResponseDto[];
  onVerDetalle: (ausencia: AusenciaResponseDto) => void;
  onAbrirDescargo: (ausencia: AusenciaResponseDto) => void;
}

/**
 * Tabla institucional para visualización de ausencias docentes basada en DataTable.
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

  return (
    <DataTable
      columns={columns}
      data={ausencias}
      pagination={false}
      caption="Historial de ausencias registradas en sesiones de clase y plazos de descargo"
      emptyMessage="No registra ausencias en sus sesiones de clase."
    />
  );
}
