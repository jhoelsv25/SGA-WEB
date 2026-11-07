"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/common/data-table";
import { StatusBadge } from "@/components/common/status-badge";
import type { FilaSeguimiento } from "../../types";

export function getMaterialesBimestreColumns(): ColumnDef<FilaSeguimiento>[] {
  return [
    {
      accessorKey: "docenteNombre",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Docente" />,
      cell: ({ row }) => (
        <span className="text-foreground text-xs font-medium">{row.original.docenteNombre}</span>
      ),
    },
    {
      id: "curso",
      accessorFn: (row) => `${row.cursoNombre} · ${row.seccionNombre}`,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Curso" />,
      cell: ({ row }) => (
        <span className="text-muted-foreground text-xs">
          {row.original.cursoNombre} · {row.original.seccionNombre}
        </span>
      ),
    },
    {
      accessorKey: "planificados",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Planificados" className="justify-end" />
      ),
      cell: ({ row }) => (
        <div className="text-right text-xs font-medium tabular-nums">
          {row.original.planificados}
        </div>
      ),
    },
    {
      accessorKey: "aTiempo",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="A tiempo" className="justify-end" />
      ),
      cell: ({ row }) => (
        <div className="text-right text-xs font-medium text-emerald-600 tabular-nums">
          {row.original.aTiempo}
        </div>
      ),
    },
    {
      accessorKey: "fueraDePlazo",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Fuera de plazo" className="justify-end" />
      ),
      cell: ({ row }) => (
        <div className="text-right text-xs text-amber-600 tabular-nums">
          {row.original.fueraDePlazo}
        </div>
      ),
    },
    {
      accessorKey: "noPublicados",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="No publicados" className="justify-end" />
      ),
      cell: ({ row }) => (
        <div className="text-destructive text-right text-xs tabular-nums">
          {row.original.noPublicados}
        </div>
      ),
    },
    {
      accessorKey: "porcentajeATiempo",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="% a tiempo" className="justify-end" />
      ),
      cell: ({ row }) => (
        <div className="flex justify-end">
          <StatusBadge tone={row.original.porcentajeATiempo >= 80 ? "success" : "warning"}>
            {row.original.porcentajeATiempo}%
          </StatusBadge>
        </div>
      ),
    },
    {
      accessorKey: "solicitudesPendientes",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Solicitudes" className="justify-end" />
      ),
      cell: ({ row }) => (
        <div className="text-right text-xs tabular-nums">{row.original.solicitudesPendientes}</div>
      ),
    },
  ];
}
