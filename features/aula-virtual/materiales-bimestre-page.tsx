"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { ChartBarLineIcon } from "@hugeicons/core-free-icons";
import { PageHeader } from "@/components/common/page-header";
import { SelectOption } from "@/components/common/select";
import { StatusBadge } from "@/components/common/status-badge";
import { DataTable, DataTableColumnHeader } from "@/components/common/data-table";
import { useAnioLectivo } from "@/features/anio-escolar/anio-lectivo-context";
import { useSeguimiento } from "./hooks";
import type { FilaSeguimiento } from "./types";

export function MaterialesBimestrePage() {
  const { anio } = useAnioLectivo();
  const bimestres = anio?.bimestres ?? [];
  const [periodoId, setPeriodoId] = React.useState("");

  const { data, isLoading, isError, refetch } = useSeguimiento(periodoId || undefined);

  const columns = React.useMemo<ColumnDef<FilaSeguimiento>[]>(
    () => [
      {
        accessorKey: "docenteNombre",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Docente" />,
        cell: ({ row }) => (
          <span className="text-foreground text-xs font-medium">{row.original.docenteNombre}</span>
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
        accessorKey: "planificados",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Planificados" className="justify-end" />
        ),
        cell: ({ row }) => (
          <div className="text-right text-xs font-medium tabular-nums">
            {row.original.planificados}
          </div>
        ),
      },
      {
        accessorKey: "aTiempo",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="A tiempo" className="justify-end" />
        ),
        cell: ({ row }) => (
          <div className="text-right text-xs font-medium text-emerald-600 tabular-nums">
            {row.original.aTiempo}
          </div>
        ),
      },
      {
        accessorKey: "fueraDePlazo",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Fuera de plazo" className="justify-end" />
        ),
        cell: ({ row }) => (
          <div className="text-right text-xs text-amber-600 tabular-nums">
            {row.original.fueraDePlazo}
          </div>
        ),
      },
      {
        accessorKey: "noPublicados",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="No publicados" className="justify-end" />
        ),
        cell: ({ row }) => (
          <div className="text-destructive text-right text-xs tabular-nums">
            {row.original.noPublicados}
          </div>
        ),
      },
      {
        accessorKey: "porcentajeATiempo",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="% a tiempo" className="justify-end" />
        ),
        cell: ({ row }) => (
          <div className="flex justify-end">
            <StatusBadge tone={row.original.porcentajeATiempo >= 80 ? "success" : "warning"}>
              {row.original.porcentajeATiempo}%
            </StatusBadge>
          </div>
        ),
      },
      {
        accessorKey: "solicitudesPendientes",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Solicitudes" className="justify-end" />
        ),
        cell: ({ row }) => (
          <div className="text-right text-xs tabular-nums">
            {row.original.solicitudesPendientes}
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <div className="animate-in fade-in-50 flex flex-col gap-6 duration-300">
      <PageHeader
        title="Materiales del bimestre"
        description="Cumplimiento de los materiales planificados por docente y curso (indicador IGM)."
        icon={ChartBarLineIcon}
        breadcrumbs={[
          { label: "Inicio", href: "/admin/dashboard" },
          { label: "Materiales del bimestre" },
        ]}
      />

      <div className="w-full max-w-56">
        <SelectOption
          options={bimestres.map((b) => ({ value: b.id, label: b.nombre }))}
          value={periodoId}
          onSelect={setPeriodoId}
          placeholder={data?.periodoNombre ?? "Bimestre en curso"}
        />
      </div>

      <div className="space-y-4">
        <DataTable
          columns={columns}
          data={data?.filas ?? []}
          isLoading={isLoading}
          isError={isError}
          onRetry={() => void refetch()}
          pagination={false}
          caption="Seguimiento de cumplimiento de materiales planificados por docente y curso"
          emptyState={{
            title: "Sin materiales planificados",
            description: "Ningún docente ha planificado materiales en este bimestre.",
          }}
        />

        {data && data.filas.length > 0 && (
          <div className="border-border/80 bg-muted/20 flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3 text-xs font-semibold">
            <span className="text-muted-foreground text-[11px] tracking-wider uppercase">
              Totales generales ({data.periodoNombre})
            </span>
            <div className="flex flex-wrap items-center gap-4 text-xs font-medium tabular-nums">
              <span>
                Planificados: <strong className="font-bold">{data.totales.planificados}</strong>
              </span>
              <span className="text-emerald-600">
                A tiempo: <strong className="font-bold">{data.totales.aTiempo}</strong>
              </span>
              <span className="text-amber-600">
                Fuera de plazo: <strong className="font-bold">{data.totales.fueraDePlazo}</strong>
              </span>
              <span className="text-destructive">
                No publicados: <strong className="font-bold">{data.totales.noPublicados}</strong>
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-muted-foreground">Cumplimiento:</span>
                <StatusBadge
                  tone={data.totales.porcentajeATiempo >= 80 ? "success" : "warning"}
                  className="font-bold"
                >
                  {data.totales.porcentajeATiempo}%
                </StatusBadge>
              </div>
              <span>
                Solicitudes:{" "}
                <strong className="font-bold">{data.totales.solicitudesPendientes}</strong>
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
