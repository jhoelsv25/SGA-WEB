"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/common/data-table/data-table-column-header";
import { StatusBadge } from "@/components/common/status-badge";
import { RoleActions } from "./role-actions";
import type { RoleItem } from "../../../types/roles.types";

interface GetRoleColumnsOptions {
  onEdit: (role: RoleItem) => void;
  onAssignPermissions: (role: RoleItem) => void;
}

export function getRoleColumns({
  onEdit,
  onAssignPermissions,
}: GetRoleColumnsOptions): ColumnDef<RoleItem>[] {
  return [
    {
      accessorKey: "nombre",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Rol" />,
      cell: ({ row }) => {
        const role = row.original;

        return (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onAssignPermissions(role)}
              className="text-foreground hover:text-primary cursor-pointer text-left font-semibold transition-colors hover:underline"
            >
              {role.nombre}
            </button>
            <StatusBadge tone={role.esSistema ? "brand" : "neutral"}>
              {role.esSistema ? "Sistema" : "Adicional"}
            </StatusBadge>
          </div>
        );
      },
    },
    {
      accessorKey: "descripcion",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Descripción" />,
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm">{row.original.descripcion || "—"}</span>
      ),
    },
    {
      accessorKey: "usuariosCount",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Cuentas Asignadas" />,
      cell: ({ row }) => {
        const count = row.original.usuariosCount;
        return (
          <Badge variant="secondary" className="rounded-full px-2.5 py-0.5 font-mono text-xs">
            {count} {count === 1 ? "cuenta" : "cuentas"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "activo",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Estado" />,
      cell: ({ row }) => {
        const active = row.original.activo;
        return (
          <StatusBadge tone={active ? "success" : "neutral"} dot>
            {active ? "Activo" : "Inactivo"}
          </StatusBadge>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <RoleActions
          role={row.original}
          onEdit={onEdit}
          onAssignPermissions={onAssignPermissions}
        />
      ),
    },
  ];
}
