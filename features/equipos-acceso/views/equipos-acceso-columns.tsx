"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/common/data-table/data-table-column-header";
import { TableRowActions } from "@/components/common/row-actions";
import { StatusBadge } from "@/components/common/status-badge";
import { formatDateTime } from "@/lib/formatters";
import { Cancel01Icon, CheckmarkCircle02Icon, Delete02Icon } from "@hugeicons/core-free-icons";
import {
  ESTADO_EQUIPO_ACCESO,
  ESTADO_EQUIPO_ACCESO_META,
  PLATAFORMA_EQUIPO_ACCESO_LABEL,
} from "../consts";
import type { AccionEquipoAcceso, EquipoAcceso } from "../types";

interface Opciones {
  onResolver: (equipo: EquipoAcceso, accion: AccionEquipoAcceso) => void;
}

export function EquipoAccesoActions({
  equipo,
  onResolver,
}: {
  equipo: EquipoAcceso;
  onResolver: Opciones["onResolver"];
}) {
  const { PENDIENTE, AUTORIZADO, RECHAZADO, REVOCADO } = ESTADO_EQUIPO_ACCESO;
  const items = [];

  if (equipo.estado === PENDIENTE || equipo.estado === RECHAZADO || equipo.estado === REVOCADO) {
    items.push({
      label: "Autorizar",
      icon: CheckmarkCircle02Icon,
      onClick: () => onResolver(equipo, "autorizar"),
    });
  }
  if (equipo.estado === PENDIENTE) {
    items.push({
      label: "Rechazar",
      icon: Cancel01Icon,
      variant: "destructive" as const,
      onClick: () => onResolver(equipo, "rechazar"),
    });
  }
  if (equipo.estado === AUTORIZADO) {
    items.push({
      label: "Revocar",
      icon: Delete02Icon,
      variant: "destructive" as const,
      onClick: () => onResolver(equipo, "revocar"),
    });
  }

  return (
    <TableRowActions
      header={{ title: equipo.nombre, subtitle: `Usuario: ${equipo.nombreUsuario}` }}
      items={items}
    />
  );
}

export function getEquiposAccesoColumns({ onResolver }: Opciones): ColumnDef<EquipoAcceso>[] {
  return [
    {
      accessorKey: "nombreUsuario",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Usuario" />,
      cell: ({ row }) => (
        <span className="text-foreground text-sm font-semibold">{row.original.nombreUsuario}</span>
      ),
    },
    {
      accessorKey: "nombre",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Equipo" />,
      cell: ({ row }) => (
        <div>
          <div className="text-foreground text-sm font-medium">{row.original.nombre}</div>
          <div className="text-muted-foreground text-xs">
            {PLATAFORMA_EQUIPO_ACCESO_LABEL[row.original.plataforma] ?? "Otro"}
            {row.original.ip ? ` • ${row.original.ip}` : ""}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "estado",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Estado" />,
      cell: ({ row }) => {
        const meta = ESTADO_EQUIPO_ACCESO_META[row.original.estado];
        return (
          <StatusBadge tone={meta?.tone ?? "neutral"} dot size="sm">
            {meta?.label ?? "Desconocido"}
          </StatusBadge>
        );
      },
    },
    {
      accessorKey: "solicitadoEn",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Solicitado" />,
      cell: ({ row }) => (
        <span className="text-muted-foreground text-xs">
          {formatDateTime(row.original.solicitadoEn)}
        </span>
      ),
    },
    {
      id: "resolucion",
      header: "Resolución",
      cell: ({ row }) => {
        const e = row.original;
        if (!e.resueltoEn) return <span className="text-muted-foreground text-xs">-</span>;
        return (
          <div className="text-xs">
            <div className="text-muted-foreground">
              {e.resueltoPor ?? "-"} • {formatDateTime(e.resueltoEn)}
            </div>
            {e.motivo && <div className="text-muted-foreground/80">{e.motivo}</div>}
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => <EquipoAccesoActions equipo={row.original} onResolver={onResolver} />,
    },
  ];
}
