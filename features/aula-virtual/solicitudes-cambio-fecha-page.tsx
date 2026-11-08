"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AlertCircleIcon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  FileEditIcon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import { PageHeader } from "@/components/common/page-header";
import { StatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

  // Filtros reactivos
  const [busqueda, setBusqueda] = React.useState("");
  const [filtroEstado, setFiltroEstado] = React.useState<
    "todas" | "solicitada" | "aprobada" | "rechazada"
  >("todas");

  // Métricas ejecutivas
  const metricas = React.useMemo(() => {
    const pendientes = solicitudes.filter((s) => s.estado === "solicitada").length;
    const aprobadas = solicitudes.filter((s) => s.estado === "aprobada").length;
    const rechazadas = solicitudes.filter((s) => s.estado === "rechazada").length;
    return { total: solicitudes.length, pendientes, aprobadas, rechazadas };
  }, [solicitudes]);

  // Solicitudes filtradas
  const solicitudesFiltradas = React.useMemo(() => {
    return solicitudes.filter((s) => {
      const matchEstado = filtroEstado === "todas" ? true : s.estado === filtroEstado;
      const matchBusqueda =
        !busqueda ||
        s.materialTitulo.toLowerCase().includes(busqueda.toLowerCase()) ||
        s.docenteNombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        s.cursoNombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        s.motivo.toLowerCase().includes(busqueda.toLowerCase());

      return matchEstado && matchBusqueda;
    });
  }, [solicitudes, filtroEstado, busqueda]);

  const columns = React.useMemo<ColumnDef<SolicitudCambio>[]>(
    () => [
      {
        accessorKey: "materialTitulo",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Material" />,
        cell: ({ row }) => (
          <span className="text-foreground text-xs font-semibold">
            {row.original.materialTitulo}
          </span>
        ),
      },
      {
        id: "curso",
        accessorFn: (row) => `${row.cursoNombre} · ${row.seccionNombre}`,
        header: ({ column }) => <DataTableColumnHeader column={column} title="Curso" />,
        cell: ({ row }) => (
          <span className="text-muted-foreground text-xs font-medium">
            {row.original.cursoNombre} · {row.original.seccionNombre}
          </span>
        ),
      },
      {
        accessorKey: "docenteNombre",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Docente solicitante" />
        ),
        cell: ({ row }) => (
          <span className="text-foreground text-xs">{row.original.docenteNombre}</span>
        ),
      },
      {
        accessorKey: "fechaAnterior",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Fecha anterior" />,
        cell: ({ row }) => (
          <span className="text-muted-foreground text-xs line-through">
            {formatDate(row.original.fechaAnterior)}
          </span>
        ),
      },
      {
        accessorKey: "fechaSolicitada",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Nueva fecha" />,
        cell: ({ row }) => (
          <span className="text-primary text-xs font-bold">
            {formatDate(row.original.fechaSolicitada)}
          </span>
        ),
      },
      {
        accessorKey: "motivo",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Motivo justificado" />
        ),
        cell: ({ row }) => (
          <span className="text-muted-foreground block max-w-60 truncate text-xs">
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
                className="hover:bg-destructive/10 text-destructive h-7.5 rounded-xl px-2.5 text-xs font-medium"
                onClick={() => setEnResolucion({ solicitud: sol, accion: "rechazar" })}
              >
                Rechazar
              </Button>
              <Button
                type="button"
                size="sm"
                className="h-7.5 rounded-xl px-2.5 text-xs font-semibold shadow-xs"
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

      {/* KPI Cards Ejecutivas */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="border-border/80 bg-card flex flex-col justify-between rounded-2xl border p-4 shadow-xs">
          <span className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
            <HugeiconsIcon icon={FileEditIcon} size={15} />
            <span>Total solicitudes</span>
          </span>
          <p className="text-foreground mt-2 text-2xl font-extrabold tracking-tight">
            {metricas.total}
          </p>
          <span className="text-muted-foreground/80 text-[11px]">En el periodo actual</span>
        </div>

        <div
          className={`flex flex-col justify-between rounded-2xl border p-4 shadow-xs ${
            metricas.pendientes > 0
              ? "border-amber-500/30 bg-amber-500/5 text-amber-700 dark:text-amber-400"
              : "border-border/80 bg-card text-muted-foreground"
          }`}
        >
          <span className="flex items-center gap-1.5 text-xs font-medium">
            <HugeiconsIcon icon={Clock01Icon} size={15} />
            <span>Pendientes</span>
          </span>
          <p
            className={`mt-2 text-2xl font-extrabold tracking-tight ${
              metricas.pendientes > 0 ? "text-amber-700 dark:text-amber-400" : "text-foreground"
            }`}
          >
            {metricas.pendientes}
          </p>
          <span className="text-[11px]">
            {metricas.pendientes > 0 ? "Requieren revisión directiva" : "Al día"}
          </span>
        </div>

        <div className="flex flex-col justify-between rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 shadow-xs">
          <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
            <HugeiconsIcon icon={CheckmarkCircle02Icon} size={15} />
            <span>Aprobadas</span>
          </span>
          <p className="mt-2 text-2xl font-extrabold tracking-tight text-emerald-700 dark:text-emerald-400">
            {metricas.aprobadas}
          </p>
          <span className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80">
            Fecha reprogramada
          </span>
        </div>

        <div className="border-border/80 bg-card flex flex-col justify-between rounded-2xl border p-4 shadow-xs">
          <span className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
            <HugeiconsIcon icon={AlertCircleIcon} size={15} />
            <span>Rechazadas</span>
          </span>
          <p className="text-foreground mt-2 text-2xl font-extrabold tracking-tight">
            {metricas.rechazadas}
          </p>
          <span className="text-muted-foreground/80 text-[11px]">Con respuesta motivada</span>
        </div>
      </div>

      {/* Barra de Búsqueda y Segmented Control de Estados */}
      <div className="border-border/80 bg-card flex flex-col justify-between gap-3 rounded-2xl border p-4 shadow-xs sm:flex-row sm:items-center">
        <div className="relative max-w-md min-w-60 flex-1">
          <HugeiconsIcon
            icon={Search01Icon}
            size={16}
            className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2"
          />
          <Input
            placeholder="Buscar docente, curso, material o motivo..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="h-9 rounded-xl pr-3 pl-9 text-xs"
          />
        </div>

        {/* Píldoras de estado */}
        <div className="bg-muted/60 flex flex-wrap items-center rounded-xl p-0.5 text-xs">
          <button
            type="button"
            onClick={() => setFiltroEstado("todas")}
            className={`cursor-pointer rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
              filtroEstado === "todas"
                ? "bg-card text-foreground font-semibold shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Todas ({metricas.total})
          </button>
          <button
            type="button"
            onClick={() => setFiltroEstado("solicitada")}
            className={`flex cursor-pointer items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
              filtroEstado === "solicitada"
                ? "bg-card font-semibold text-amber-700 shadow-xs dark:text-amber-400"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {metricas.pendientes > 0 && <span className="size-1.5 rounded-full bg-amber-500" />}
            <span>Pendientes ({metricas.pendientes})</span>
          </button>
          <button
            type="button"
            onClick={() => setFiltroEstado("aprobada")}
            className={`cursor-pointer rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
              filtroEstado === "aprobada"
                ? "bg-card font-semibold text-emerald-700 shadow-xs dark:text-emerald-400"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Aprobadas ({metricas.aprobadas})
          </button>
          <button
            type="button"
            onClick={() => setFiltroEstado("rechazada")}
            className={`cursor-pointer rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
              filtroEstado === "rechazada"
                ? "bg-card text-foreground font-semibold shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Rechazadas ({metricas.rechazadas})
          </button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={solicitudesFiltradas}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => void refetch()}
        pagination={false}
        caption="Solicitudes de cambio de fecha de materiales didácticos"
        emptyState={{
          title:
            busqueda || filtroEstado !== "todas"
              ? "No se encontraron solicitudes"
              : "No hay solicitudes pendientes",
          description:
            busqueda || filtroEstado !== "todas"
              ? "Prueba cambiando el término de búsqueda o el filtro seleccionado."
              : "Las solicitudes de los docentes aparecerán aquí.",
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
