"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/common/user-avatar";
import { DataTableColumnHeader } from "@/components/common/data-table/data-table-column-header";
import { formatDate } from "@/lib/formatters/date";
import { UserActions } from "./user-actions";
import { USER_STATUS_CONFIG } from "../../../consts/users.consts";
import type { TempPasswordResetResponse, UserItem } from "../../../types/users.types";

interface GetUserColumnsOptions {
  currentUserId?: string;
  onChangeRole: (user: UserItem) => void;
  onUpdateUsername: (user: UserItem) => void;
  onPasswordReset: (data: TempPasswordResetResponse, username: string) => void;
}

export function getUserColumns({
  currentUserId,
  onChangeRole,
  onUpdateUsername,
  onPasswordReset,
}: GetUserColumnsOptions): ColumnDef<UserItem>[] {
  return [
    {
      id: "persona",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Persona" />,
      cell: ({ row }) => {
        const p = row.original.persona;
        const fullName = `${p.apellidoPaterno} ${p.apellidoMaterno ?? ""}, ${p.nombres}`.trim();

        return (
          <div className="flex items-center gap-3">
            <UserAvatar name={fullName} avatar={p.fotoUrl ?? undefined} />
            <div className="space-y-0.5">
              <p className="text-foreground font-medium">{fullName}</p>
              <p className="text-muted-foreground text-xs">
                <span className="font-mono uppercase">{p.tipoDocumento}</span>: {p.numeroDocumento}
                {p.correo && ` · ${p.correo}`}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "nombreUsuario",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Usuario" />,
      cell: ({ row }) => (
        <span className="text-foreground font-mono text-xs font-semibold">
          {row.original.nombreUsuario}
        </span>
      ),
    },
    {
      id: "rol",
      accessorFn: (row) => row.rol.nombre,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Rol" />,
      cell: ({ row }) => {
        const rol = row.original.rol;
        return (
          <Badge variant={rol.esSistema ? "default" : "secondary"} className="text-xs">
            {rol.nombre}
          </Badge>
        );
      },
    },
    {
      accessorKey: "estado",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Estado" />,
      cell: ({ row }) => {
        const estado = row.original.estado;
        const config = USER_STATUS_CONFIG[estado] ?? USER_STATUS_CONFIG.inactivo;

        return (
          <Badge variant={config.variant} className={config.className}>
            {config.label}
          </Badge>
        );
      },
    },
    {
      accessorKey: "ultimoAcceso",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Último Acceso" />,
      cell: ({ row }) => {
        const lastAccess = row.original.ultimoAcceso;
        return (
          <span className="text-muted-foreground text-xs">
            {lastAccess ? formatDate(lastAccess, "dd/MM/yyyy HH:mm") : "Sin ingresos"}
          </span>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <UserActions
          user={row.original}
          currentUserId={currentUserId}
          onChangeRole={onChangeRole}
          onUpdateUsername={onUpdateUsername}
          onPasswordReset={onPasswordReset}
        />
      ),
    },
  ];
}
