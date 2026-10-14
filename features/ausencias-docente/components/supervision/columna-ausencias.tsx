"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Camera01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { DataTableColumnHeader } from "@/components/common/data-table/data-table-column-header";
import { StatusBadge } from "@/components/common/status-badge";
import { Badge } from "@/components/ui/badge";
import { ETIQUETAS_MOTIVO_AUSENCIA } from "@/features/ausencias-docente/consts";
import type { AusenciaResponseDto } from "@/features/ausencias-docente/types";
import { formatearFechaLimite, formatearMinutos } from "@/features/ausencias-docente/utils";
import { AusenciaFilaAcciones } from "./ausencia-fila-acciones";

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
          <span className="text-foreground">{row.original.sesion.cursoNombre}</span>
          <span className="text-2xs text-muted-foreground">
            Sección {row.original.sesion.seccionNombre}
          </span>
        </div>
      ),
    },
    {
      id: "tramo",
      accessorFn: (row) => `${row.horaDesde} - ${row.horaHasta}`,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Tramo" />,
      cell: ({ row }) => (
        <span className="text-foreground font-mono text-xs">
          {row.original.horaDesde} – {row.original.horaHasta}
        </span>
      ),
    },
    {
      id: "minutos",
      accessorFn: (row) => row.minutos,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Minutos" />,
      cell: ({ row }) => (
        <Badge
          variant="secondary"
          className={`font-mono text-xs ${
            row.original.anulada ? "text-muted-foreground line-through opacity-60" : ""
          }`}
        >
          {formatearMinutos(row.original.minutos)}
        </Badge>
      ),
    },
    {
      id: "motivo",
      accessorFn: (row) => row.motivo,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Motivo" />,
      cell: ({ row }) => {
        const etiqueta = ETIQUETAS_MOTIVO_AUSENCIA[row.original.motivo] ?? row.original.motivo;
        return (
          <div className="flex flex-col">
            <span className="text-foreground font-medium">{etiqueta}</span>
            {row.original.observacion && (
              <span
                className="text-2xs text-muted-foreground max-w-48 truncate"
                title={row.original.observacion}
              >
                {row.original.observacion}
              </span>
            )}
          </div>
        );
      },
    },
    {
      id: "evidencias",
      header: "Fotos",
      cell: ({ row }) => {
        const cantidadFotos = row.original.fotos?.length ?? 0;
        if (cantidadFotos === 0) {
          return <span className="text-muted-foreground text-xs">-</span>;
        }
        return (
          <Badge variant="outline" className="text-2xs gap-1 px-1.5 py-0.5">
            <HugeiconsIcon icon={Camera01Icon} className="size-3" />
            <span>{cantidadFotos}</span>
          </Badge>
        );
      },
    },
    {
      id: "descargo",
      header: "Descargo",
      cell: ({ row }) => {
        if (row.original.descargo) {
          return (
            <StatusBadge tone="success" size="sm">
              Con descargo
            </StatusBadge>
          );
        }
        if (row.original.puedeDescargar) {
          return (
            <StatusBadge tone="warning" size="sm">
              Pendiente
            </StatusBadge>
          );
        }
        return (
          <StatusBadge tone="neutral" size="sm">
            Sin descargo
          </StatusBadge>
        );
      },
    },
    {
      id: "estado",
      accessorFn: (row) => (row.anulada ? "Anulada" : row.vigente ? "Vigente" : "Anterior"),
      header: ({ column }) => <DataTableColumnHeader column={column} title="Estado" />,
      cell: ({ row }) => {
        if (row.original.anulada) {
          return (
            <StatusBadge tone="danger" dot size="sm">
              Anulada
            </StatusBadge>
          );
        }
        if (row.original.vigente) {
          return (
            <StatusBadge tone="success" dot size="sm">
              Vigente
            </StatusBadge>
          );
        }
        return (
          <StatusBadge tone="neutral" dot size="sm">
            Anterior
          </StatusBadge>
        );
      },
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
