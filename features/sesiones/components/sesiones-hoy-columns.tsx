"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { HugeiconsIcon } from "@hugeicons/react";
import { UserRemove01Icon } from "@hugeicons/core-free-icons";
import { DataTableColumnHeader } from "@/components/common/data-table/data-table-column-header";
import { StatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import { EstadoSesionBadge, HorasFirmadas } from "./estado-sesion";
import type { SesionPanel } from "../types";

export interface SesionesHoyColumnsOptions {
  puedeGestionar: boolean;
  puedeGestionarAusencias: boolean;
  onReemplazo: (sesion: SesionPanel) => void;
  onRegistrarAusencia: (sesion: SesionPanel) => void;
}

export function getSesionesHoyColumns({
  puedeGestionar,
  puedeGestionarAusencias,
  onReemplazo,
  onRegistrarAusencia,
}: SesionesHoyColumnsOptions): ColumnDef<SesionPanel>[] {
  return [
    {
      id: "bloque",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Bloque" />,
      cell: ({ row }) => {
        const s = row.original;
        return (
          <div className="font-mono text-xs">
            <span
              className={s.alerta ? "text-destructive font-bold" : "text-foreground font-semibold"}
            >
              {s.horaInicio}–{s.horaFin}
            </span>
          </div>
        );
      },
    },
    {
      id: "seccionCurso",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Sección y curso" />,
      cell: ({ row }) => {
        const s = row.original;
        return (
          <div>
            <p className="text-foreground text-xs font-medium sm:text-sm">{s.seccionNombre}</p>
            <p className="text-muted-foreground text-xs">{s.cursoNombre}</p>
          </div>
        );
      },
    },
    {
      id: "docente",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Docente" />,
      cell: ({ row }) => {
        const s = row.original;
        return (
          <div>
            <p className="text-foreground text-xs font-medium sm:text-sm">{s.docenteNombre}</p>
            {s.docenteTitularNombre && (
              <p className="text-muted-foreground text-xs">Reemplaza a {s.docenteTitularNombre}</p>
            )}
          </div>
        );
      },
    },
    {
      id: "tema",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Tema" />,
      cell: ({ row }) => {
        const s = row.original;
        return (
          <span className="text-foreground line-clamp-2 max-w-56 text-xs sm:text-sm">
            {s.tema ?? "—"}
          </span>
        );
      },
    },
    {
      id: "firmas",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Firmas" />,
      cell: ({ row }) => <HorasFirmadas sesion={row.original} />,
    },
    {
      id: "estado",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Estado" />,
      cell: ({ row }) => {
        const s = row.original;
        return (
          <div className="flex flex-wrap items-center gap-1.5">
            <EstadoSesionBadge sesion={s} />
            {s.alerta && (
              <StatusBadge tone="danger" size="sm">
                Sin firma
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
        const s = row.original;
        return (
          <div className="flex flex-wrap items-center justify-end gap-1.5">
            {puedeGestionar && s.estado === "pendiente" && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-9 min-h-9"
                onClick={() => onReemplazo(s)}
              >
                Reemplazo
              </Button>
            )}
            {puedeGestionarAusencias && (Boolean(s.horaIngreso) || s.estado === "en_curso") && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-9 min-h-9 gap-1.5"
                onClick={() => onRegistrarAusencia(s)}
              >
                <HugeiconsIcon icon={UserRemove01Icon} className="size-3.5" aria-hidden="true" />
                <span>Registrar ausencia</span>
              </Button>
            )}
          </div>
        );
      },
    },
  ];
}
