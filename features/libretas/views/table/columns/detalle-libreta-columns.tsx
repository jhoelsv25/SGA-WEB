"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/common/data-table/data-table-column-header";
import { ETIQUETA_ESTADO, formatearFecha } from "../../../constants";
import type { DetalleLibreta, EstadoLibreta } from "../../../types";
import { DetalleLibretaActions } from "./detalle-libreta-actions";

const VARIANTE_ESTADO: Record<EstadoLibreta, "secondary" | "success" | "warning"> = {
  pendiente: "secondary",
  a_tiempo: "success",
  fuera_de_plazo: "warning",
};

interface OpcionesColumnasDetalle {
  puedeHistorial: boolean;
  onHistorial: (libretaId: string) => void;
}

export function getDetalleLibretaColumns({
  puedeHistorial,
  onHistorial,
}: OpcionesColumnasDetalle): ColumnDef<DetalleLibreta>[] {
  const columnas: ColumnDef<DetalleLibreta>[] = [
    {
      accessorKey: "nombreCompleto",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Estudiante" />,
      cell: ({ row }) => <span className="font-medium">{row.original.nombreCompleto}</span>,
    },
    {
      accessorKey: "codigo",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Código" />,
    },
    {
      accessorKey: "estado",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Estado" />,
      cell: ({ row }) => (
        <Badge variant={VARIANTE_ESTADO[row.original.estado]}>
          {ETIQUETA_ESTADO[row.original.estado]}
        </Badge>
      ),
    },
    {
      accessorKey: "vistoEn",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Vista por la familia" />
      ),
      cell: ({ row }) => (row.original.vistoEn ? formatearFecha(row.original.vistoEn) : "Aún no"),
    },
    {
      accessorKey: "fechaLimite",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Límite" />,
      cell: ({ row }) => formatearFecha(row.original.fechaLimite),
    },
  ];

  if (puedeHistorial) {
    columnas.push({
      id: "actions",
      header: "",
      cell: ({ row }) => <DetalleLibretaActions libreta={row.original} onHistorial={onHistorial} />,
    });
  }

  return columnas;
}
