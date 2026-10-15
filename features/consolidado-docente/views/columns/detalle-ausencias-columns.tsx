"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/common/data-table/data-table-column-header";
import type { DetalleAusenciaConsolidado } from "../../types";

export interface DetalleAusenciaFila extends DetalleAusenciaConsolidado {
  sesionFecha: string;
  cursoNombre: string;
  seccionNombre: string;
}

export function getDetalleAusenciasColumns(): ColumnDef<DetalleAusenciaFila>[] {
  return [
    {
      accessorKey: "sesionFecha",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Fecha Sesión" />,
      cell: ({ row }) => (
        <span className="text-foreground font-mono text-xs font-medium">
          {row.original.sesionFecha}
        </span>
      ),
    },
    {
      id: "cursoSeccion",
      accessorFn: (row) => `${row.cursoNombre} ${row.seccionNombre}`,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Curso / Sección" />,
      cell: ({ row }) => {
        const a = row.original;
        return (
          <span className="text-foreground text-xs font-medium">
            {a.cursoNombre} ({a.seccionNombre})
          </span>
        );
      },
    },
    {
      accessorKey: "tramoHorario",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Tramo Horario" className="justify-center" />
      ),
      cell: ({ row }) => (
        <div className="text-center font-mono text-xs">{row.original.tramoHorario}</div>
      ),
    },
    {
      accessorKey: "minutos",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Minutos" className="justify-center" />
      ),
      cell: ({ row }) => (
        <div className="text-center font-mono text-xs font-semibold">
          {row.original.minutos} min
        </div>
      ),
    },
    {
      accessorKey: "motivo",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Motivo" />,
      cell: ({ row }) => (
        <span className="text-foreground text-xs font-medium">{row.original.motivo}</span>
      ),
    },
    {
      accessorKey: "descargo",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Descargo del docente" />
      ),
      cell: ({ row }) => {
        const descargo = row.original.descargo;
        return (
          <span
            className="text-muted-foreground line-clamp-1 max-w-xs text-xs"
            title={descargo ?? ""}
          >
            {descargo || "—"}
          </span>
        );
      },
    },
    {
      accessorKey: "anulada",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Estado" className="justify-center" />
      ),
      cell: ({ row }) => {
        const anulada = row.original.anulada;
        return (
          <div className="flex justify-center">
            {anulada ? (
              <Badge variant="destructive" className="text-[10px]">
                Anulada
              </Badge>
            ) : (
              <Badge variant="outline" className="text-[10px]">
                Efectiva
              </Badge>
            )}
          </div>
        );
      },
    },
  ];
}
