"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Camera01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { DataTableColumnHeader } from "@/components/common/data-table/data-table-column-header";
import { StatusBadge } from "@/components/common/status-badge";
import { Badge } from "@/components/ui/badge";
import { ETIQUETAS_MOTIVO_AUSENCIA } from "../../consts";
import type { AusenciaResponseDto } from "../../types";
import { formatearFechaLimite, formatearMinutos } from "../../utils";
import { AusenciaFilaAcciones } from "../../components/supervision/ausencia-fila-acciones";

export interface GetAusenciasColumnasProps {
  usuarioActualId?: string;
  onVerDetalle: (ausencia: AusenciaResponseDto) => void;
  onVerHistorial: (ausencia: AusenciaResponseDto) => void;
  onCorregir: (ausencia: AusenciaResponseDto) => void;
  onAnular: (ausencia: AusenciaResponseDto) => void;
}

/**
 * Genera la definición tipada de columnas para la tabla de supervisión de ausencias (RF-012 HU4).
 */
export function getAusenciasColumnas({
  usuarioActualId,
  onVerDetalle,
  onVerHistorial,
  onCorregir,
  onAnular,
}: GetAusenciasColumnasProps): ColumnDef<AusenciaResponseDto>[] {
  return [
    {
      id: "fecha",
      accessorFn: (row) => row.sesion.fecha,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Fecha" />,
      cell: ({ row }) => (
        <span className="text-foreground font-medium">
          {formatearFechaLimite(row.original.sesion.fecha)}
        </span>
      ),
    },
    {
      id: "docente",
      accessorFn: (row) => row.sesion.docenteNombre,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Docente" />,
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="text-foreground font-semibold">{row.original.sesion.docenteNombre}</span>
          <span className="text-2xs text-muted-foreground">
            Registrado por: {row.original.registradoPor.nombreCompleto}
          </span>
        </div>
      ),
    },
    {
      id: "cursoSeccion",
      accessorFn: (row) => `${row.sesion.cursoNombre} ${row.sesion.seccionNombre}`,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Curso y Sección" />,
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="text-foreground text-xs font-semibold sm:text-sm">
            {row.original.sesion.cursoNombre}
          </span>
          <span className="text-muted-foreground text-xs">{row.original.sesion.seccionNombre}</span>
        </div>
      ),
    },
    {
      id: "tramo",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Tramo Ausente" />,
      cell: ({ row }) => {
        const a = row.original;
        return (
          <div className="flex flex-col">
            <span className="text-foreground font-mono text-xs font-bold">
              {a.horaDesde} - {a.horaHasta}
            </span>
            <span className="text-muted-foreground text-xs font-semibold">
              {formatearMinutos(a.minutos)}
            </span>
          </div>
        );
      },
    },
    {
      id: "motivo",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Motivo" />,
      cell: ({ row }) => {
        const a = row.original;
        const etiqueta = ETIQUETAS_MOTIVO_AUSENCIA[a.motivo] || a.motivo;
        return (
          <div className="flex max-w-[200px] flex-col">
            <span className="text-foreground text-xs font-medium">{etiqueta}</span>
            {a.observacion && (
              <span
                className="text-muted-foreground line-clamp-1 text-xs italic"
                title={a.observacion}
              >
                {a.observacion}
              </span>
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
        const total = row.original.fotos.length;
        if (total === 0)
          return <span className="text-muted-foreground block text-center text-xs">—</span>;
        return (
          <div className="flex justify-center">
            <Badge variant="secondary" className="gap-1 text-xs font-normal">
              <HugeiconsIcon icon={Camera01Icon} className="size-3" />
              <span>{total}</span>
            </Badge>
          </div>
        );
      },
    },
    {
      id: "estado",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Estado" className="justify-center" />
      ),
      cell: ({ row }) => {
        const a = row.original;
        if (a.anulada) {
          return (
            <div className="flex justify-center">
              <StatusBadge tone="danger">Anulada</StatusBadge>
            </div>
          );
        }
        if (a.descargo) {
          return (
            <div className="flex justify-center">
              <StatusBadge tone="info">Con descargo</StatusBadge>
            </div>
          );
        }
        return (
          <div className="flex justify-center">
            <StatusBadge tone="warning">Pendiente</StatusBadge>
          </div>
        );
      },
    },
    {
      id: "version",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Versión" className="justify-center" />
      ),
      cell: ({ row }) => (
        <div className="flex justify-center">
          <Badge variant="outline" className="text-2xs font-mono">
            v{row.original.version}
          </Badge>
        </div>
      ),
    },
    {
      id: "acciones",
      header: "",
      cell: ({ row }) => (
        <AusenciaFilaAcciones
          ausencia={row.original}
          usuarioActualId={usuarioActualId}
          onVerDetalle={onVerDetalle}
          onVerHistorial={onVerHistorial}
          onCorregir={onCorregir}
          onAnular={onAnular}
        />
      ),
    },
  ];
}
