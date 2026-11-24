"use client";

import * as React from "react";
import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { HugeiconsIcon } from "@hugeicons/react";
import { UserRemove01Icon } from "@hugeicons/core-free-icons";
import { DataTableColumnHeader } from "@/components/common/data-table/data-table-column-header";
import { StatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import { EstadoSesionBadge, HorasFirmadas } from "../../components/estado-sesion";
import type { SesionPanel } from "../../types";

export interface SesionesHoyColumnsOptions {
  puedeGestionar: boolean;
  puedeGestionarAusencias: boolean;
  onReemplazo: (sesion: SesionPanel) => void;
  onRegistrarAusencia: (sesion: SesionPanel) => void;
  onHorasReales: (sesion: SesionPanel) => void;
}

export function getSesionesHoyColumns({
  puedeGestionar,
  puedeGestionarAusencias,
  onReemplazo,
  onRegistrarAusencia,
  onHorasReales,
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
      id: "planificacion",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Planificación" />,
      cell: ({ row }) => {
        const p = row.original.planificacion;
        if (!p) {
          return (
            <StatusBadge tone="neutral" size="sm">
              Sin planificación
            </StatusBadge>
          );
        }
        return (
          <Link
            href={`/admin/sesiones-hoy/planificacion/${p.id}`}
            className="text-primary text-xs font-medium underline-offset-2 hover:underline"
          >
            Ver sesión planificada
          </Link>
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
            {s.alertaSalida && (
              <span role="alert" className="text-warning-text basis-full text-xs font-medium">
                {s.alertaSalida}
              </span>
            )}
          </div>
        );
      },
    },
    {
      id: "acciones",
      header: "",
      cell: ({ row }) => {
        const s = row.original;
        const habilitarReemplazo = puedeGestionar && !s.horaIngreso;
        const habilitarAusencia = puedeGestionarAusencias && s.horaIngreso === null;

        if (!habilitarReemplazo && !habilitarAusencia && !puedeGestionar) return null;

        return (
          <div className="flex flex-wrap items-center justify-end gap-1.5">
            {habilitarAusencia && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="border-destructive/30 text-destructive hover:bg-destructive/10 min-h-9 gap-1.5"
                onClick={() => onRegistrarAusencia(s)}
                aria-label={`Registrar ausencia docente en sesión de ${s.seccionNombre}`}
              >
                <HugeiconsIcon icon={UserRemove01Icon} className="size-3.5" aria-hidden="true" />
                <span>Registrar ausencia</span>
              </Button>
            )}
            {puedeGestionar && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="min-h-9"
                onClick={() => onHorasReales(s)}
              >
                Horas en aula
              </Button>
            )}
            {habilitarReemplazo && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="min-h-9"
                onClick={() => onReemplazo(s)}
              >
                Reemplazo
              </Button>
            )}
          </div>
        );
      },
    },
  ];
}
