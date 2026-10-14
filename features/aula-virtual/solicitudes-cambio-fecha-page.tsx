"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { FileEditIcon } from "@hugeicons/core-free-icons";
import { PageHeader } from "@/components/common/page-header";
import { StatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import { DataTable, DataTableColumnHeader } from "@/components/common/data-table";
import { formatDate } from "@/lib/formatters/date";
import { ResolverSolicitudModal } from "./components";
import { SOLICITUD_CONFIG } from "./consts";
import { useSolicitudes } from "./hooks";
import type { SolicitudCambio } from "./types";

export function SolicitudesCambioFechaPage() {
  const { data: solicitudes = [], isLoading, isError, refetch } = useSolicitudes();
  const [enResolucion, setEnResolucion] = React.useState<{
    solicitud: SolicitudCambio;
    accion: "aprobar" | "rechazar";
  } | null>(null);

  const columns = React.useMemo<ColumnDef<SolicitudCambio>[]>(
    () => [
      {
        accessorKey: "materialTitulo",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Material" />,
        cell: ({ row }) => (
          <span className="text-foreground text-xs font-medium">{row.original.materialTitulo}</span>
        ),
      },
      {
        id: "curso",
        accessorFn: (row) => `${row.cursoNombre} · ${row.seccionNombre}`,
        header: ({ column }) => <DataTableColumnHeader column={column} title="Curso" />,
        cell: ({ row }) => (
          <span className="text-muted-foreground text-xs">
            {row.original.cursoNombre} · {row.original.seccionNombre}
          </span>
        ),
      },
      {
        accessorKey: "docenteNombre",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Docente" />,
        cell: ({ row }) => (
          <span className="text-foreground text-xs">{row.original.docenteNombre}</span>
        ),
      },
      {
        accessorKey: "fechaAnterior",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Fecha anterior" />,
        cell: ({ row }) => (
          <span className="text-muted-foreground text-xs">
            {formatDate(row.original.fechaAnterior)}
          </span>
        ),
      },
      {
        accessorKey: "fechaSolicitada",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Nueva fecha" />,
        cell: ({ row }) => (
          <span className="text-primary text-xs font-semibold">
            {formatDate(row.original.fechaSolicitada)}
          </span>
        ),
      },
      {
        accessorKey: "motivo",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Motivo" />,
        cell: ({ row }) => (
          <span className="text-muted-foreground block max-w-56 truncate text-xs">
            {row.original.motivo}
          </span>
        ),
      },
      {
        accessorKey: "estado",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Estado" />,
        cell: ({ row }) => {
          const config = SOLICITUD_CONFIG[row.original.estado];
          return (
            <StatusBadge tone={config.tone} className="text-xs">
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
          if (sol.estado !== "solicitada") return null;

          return (
            <div className="flex justify-end gap-1.5">
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="h-7 text-xs"
                onClick={() => setEnResolucion({ solicitud: sol, accion: "rechazar" })}
              >
                Rechazar
              </Button>
              <Button
                type="button"
                size="sm"
                className="h-7 text-xs"
                onClick={() => setEnResolucion({ solicitud: sol, accion: "aprobar" })}
              >
                Aprobar
              </Button>
            </div>
          );
        },
      },
    ],
    [],
  );

  return (
    <div className="animate-in fade-in-50 flex flex-col gap-6 duration-300">
      <PageHeader
        title="Solicitudes de cambio de fecha"
        description="Pedidos de los docentes para mover la fecha de un material congelado."
        icon={FileEditIcon}
        breadcrumbs={[
          { label: "Inicio", href: "/admin/dashboard" },
          { label: "Solicitudes de cambio de fecha" },
        ]}
      />

      <DataTable
        columns={columns}
        data={solicitudes}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => void refetch()}
        pagination={false}
        caption="Solicitudes de cambio de fecha de materiales didácticos"
        emptyState={{
          title: "No hay solicitudes pendientes",
          description: "Las solicitudes de los docentes aparecerán aquí.",
        }}
      />

      <ResolverSolicitudModal
        solicitud={enResolucion?.solicitud ?? null}
        accion={enResolucion?.accion ?? null}
        onOpenChange={(abierto) => !abierto && setEnResolucion(null)}
      />
    </div>
  );
}
