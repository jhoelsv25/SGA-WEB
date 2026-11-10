"use client";

import * as React from "react";
import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { FileExportIcon, Task01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { DataTable } from "@/components/common/data-table";
import { ListToolbar, type ListFilterDef } from "@/components/common/list-toolbar";
import { PageHeader } from "@/components/common/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useAnioLectivo } from "@/features/anio-escolar/anio-lectivo-context";
import { useDocentesQuery } from "@/features/docentes/hooks/use-docentes";
import { useListFilters } from "@/hooks/use-list-filters";
import { formatDate } from "@/lib/formatters/date";
import { toast } from "@/lib/toast";
import { exportarPendientesExcel, guardarArchivoEnNavegador } from "../../api";
import { ETIQUETAS_PENDIENTE, TIPOS_PENDIENTE_ORDEN } from "../../consts";
import { usePendientesSeguimientoQuery } from "../../hooks";
import type { PendienteItem } from "../../types";

const columnas: ColumnDef<PendienteItem>[] = [
  {
    accessorKey: "tipoEtiqueta",
    header: "Pendiente",
    cell: ({ row }) => <Badge variant="secondary">{row.original.tipoEtiqueta}</Badge>,
  },
  {
    accessorKey: "docenteNombre",
    header: "Docente",
    cell: ({ row }) => (
      <span className="text-foreground text-xs font-medium">{row.original.docenteNombre}</span>
    ),
  },
  {
    id: "periodo",
    header: "Bimestre",
    cell: ({ row }) => (
      <span className="text-muted-foreground text-xs">{row.original.periodoNombre ?? "—"}</span>
    ),
  },
  {
    accessorKey: "fechaOrigen",
    header: "Fecha de origen",
    cell: ({ row }) => <span className="text-xs">{formatDate(row.original.fechaOrigen)}</span>,
  },
  {
    accessorKey: "diasAtraso",
    header: "Días de atraso",
    cell: ({ row }) => (
      <span
        className={
          row.original.diasAtraso > 0
            ? "text-destructive font-mono text-xs font-semibold"
            : "text-muted-foreground font-mono text-xs"
        }
      >
        {row.original.diasAtraso}
      </span>
    ),
  },
  {
    id: "acciones",
    header: "",
    cell: ({ row }) => (
      <Button asChild variant="outline" size="sm">
        <Link href={row.original.enlace}>Atender</Link>
      </Button>
    ),
  },
];

export function PendientesVista() {
  const { anio } = useAnioLectivo();
  const bimestres = React.useMemo(() => anio?.bimestres ?? [], [anio?.bimestres]);
  const { data: docentesResp } = useDocentesQuery({ limit: 100 });

  const filterDefs = React.useMemo<readonly ListFilterDef[]>(
    () => [
      {
        type: "select",
        key: "periodoId",
        label: "Bimestre",
        placeholder: "Todos los bimestres",
        searchPlaceholder: "Buscar bimestre...",
        options: bimestres.map((b) => ({ value: b.id, label: `Bimestre ${b.nombre}` })),
        inline: false,
      },
      {
        type: "select",
        key: "docenteId",
        label: "Docente",
        placeholder: "Todos los docentes",
        searchPlaceholder: "Buscar docente...",
        options: (docentesResp?.data ?? []).map((d) => ({
          value: d.id,
          label: d.persona.nombreCompleto,
        })),
        inline: false,
      },
    ],
    [bimestres, docentesResp?.data],
  );
  const listFilters = useListFilters(filterDefs);

  const periodoId = listFilters.getString("periodoId");
  const docenteId = listFilters.getString("docenteId");
  const query = {
    periodoId: periodoId && periodoId !== "all" ? periodoId : undefined,
    docenteId: docenteId && docenteId !== "all" ? docenteId : undefined,
  };

  const { data, isLoading, isError, refetch, isFetching } = usePendientesSeguimientoQuery(query);
  const [exportando, setExportando] = React.useState(false);

  const handleExportar = async () => {
    setExportando(true);
    try {
      guardarArchivoEnNavegador(await exportarPendientesExcel(query));
    } catch {
      toast.error("No se pudo exportar los pendientes.");
    } finally {
      setExportando(false);
    }
  };

  const items = data?.items ?? [];
  const hayFiltros = Boolean(query.periodoId || query.docenteId);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pendientes de seguimiento"
        description="Lo que aún falta atender en el seguimiento docente, con los días de atraso."
        icon={Task01Icon}
        breadcrumbs={[
          { label: "Inicio", href: "/admin/dashboard" },
          { label: "Pendientes de seguimiento" },
        ]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {TIPOS_PENDIENTE_ORDEN.map((tipo) => (
          <div key={tipo} className="border-border/60 bg-card rounded-2xl border p-3 shadow-xs">
            <span className="text-muted-foreground block text-[11px] font-medium">
              {ETIQUETAS_PENDIENTE[tipo]}
            </span>
            <span className="text-foreground block font-mono text-2xl font-bold">
              {data?.conteos[tipo] ?? 0}
            </span>
          </div>
        ))}
      </div>

      <ListToolbar
        filterDefs={filterDefs}
        listFilters={listFilters}
        onRefresh={() => void refetch()}
        isRefreshing={isFetching}
        secondaryActions={
          <DropdownMenuItem disabled={exportando || items.length === 0} onSelect={handleExportar}>
            <HugeiconsIcon icon={FileExportIcon} className="size-4" />
            Exportar Excel
          </DropdownMenuItem>
        }
      />

      <DataTable
        columns={columnas}
        data={items}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => void refetch()}
        hasActiveFilters={hayFiltros}
        pagination={false}
        caption="Pendientes de seguimiento docente"
        emptyMessage={data?.mensaje ?? "No hay pendientes de seguimiento."}
      />
    </div>
  );
}
