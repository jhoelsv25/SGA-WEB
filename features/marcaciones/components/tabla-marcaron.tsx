"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/common/data-table";
import { DataTableColumnHeader } from "@/components/common/data-table/data-table-column-header";
import { StatusBadge } from "@/components/common/status-badge";
import { UserAvatar } from "@/components/common/user-avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Clock01Icon,
  Login01Icon,
  Logout01Icon,
  FingerPrintIcon,
  ComputerIcon,
  FileEditIcon,
} from "@hugeicons/core-free-icons";
import { RESULTADOS_MARCACION_CONFIG, TIPOS_MARCACION_LABEL } from "../consts";
import type { MarcacionApi } from "../types";

export interface TablaMarcaronProps {
  marcaciones: MarcacionApi[];
  puedeJustificar: boolean;
  onJustificar: (marcacion: MarcacionApi) => void;
}

const horaDe = (fechaHora: string): string => fechaHora.slice(11, 16);

function esJustificable(m: MarcacionApi): boolean {
  return !m.justificada && (m.resultado === "tardanza" || m.resultado === "salida_anticipada");
}

function iconoOrigen(origen: string) {
  switch (origen) {
    case "biometrico":
      return FingerPrintIcon;
    case "kiosko":
      return ComputerIcon;
    default:
      return FileEditIcon;
  }
}

export function TablaMarcaron({ marcaciones, puedeJustificar, onJustificar }: TablaMarcaronProps) {
  const columns = React.useMemo<ColumnDef<MarcacionApi>[]>(() => {
    return [
      {
        accessorKey: "fechaHora",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Hora" className="w-24" />
        ),
        cell: ({ row }) => (
          <div className="text-foreground flex items-center gap-1.5 font-mono text-xs font-bold">
            <HugeiconsIcon icon={Clock01Icon} className="text-muted-foreground/70 size-3.5" />
            <span>{horaDe(row.original.fechaHora)}</span>
          </div>
        ),
      },
      {
        accessorKey: "nombreCompleto",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Persona" />,
        cell: ({ row }) => (
          <div className="flex items-center gap-2.5">
            <UserAvatar name={row.original.nombreCompleto} className="size-7 text-[11px]" />
            <span className="text-foreground text-xs font-semibold">
              {row.original.nombreCompleto}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "tipo",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Tipo de marca" />,
        cell: ({ row }) => {
          const m = row.original;
          const esEntrada = m.tipo === "entrada";
          const IconOrigen = iconoOrigen(m.origen);
          return (
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <Badge
                variant="outline"
                className={`gap-1 px-2 py-0.5 text-[11px] font-semibold ${
                  esEntrada
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                    : "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300"
                }`}
              >
                <HugeiconsIcon icon={esEntrada ? Login01Icon : Logout01Icon} className="size-3" />
                <span>{TIPOS_MARCACION_LABEL[m.tipo]}</span>
              </Badge>
              <Badge
                variant="secondary"
                className="text-muted-foreground gap-1 px-1.5 py-0 text-[10px] capitalize"
              >
                <HugeiconsIcon icon={IconOrigen} className="size-2.5" />
                <span>{m.origen}</span>
              </Badge>
            </div>
          );
        },
      },
      {
        accessorKey: "resultado",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Resultado" />,
        cell: ({ row }) => {
          const m = row.original;
          const resultado = RESULTADOS_MARCACION_CONFIG[m.resultado];
          return (
            <div className="flex flex-wrap items-center gap-1.5">
              <StatusBadge tone={resultado.tone} dot size="sm">
                {resultado.label}
                {m.minutosTardanza > 0 && ` (+${m.minutosTardanza} min)`}
              </StatusBadge>
              {m.justificada && (
                <StatusBadge tone="info" size="sm">
                  Justificada
                </StatusBadge>
              )}
            </div>
          );
        },
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => {
          const m = row.original;
          if (!puedeJustificar || !esJustificable(m)) return null;
          return (
            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="hover:border-primary hover:text-primary h-7 rounded-lg px-2.5 text-xs font-semibold shadow-2xs"
                onClick={() => onJustificar(m)}
              >
                Justificar
              </Button>
            </div>
          );
        },
      },
    ];
  }, [puedeJustificar, onJustificar]);

  return (
    <div className="border-border/80 bg-card overflow-hidden rounded-2xl border shadow-xs">
      <DataTable
        columns={columns}
        data={marcaciones}
        searchKey="nombreCompleto"
        searchPlaceholder="Filtrar marcaciones registradas..."
      />
    </div>
  );
}
