"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/common/data-table/data-table-column-header";
import { ESTADOS_CONSOLIDADO_CONFIG } from "../../consts";
import type { HistorialVersionConsolidadoItem } from "../../types";

export function getHistorialVersionesColumns(): ColumnDef<HistorialVersionConsolidadoItem>[] {
  return [
    {
      accessorKey: "version",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Versión" />,
      cell: ({ row }) => {
        const v = row.original;
        return (
          <div className="flex items-center gap-1.5">
            <Badge variant={v.vigente ? "default" : "outline"} className="text-xs">
              v{v.version}
            </Badge>
            {v.vigente && (
              <span className="text-primary text-[10px] font-bold tracking-wider uppercase">
                (Vigente)
              </span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "estado",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Estado" className="justify-center" />
      ),
      cell: ({ row }) => {
        const estado = row.original.estado;
        const config = ESTADOS_CONSOLIDADO_CONFIG[estado] ?? {
          label: estado,
          variant: "secondary" as const,
        };
        return (
          <div className="flex justify-center">
            <Badge variant={config.variant} className={config.className}>
              {config.label}
            </Badge>
          </div>
        );
      },
    },
    {
      id: "sesiones",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Sesiones (Prog/Cumpl)"
          className="justify-center"
        />
      ),
      cell: ({ row }) => {
        const v = row.original;
        return (
          <div className="text-center font-mono text-xs">
            {v.sesionesCumplidas}/{v.sesionesProgramadas}
          </div>
        );
      },
    },
    {
      accessorKey: "minutosTotalFuera",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Min. Fuera" className="justify-center" />
      ),
      cell: ({ row }) => (
        <div className="text-center font-mono text-xs font-semibold">
          {row.original.minutosTotalFuera} min
        </div>
      ),
    },
    {
      accessorKey: "motivoCambio",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Motivo del Cambio" />,
      cell: ({ row }) => {
        const motivo = row.original.motivoCambio;
        return (
          <span
            className="text-muted-foreground line-clamp-1 max-w-xs text-xs"
            title={motivo ?? ""}
          >
            {motivo || "—"}
          </span>
        );
      },
    },
    {
      accessorKey: "generadoPorNombre",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Generado Por" />,
      cell: ({ row }) => (
        <span className="text-foreground text-xs font-medium">
          {row.original.generadoPorNombre}
        </span>
      ),
    },
    {
      accessorKey: "generadoEn",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Fecha" className="justify-center" />
      ),
      cell: ({ row }) => {
        const fecha = row.original.generadoEn;
        return (
          <div className="text-muted-foreground text-center font-mono text-xs">
            {fecha ? new Date(fecha).toLocaleDateString("es-PE") : "—"}
          </div>
        );
      },
    },
  ];
}
