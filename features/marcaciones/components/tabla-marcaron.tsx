"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/common/data-table";
import { DataTableColumnHeader } from "@/components/common/data-table/data-table-column-header";
import { StatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import { RESULTADOS_MARCACION_CONFIG, TIPOS_MARCACION_LABEL } from "../consts";
import type { MarcacionApi } from "../types";

export interface TablaMarcaronProps {
  marcaciones: MarcacionApi[];
  puedeJustificar: boolean;
  onJustificar: (marcacion: MarcacionApi) => void;
}

const horaDe = (fechaHora: string): string => fechaHora.slice(11, 16);

function esJustificable(m: MarcacionApi): boolean {
  return !m.justificada && (m.resultado === "tardanza" || m.resultado === "salida_anticipada");
}

export function TablaMarcaron({ marcaciones, puedeJustificar, onJustificar }: TablaMarcaronProps) {
  const columns = React.useMemo<ColumnDef<MarcacionApi>[]>(() => {
    return [
      {
        accessorKey: "fechaHora",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Hora" className="w-20" />
        ),
        cell: ({ row }) => (
          <span className="font-mono text-xs font-semibold">{horaDe(row.original.fechaHora)}</span>
        ),
      },
      {
        accessorKey: "nombreCompleto",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Persona" />,
        cell: ({ row }) => (
          <span className="text-xs font-medium">{row.original.nombreCompleto}</span>
        ),
      },
      {
        accessorKey: "tipo",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Marcación" />,
        cell: ({ row }) => {
          const m = row.original;
          return (
            <span className="text-muted-foreground text-xs">
              {TIPOS_MARCACION_LABEL[m.tipo]}
              {m.origen === "manual" && " · manual"}
            </span>
          );
        },
      },
      {
        accessorKey: "resultado",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Resultado" />,
        cell: ({ row }) => {
          const m = row.original;
          const resultado = RESULTADOS_MARCACION_CONFIG[m.resultado];
          return (
            <div className="flex flex-wrap items-center gap-1.5">
              <StatusBadge tone={resultado.tone} dot size="sm">
                {resultado.label}
                {m.minutosTardanza > 0 && ` · ${m.minutosTardanza} min`}
              </StatusBadge>
              {m.justificada && (
                <StatusBadge tone="info" size="sm">
                  Justificada
                </StatusBadge>
              )}
            </div>
          );
        },
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => {
          const m = row.original;
          if (!puedeJustificar || !esJustificable(m)) return null;
          return (
            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 px-3 text-xs"
                onClick={() => onJustificar(m)}
              >
                Justificar
              </Button>
            </div>
          );
        },
      },
    ];
  }, [puedeJustificar, onJustificar]);

  return (
    <DataTable
      columns={columns}
      data={marcaciones}
      pagination={false}
      caption="Registro de personas que marcaron en la fecha seleccionada"
      emptyMessage="No hay marcaciones registradas para los filtros seleccionados."
    />
  );
}
