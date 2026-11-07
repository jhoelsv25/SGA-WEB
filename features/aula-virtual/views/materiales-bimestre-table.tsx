"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";
import { SelectOption } from "@/components/common/select";
import { StatusBadge } from "@/components/common/status-badge";
import { DataTable } from "@/components/common/data-table";
import { useAnioLectivo } from "@/features/anio-escolar/anio-lectivo-context";
import { formatearBimestre } from "../utils";
import { useSeguimiento } from "../hooks";
import { getMaterialesBimestreColumns } from "./columns/materiales-bimestre-columns";

export function MaterialesBimestreTable() {
  const { anio } = useAnioLectivo();
  const bimestres = React.useMemo(() => anio?.bimestres ?? [], [anio?.bimestres]);
  const enCurso = React.useMemo(
    () => bimestres.find((b) => b.estado === "en_curso") ?? bimestres[0],
    [bimestres],
  );
  const [periodoSeleccionado, setPeriodoSeleccionado] = React.useState<string | null>(null);

  const periodoId = periodoSeleccionado ?? enCurso?.id ?? "";
  const { data, isLoading, isError, refetch } = useSeguimiento(periodoId || undefined);

  const columns = React.useMemo(() => getMaterialesBimestreColumns(), []);

  return (
    <div className="space-y-6">
      {/* Selector de Bimestre */}
      <div className="flex w-full max-w-64 flex-col gap-1.5">
        <Label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
          Bimestre académico
        </Label>
        <SelectOption
          options={bimestres.map((b) => ({
            value: b.id,
            label: `${formatearBimestre(b.nombre)}${b.estado === "en_curso" ? " · En curso" : ""}`,
          }))}
          value={periodoId}
          onSelect={setPeriodoSeleccionado}
          placeholder={formatearBimestre(data?.periodoNombre) || "Seleccionar bimestre..."}
        />
      </div>

      {/* Tabla con DataTable de @/components/common/data-table */}
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

        {/* Barra de Totales Generales del Bimestre */}
        {data && data.filas.length > 0 && (
          <div className="border-border/80 bg-muted/20 flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3 text-xs font-semibold">
            <span className="text-muted-foreground text-[11px] tracking-wider uppercase">
              Totales generales ({formatearBimestre(data.periodoNombre)})
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
