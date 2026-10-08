"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/common/data-table/data-table-column-header";
import { RoleActions } from "./role-actions";
import { ROLE_BADGE_VARIANTS } from "../../../consts/roles.consts";
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
        const variant = role.esSistema ? ROLE_BADGE_VARIANTS.system : ROLE_BADGE_VARIANTS.custom;

        return (
          <div className="flex items-center gap-2">
            <span className="text-foreground font-semibold">{role.nombre}</span>
            <Badge variant="outline" className={variant.className}>
              {variant.label}
            </Badge>
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
          <Badge variant="secondary" className="font-mono text-xs">
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
          <Badge
            variant="outline"
            className={
              active
                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "border-muted bg-muted text-muted-foreground"
            }
          >
            {active ? "Activo" : "Inactivo"}
          </Badge>
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
