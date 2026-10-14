"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Attachment01Icon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
  EyeIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { DataTableColumnHeader } from "@/components/common/data-table";
import { StatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/formatters/date";
import type { SolicitudRevisionResponseDto } from "../../types";
import { VARIANTES_ESTADO_SOLICITUD } from "../../utils";

export interface GetSolicitudesColumnasParams {
  onVerDetalle: (solicitud: SolicitudRevisionResponseDto) => void;
  onAceptar: (solicitud: SolicitudRevisionResponseDto) => void;
  onRechazar: (solicitud: SolicitudRevisionResponseDto) => void;
}

/**
 * Definición pura de columnas para TanStack Table en la bandeja directiva de solicitudes.
 */
export function getSolicitudesColumnas({
  onVerDetalle,
  onAceptar,
  onRechazar,
}: GetSolicitudesColumnasParams): ColumnDef<SolicitudRevisionResponseDto>[] {
  return [
    {
      accessorKey: "docenteNombre",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Docente" />,
      cell: ({ row }) => {
        const sol = row.original;
        return (
          <div className="flex flex-col">
            <span className="text-foreground text-xs font-semibold">{sol.docenteNombre}</span>
            <span className="text-muted-foreground text-2xs font-mono">
              DNI: {sol.docenteDocumento}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "periodoNombre",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Bimestre" />,
      cell: ({ row }) => (
        <span className="text-foreground text-xs font-medium">{row.original.periodoNombre}</span>
      ),
    },
    {
      accessorKey: "creadoEn",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Fecha de solicitud" />,
      cell: ({ row }) => (
        <span className="text-muted-foreground font-mono text-xs">
          {formatDate(row.original.creadoEn)}
        </span>
      ),
    },
    {
      accessorKey: "motivo",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Motivo" />,
      cell: ({ row }) => (
        <span
          className="text-muted-foreground block max-w-64 truncate text-xs"
          title={row.original.motivo}
        >
          {row.original.motivo}
        </span>
      ),
    },
    {
      id: "adjunto",
      header: () => <div className="text-center">Adjunto</div>,
      cell: ({ row }) => {
        const sol = row.original;
        if (!sol.adjuntoUrl) {
          return <span className="text-muted-foreground block text-center text-xs">–</span>;
        }
        return (
          <div className="flex justify-center" title={sol.adjuntoNombre || "Archivo adjunto"}>
            <span className="border-primary/25 bg-primary/10 text-primary flex size-6 items-center justify-center rounded-md border">
              <HugeiconsIcon icon={Attachment01Icon} className="size-3.5" />
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "estado",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Estado" />,
      cell: ({ row }) => {
        const config = VARIANTES_ESTADO_SOLICITUD[row.original.estado];
        return (
          <StatusBadge tone={config.tone} dot size="sm">
            {config.label}
          </StatusBadge>
        );
      },
    },
    {
      id: "acciones",
      header: () => <div className="text-right">Acciones</div>,
      cell: ({ row }) => {
        const sol = row.original;
        const estaPendiente = sol.estado === "solicitada";

        return (
          <div className="flex items-center justify-end gap-1.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onVerDetalle(sol)}
              className="h-7.5 gap-1 px-2.5 text-xs font-medium"
            >
              <HugeiconsIcon icon={EyeIcon} className="size-3.5" />
              <span>Ver</span>
            </Button>

            {estaPendiente && (
              <>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onRechazar(sol)}
                  className="text-destructive hover:bg-destructive/10 h-7.5 gap-1 px-2.5 text-xs font-semibold"
                >
                  <HugeiconsIcon icon={Cancel01Icon} className="size-3.5" />
                  <span>Rechazar</span>
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => onAceptar(sol)}
                  className="h-7.5 gap-1 px-2.5 text-xs font-semibold shadow-2xs"
                >
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-3.5" />
                  <span>Aceptar</span>
                </Button>
              </>
            )}
          </div>
        );
      },
    },
  ];
}
