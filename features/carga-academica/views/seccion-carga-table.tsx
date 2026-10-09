"use client";

import * as React from "react";
import { DataTable } from "@/components/common/data-table";
import type { SelectOptionItem } from "@/components/common/select";
import type { CargaItem } from "../types";
import { getSeccionCargaColumns } from "./columns/seccion-carga-columns";

export interface SeccionCargaTableProps {
  items: CargaItem[];
  puedeGestionar: boolean;
  docentesOptions: SelectOptionItem<string>[];
  docentesSeleccionados: Record<string, string>;
  onSelectDocente: (cursoSeccionId: string, docenteId: string) => void;
  guardandoFilaId: string | null;
  onGuardar: (cursoSeccionId: string, docenteId: string | null) => void;
}

export function SeccionCargaTable({
  items,
  puedeGestionar,
  docentesOptions,
  docentesSeleccionados,
  onSelectDocente,
  guardandoFilaId,
  onGuardar,
}: SeccionCargaTableProps) {
  const columns = React.useMemo(
    () =>
      getSeccionCargaColumns({
        puedeGestionar,
        docentesOptions,
        docentesSeleccionados,
        onSelectDocente,
        guardandoFilaId,
        onGuardar,
      }),
    [
      puedeGestionar,
      docentesOptions,
      docentesSeleccionados,
      onSelectDocente,
      guardandoFilaId,
      onGuardar,
    ],
  );

  return (
    <DataTable
      columns={columns}
      data={items}
      pagination={false}
      caption="Carga académica de los cursos de la sección"
      emptyMessage="No se encontraron cursos asignados al plan de estudios de esta sección para este año académico."
    />
  );
}
