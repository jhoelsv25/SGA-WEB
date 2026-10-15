"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/common/data-table/data-table-column-header";
import { StatusBadge } from "@/components/common/status-badge";
import { Badge } from "@/components/ui/badge";
import type { ConsolidadoResumenDto } from "../../types";
import { formatearTiempoMinutos, obtenerEtiquetaDecision, VARIANTES_DECISION } from "../../utils";
import { ConsolidadoFilaAcciones } from "./consolidado-fila-acciones";

export interface GetConsolidadoColumnasProps {
  puedeGestionar: boolean;
  onVerDetalle: (consolidado: ConsolidadoResumenDto) => void;
  onVerHistorial: (consolidado: ConsolidadoResumenDto) => void;
  onDescargarFicha: (consolidado: ConsolidadoResumenDto) => void;
  onReabrir?: (consolidado: ConsolidadoResumenDto) => void;
  onCerrar?: (consolidado: ConsolidadoResumenDto) => void;
  onRegistrarDecision?: (consolidado: ConsolidadoResumenDto) => void;
  onGenerarUno?: (consolidado: ConsolidadoResumenDto) => void;
}

/**
 * Definición tipada de columnas para la tabla del consolidado del bimestre (RF-013 HU4).
 * Permite ordenamiento determinista en todas las columnas mediante TanStack Table.
 */
export function getConsolidadoColumnas({
  puedeGestionar,
  onVerDetalle,
  onVerHistorial,
  onDescargarFicha,
  onReabrir,
  onCerrar,
  onRegistrarDecision,
  onGenerarUno,
}: GetConsolidadoColumnasProps): ColumnDef<ConsolidadoResumenDto>[] {
  return [
    {
      id: "docente",
      accessorFn: (row) => row.docenteNombre,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Docente" />,
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="text-foreground font-semibold">{row.original.docenteNombre}</span>
          <span className="text-2xs text-muted-foreground font-mono">
            Doc: {row.original.docenteDocumento}
          </span>
        </div>
      ),
    },
    {
      id: "sesionesProgramadas",
      accessorFn: (row) => row.sesionesProgramadas,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Prog." />,
      cell: ({ row }) => (
        <span className="text-foreground font-mono text-xs">
          {row.original.sesionesProgramadas}
        </span>
      ),
    },
    {
      id: "sesionesCumplidas",
      accessorFn: (row) => row.sesionesCumplidas,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Cump." />,
      cell: ({ row }) => (
        <span className="text-foreground font-mono text-xs font-medium">
          {row.original.sesionesCumplidas}
        </span>
      ),
    },
    {
      id: "sesionesParciales",
      accessorFn: (row) => row.sesionesParciales,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Parc." />,
      cell: ({ row }) => (
        <span className="text-muted-foreground font-mono text-xs">
          {row.original.sesionesParciales}
        </span>
      ),
    },
    {
      id: "sesionesNoCumplidas",
      accessorFn: (row) => row.sesionesNoCumplidas,
      header: ({ column }) => <DataTableColumnHeader column={column} title="No cump." />,
      cell: ({ row }) => {
        const cant = row.original.sesionesNoCumplidas;
        return (
          <span
            className={`font-mono text-xs ${
              cant > 0 ? "text-destructive font-bold" : "text-muted-foreground"
            }`}
          >
            {cant}
          </span>
        );
      },
    },
    {
      id: "sesionesJustificadas",
      accessorFn: (row) => row.sesionesJustificadas,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Just." />,
      cell: ({ row }) => (
        <span className="text-muted-foreground font-mono text-xs">
          {row.original.sesionesJustificadas}
        </span>
      ),
    },
    {
      id: "totalAusencias",
      accessorFn: (row) => row.totalAusencias,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Ausencias" />,
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="text-foreground font-mono text-xs font-semibold">
            {row.original.totalAusencias}
          </span>
          <span className="text-2xs text-muted-foreground">
            {formatearTiempoMinutos(row.original.minutosFueraAula)}
          </span>
        </div>
      ),
    },
    {
      id: "totalMinutosFueraClase",
      accessorFn: (row) => row.totalMinutosFueraClase,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Fuera de clase" />,
      cell: ({ row }) => (
        <Badge
          variant="secondary"
          className="border-primary/20 bg-primary/10 text-primary font-mono text-xs font-bold"
        >
          {row.original.tiempoFueraClaseTexto}
        </Badge>
      ),
    },
    {
      id: "version",
      accessorFn: (row) => row.version,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Versión" />,
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          <Badge variant="outline" className="text-2xs font-mono">
            v{row.original.version}
          </Badge>
        </div>
      ),
    },
    {
      id: "estado",
      accessorFn: (row) => row.estado,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Estado" />,
      cell: ({ row }) => {
        const esCerrado = row.original.estado === "cerrado";
        return (
          <StatusBadge tone={esCerrado ? "neutral" : "warning"} dot size="sm">
            {esCerrado ? "Cerrado" : "Reabierto"}
          </StatusBadge>
        );
      },
    },
    {
      id: "decision",
      accessorFn: (row) => row.decision,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Decisión" />,
      cell: ({ row }) => {
        const info = VARIANTES_DECISION[row.original.decision];
        const etiqueta = obtenerEtiquetaDecision(row.original.decision);
        return (
          <StatusBadge tone={info?.tone ?? "neutral"} size="sm">
            {etiqueta}
          </StatusBadge>
        );
      },
    },
    {
      id: "acciones",
      header: "",
      cell: ({ row }) => (
        <ConsolidadoFilaAcciones
          consolidado={row.original}
          puedeGestionar={puedeGestionar}
          onVerDetalle={onVerDetalle}
          onVerHistorial={onVerHistorial}
          onDescargarFicha={onDescargarFicha}
          onReabrir={onReabrir}
          onCerrar={onCerrar}
          onRegistrarDecision={onRegistrarDecision}
          onGenerarUno={onGenerarUno}
        />
      ),
    },
  ];
}
