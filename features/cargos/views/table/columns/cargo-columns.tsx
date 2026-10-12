"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/common/data-table/data-table-column-header";
import { StatusBadge } from "@/components/common/status-badge";
import { CargoActions } from "./cargo-actions";
import type { CargoItem } from "../../../types/cargos.types";

interface GetCargoColumnsOptions {
  onEdit: (cargo: CargoItem) => void;
}

export function getCargoColumns({ onEdit }: GetCargoColumnsOptions): ColumnDef<CargoItem>[] {
  return [
    {
      accessorKey: "nombre",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Cargo" />,
      cell: ({ row }) => (
        <button
          type="button"
          onClick={() => onEdit(row.original)}
          className="text-foreground hover:text-primary cursor-pointer text-left font-semibold transition-colors hover:underline"
        >
          {row.original.nombre}
        </button>
      ),
    },
    {
      accessorKey: "descripcion",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Descripción" />,
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm">{row.original.descripcion || "—"}</span>
      ),
    },
    {
      id: "rolesSugeridos",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Roles sugeridos" />,
      cell: ({ row }) => {
        const roles = row.original.rolesSugeridos;
        if (roles.length === 0) {
          return <span className="text-muted-foreground text-xs">Ninguno</span>;
        }
        return (
          <div className="flex flex-wrap gap-1">
            {roles.map((r) => (
              <Badge key={r.id} variant="secondary" className="rounded-full px-2 py-0.5 text-xs">
                {r.nombre}
              </Badge>
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: "personasCount",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Personal vigente" />,
      cell: ({ row }) => {
        const count = row.original.personasCount;
        return (
          <Badge variant="secondary" className="rounded-full px-2.5 py-0.5 font-mono text-xs">
            {count} {count === 1 ? "persona" : "personas"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "vigente",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Estado" />,
      cell: ({ row }) => {
        const vigente = row.original.vigente;
        return (
          <StatusBadge tone={vigente ? "success" : "neutral"} dot>
            {vigente ? "Vigente" : "Desactivado"}
          </StatusBadge>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => <CargoActions cargo={row.original} onEdit={onEdit} />,
    },
  ];
}
