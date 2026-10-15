"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/common/data-table/data-table-column-header";
import type { DetalleSesionConsolidado } from "../../types";

export function getDetalleSesionesColumns(): ColumnDef<DetalleSesionConsolidado>[] {
  return [
    {
      accessorKey: "fecha",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Fecha" />,
      cell: ({ row }) => (
        <span className="text-foreground font-mono text-xs font-medium">{row.original.fecha}</span>
      ),
    },
    {
      id: "cursoSeccion",
      accessorFn: (row) => `${row.cursoNombre} ${row.gradoNombre} ${row.seccionNombre}`,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Curso / Grado / Sección" />
      ),
      cell: ({ row }) => {
        const s = row.original;
        return (
          <div className="flex flex-col">
            <span className="text-foreground text-xs font-medium">{s.cursoNombre}</span>
            <span className="text-muted-foreground text-[11px]">
              {s.gradoNombre} &ldquo;{s.seccionNombre}&rdquo;
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "tema",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Tema desarrollado" />,
      cell: ({ row }) => {
        const tema = row.original.tema;
        return (
          <span className="text-muted-foreground line-clamp-1 max-w-xs text-xs" title={tema ?? ""}>
            {tema || "—"}
          </span>
        );
      },
    },
    {
      accessorKey: "horaIngresoFirmada",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Ingreso" className="justify-center" />
      ),
      cell: ({ row }) => (
        <div className="text-center font-mono text-xs">
          {row.original.horaIngresoFirmada || <span className="text-muted-foreground">—</span>}
        </div>
      ),
    },
    {
      accessorKey: "horaSalidaFirmada",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Salida" className="justify-center" />
      ),
      cell: ({ row }) => (
        <div className="text-center font-mono text-xs">
          {row.original.horaSalidaFirmada || <span className="text-muted-foreground">—</span>}
        </div>
      ),
    },
    {
      accessorKey: "minutosPerdidos",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Min. Perdidos" className="justify-center" />
      ),
      cell: ({ row }) => {
        const min = row.original.minutosPerdidos;
        return (
          <div className="text-center font-mono text-xs font-semibold">
            {min > 0 ? (
              <span className="text-destructive">{min} min</span>
            ) : (
              <span className="text-muted-foreground">0 min</span>
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
        const tone =
          estado === "cumplida"
            ? "default"
            : estado === "no_cumplida"
              ? "destructive"
              : "secondary";
        return (
          <div className="flex justify-center">
            <Badge variant={tone} className="text-[10px]">
              {estado}
            </Badge>
          </div>
        );
      },
    },
  ];
}
