"use client";

import * as React from "react";
import { DataTable } from "@/components/common/data-table";
import type { CargaDocenteDetalle, CursoDocenteItem } from "../types";
import { getDocenteCargaColumns } from "./columns/docente-carga-columns";

export interface DocenteCargaTableProps {
  cursos: CursoDocenteItem[];
  carga?: CargaDocenteDetalle;
}

export function DocenteCargaTable({ cursos, carga }: DocenteCargaTableProps) {
  const columns = React.useMemo(() => getDocenteCargaColumns(), []);

  return (
    <div className="space-y-3">
      <DataTable
        columns={columns}
        data={cursos}
        pagination={false}
        caption="Cursos y secciones asignados al docente"
        emptyMessage="Este docente no tiene asignaturas ni secciones a cargo en el presente año académico."
      />

      {carga && cursos.length > 0 && (
        <div className="border-border/80 bg-muted/20 flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm font-semibold">
          <span className="text-muted-foreground text-xs tracking-wider uppercase">
            Total de horas asignadas
          </span>
          <div className="flex items-center gap-2">
            <span className="text-foreground text-base">{carga.horasAsignadas}</span>
            <span className="text-muted-foreground text-xs font-normal">
              de {carga.jornadaHoras} hrs/sem
            </span>
            {carga.excede && (
              <span className="text-destructive bg-destructive/10 rounded-full px-2 py-0.5 text-xs font-bold">
                Exceso de jornada
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
