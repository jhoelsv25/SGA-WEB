"use client";

import * as React from "react";
import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/common/data-table/data-table-column-header";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/formatters/date";
import { EstadoSesionBadge, HorasFirmadas } from "./estado-sesion";
import type { Sesion } from "../types";

export interface MisSesionesColumnsOptions {
  onCorregirTema: (sesion: Sesion) => void;
  onSolicitarJustificacion: (sesion: Sesion) => void;
}

export function getMisSesionesColumns({
  onCorregirTema,
  onSolicitarJustificacion,
}: MisSesionesColumnsOptions): ColumnDef<Sesion>[] {
  return [
    {
      id: "fechaHorario",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Fecha" />,
      cell: ({ row }) => {
        const s = row.original;
        const fecha = formatDate(s.fecha, "dd/MM/yyyy");
        return (
          <div className="font-mono text-xs">
            <span className="text-foreground font-semibold">{fecha}</span>
            <br />
            <span className="text-muted-foreground">
              {s.horaInicio}–{s.horaFin}
            </span>
          </div>
        );
      },
    },
    {
      id: "cursoSeccion",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Curso y sección" />,
      cell: ({ row }) => {
        const s = row.original;
        return (
          <div>
            <p className="text-foreground text-xs font-medium sm:text-sm">{s.cursoNombre}</p>
            <p className="text-muted-foreground text-xs">{s.seccionNombre}</p>
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
          <div>
            <EstadoSesionBadge sesion={s} />
            {s.justificacion?.estado === "rechazada" && s.justificacion.comentario && (
              <p className="text-muted-foreground mt-1 text-xs">
                Rechazo: {s.justificacion.comentario}
              </p>
            )}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const sesion = row.original;
        const puedeJustificar =
          sesion.estado === "no_cumplida" && sesion.justificacion?.estado !== "solicitada";
        const conAsistencia = ["en_curso", "cumplida", "parcial"].includes(sesion.estado);

        return (
          <div className="flex flex-wrap items-center justify-end gap-1.5">
            {conAsistencia && (
              <Button asChild variant="outline" size="sm" className="h-9 min-h-9">
                <Link href={`/admin/asistencia?sesionId=${sesion.id}`}>Asistencia</Link>
              </Button>
            )}
            {(sesion.estado === "pendiente" || sesion.estado === "en_curso") && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-9 min-h-9"
                onClick={() => onCorregirTema(sesion)}
              >
                Tema
              </Button>
            )}
            {puedeJustificar && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-9 min-h-9"
                onClick={() => onSolicitarJustificacion(sesion)}
              >
                Justificar
              </Button>
            )}
          </div>
        );
      },
    },
  ];
}
