"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/common/data-table/data-table-column-header";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ComputerIcon,
  FingerPrintIcon,
  CheckmarkCircle02Icon,
  Alert02Icon,
} from "@hugeicons/core-free-icons";
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
      header: ({ column }) => <DataTableColumnHeader column={column} title="Equipo y Ubicación" />,
      cell: ({ row }) => {
        const equipo = row.original;
        const isKiosko = equipo.tipo === "kiosko";

        return (
          <div className="flex items-center gap-3">
            <div
              className={`shrink-0 rounded-xl p-2 ${
                isKiosko
                  ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                  : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
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
                    <span className="text-muted-foreground/80 font-mono text-[11px]">
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
          <Badge variant="outline" className={meta?.badgeClass}>
            {meta?.label || tipo}
          </Badge>
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
          <Badge variant="outline" className={meta?.badgeClass}>
            {meta?.label || proposito}
          </Badge>
        );
      },
    },
    {
      accessorKey: "usuariosPermitidos",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Usuarios Autorizados" />
      ),
      cell: ({ row }) => {
        const usuarios = parseUsuariosPermitidos(row.original.usuariosPermitidos);
        return (
          <div className="flex flex-wrap gap-1">
            {usuarios.map((u) => (
              <span
                key={u}
                className="bg-muted text-muted-foreground inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium capitalize"
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

        return isAutorizado ? (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <HugeiconsIcon icon={CheckmarkCircle02Icon} className="h-4 w-4" />
            <span>Autorizado</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-xs font-medium text-amber-600 dark:text-amber-400">
            <HugeiconsIcon icon={Alert02Icon} className="h-4 w-4" />
            <span>Pendiente</span>
          </div>
        );
      },
    },
    {
      accessorKey: "activo",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Estado" />,
      cell: ({ row }) => {
        const activo = row.original.activo;
        return (
          <Badge
            variant={activo ? "default" : "secondary"}
            className={
              activo
                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                : "text-muted-foreground"
            }
          >
            {activo ? "Activo" : "Inactivo"}
          </Badge>
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
