"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { EyeIcon, FileEditIcon, Image01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { DataTableColumnHeader } from "@/components/common/data-table/data-table-column-header";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/formatters/date";
import { ETIQUETAS_MOTIVO_AUSENCIA } from "../../consts";
import type { AusenciaResponseDto } from "../../types";
import { esDescargoPermitido, formatearMinutos } from "../../utils";
import { EstadoAusenciaBadge } from "./estado-ausencia-badge";

export interface GetMisAusenciasColumnsOptions {
  onVerDetalle: (ausencia: AusenciaResponseDto) => void;
  onAbrirDescargo: (ausencia: AusenciaResponseDto) => void;
}

export function getMisAusenciasColumns({
  onVerDetalle,
  onAbrirDescargo,
}: GetMisAusenciasColumnsOptions): ColumnDef<AusenciaResponseDto>[] {
  return [
    {
      id: "fechaHorario",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Fecha y horario" />,
      cell: ({ row }) => {
        const ausencia = row.original;
        const fechaSesion = formatDate(ausencia.sesion.fecha, "dd/MM/yyyy");
        return (
          <div className="font-mono text-xs">
            <span className="text-foreground font-semibold">{fechaSesion}</span>
            <br />
            <span className="text-muted-foreground">
              {ausencia.sesion.horaInicio}–{ausencia.sesion.horaFin}
            </span>
          </div>
        );
      },
    },
    {
      id: "cursoSeccion",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Curso y sección" />,
      cell: ({ row }) => {
        const s = row.original.sesion;
        return (
          <div>
            <p className="text-foreground text-xs font-semibold">{s.cursoNombre}</p>
            <p className="text-muted-foreground text-[11px]">{s.seccionNombre}</p>
          </div>
        );
      },
    },
    {
      id: "tramoAusente",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Tramo ausente" />,
      cell: ({ row }) => {
        const a = row.original;
        return (
          <div>
            <span className="text-foreground font-mono text-xs font-bold">
              {a.horaDesde}–{a.horaHasta}
            </span>
            <p className="text-muted-foreground text-xs font-semibold">
              {formatearMinutos(a.minutos)}
            </p>
          </div>
        );
      },
    },
    {
      id: "motivoObservacion",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Motivo / Observación" />
      ),
      cell: ({ row }) => {
        const a = row.original;
        const etiquetaMotivo = ETIQUETAS_MOTIVO_AUSENCIA[a.motivo] || a.motivo;
        return (
          <div className="max-w-56">
            <p className="text-foreground text-xs font-semibold">{etiquetaMotivo}</p>
            {a.observacion ? (
              <p className="text-muted-foreground line-clamp-2 text-xs italic">{a.observacion}</p>
            ) : (
              <span className="text-muted-foreground/60 text-xs">—</span>
            )}
          </div>
        );
      },
    },
    {
      id: "fotos",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Fotos" className="justify-center" />
      ),
      cell: ({ row }) => {
        const count = row.original.fotos.length;
        if (count === 0) {
          return <span className="text-muted-foreground/60 block text-center text-xs">—</span>;
        }
        return (
          <div className="flex justify-center">
            <span className="border-border/70 bg-muted/40 text-foreground inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium">
              <HugeiconsIcon icon={Image01Icon} className="size-3" />
              <span>{count}</span>
            </span>
          </div>
        );
      },
    },
    {
      id: "estado",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Estado / Descargo"
          className="justify-center"
        />
      ),
      cell: ({ row }) => (
        <div className="flex justify-center">
          <EstadoAusenciaBadge ausencia={row.original} />
        </div>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const ausencia = row.original;
        const puedeDescargar = esDescargoPermitido(ausencia);
        return (
          <div className="flex flex-wrap items-center justify-end gap-1.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onVerDetalle(ausencia)}
              className="h-9 min-h-9 gap-1 rounded-full px-3 text-xs font-medium"
              aria-label={`Ver detalle de la ausencia de ${ausencia.sesion.cursoNombre}`}
            >
              <HugeiconsIcon icon={EyeIcon} className="size-3.5" />
              <span>Detalle</span>
            </Button>
            {!ausencia.anulada && ausencia.descargo === null && puedeDescargar && (
              <Button
                type="button"
                size="sm"
                onClick={() => onAbrirDescargo(ausencia)}
                className="h-9 min-h-9 gap-1 rounded-full px-3 text-xs font-semibold"
                aria-label={`Presentar descargo para la sesión de ${ausencia.sesion.cursoNombre}`}
              >
                <HugeiconsIcon icon={FileEditIcon} className="size-3.5" />
                <span>Descargo</span>
              </Button>
            )}
          </div>
        );
      },
    },
  ];
}
