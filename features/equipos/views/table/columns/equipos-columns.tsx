"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/common/data-table/data-table-column-header";
import { StatusBadge } from "@/components/common/status-badge";
import { HugeiconsIcon } from "@hugeicons/react";
import { ComputerIcon, FingerPrintIcon } from "@hugeicons/core-free-icons";
import { EquiposActions } from "./equipos-actions";
import { TIPO_EQUIPO_META, PROPOSITO_EQUIPO_META } from "../../../consts";
import { parseUsuariosPermitidos } from "../../../utils";
import type { Equipo } from "../../../types";

interface GetEquiposColumnsOptions {
  onEdit: (equipo: Equipo) => void;
  onAutorizar: (equipo: Equipo) => void;
  onToggleActivo: (equipo: Equipo, activo: boolean) => Promise<void>;
  isToggling?: boolean;
}

export function getEquiposColumns({
  onEdit,
  onAutorizar,
  onToggleActivo,
  isToggling = false,
}: GetEquiposColumnsOptions): ColumnDef<Equipo>[] {
  return [
    {
      accessorKey: "nombre",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Equipo y ubicación" />,
      cell: ({ row }) => {
        const equipo = row.original;
        const isKiosko = equipo.tipo === "kiosko";

        return (
          <div className="flex items-center gap-3">
            <div
              className={`shrink-0 rounded-xl p-2 ${
                isKiosko ? "bg-info/10 text-info" : "bg-warning/10 text-warning"
              }`}
            >
              <HugeiconsIcon icon={isKiosko ? ComputerIcon : FingerPrintIcon} className="h-4 w-4" />
            </div>
            <div>
              <div className="text-foreground text-sm font-semibold">{equipo.nombre}</div>
              <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                <span>{equipo.ubicacion}</span>
                {equipo.numeroSerie && (
                  <>
                    <span>•</span>
                    <span className="text-muted-foreground/80 font-mono text-xs">
                      S/N: {equipo.numeroSerie}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "tipo",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Tipo" />,
      cell: ({ row }) => {
        const tipo = row.original.tipo;
        const meta = TIPO_EQUIPO_META[tipo];
        return (
          <StatusBadge tone={meta?.tone ?? "neutral"} size="sm">
            {meta?.label || tipo}
          </StatusBadge>
        );
      },
    },
    {
      accessorKey: "proposito",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Propósito" />,
      cell: ({ row }) => {
        const proposito = row.original.proposito;
        const meta = PROPOSITO_EQUIPO_META[proposito];
        return (
          <StatusBadge tone={meta?.tone ?? "brand"} size="sm">
            {meta?.label || proposito}
          </StatusBadge>
        );
      },
    },
    {
      accessorKey: "usuariosPermitidos",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Usuarios autorizados" />
      ),
      cell: ({ row }) => {
        const usuarios = parseUsuariosPermitidos(row.original.usuariosPermitidos);
        return (
          <div className="flex flex-wrap gap-1">
            {usuarios.map((u) => (
              <span
                key={u}
                className="bg-muted text-muted-foreground inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium capitalize"
              >
                {u}
              </span>
            ))}
          </div>
        );
      },
    },
    {
      id: "estadoAutorizacion",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Autorización" />,
      cell: ({ row }) => {
        const equipo = row.original;
        const isAutorizado = Boolean(
          equipo.tokenAutorizado || equipo.autorizado || equipo.autorizadoEn,
        );

        return (
          <StatusBadge tone={isAutorizado ? "success" : "warning"} dot size="sm">
            {isAutorizado ? "Autorizado" : "Pendiente"}
          </StatusBadge>
        );
      },
    },
    {
      accessorKey: "activo",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Estado" />,
      cell: ({ row }) => {
        const activo = row.original.activo;
        return (
          <StatusBadge tone={activo ? "success" : "neutral"} dot size="sm">
            {activo ? "Activo" : "Inactivo"}
          </StatusBadge>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <EquiposActions
          equipo={row.original}
          onEdit={onEdit}
          onAutorizar={onAutorizar}
          onToggleActivo={onToggleActivo}
          isToggling={isToggling}
        />
      ),
    },
  ];
}
