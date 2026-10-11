"use client";

import * as React from "react";
import { ChartBarLineIcon } from "@hugeicons/core-free-icons";
import { PageHeader } from "@/components/common/page-header";
import { PageState } from "@/components/common/page-state";
import { SelectOption } from "@/components/common/select";
import { StatusBadge } from "@/components/common/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAnioLectivo } from "@/features/anio-escolar/anio-lectivo-context";
import { useSeguimiento } from "./hooks";

export function MaterialesBimestrePage() {
  const { anio } = useAnioLectivo();
  const bimestres = anio?.bimestres ?? [];
  const [periodoId, setPeriodoId] = React.useState("");

  const { data, isLoading, isError, error, refetch } = useSeguimiento(periodoId || undefined);

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

      <PageState
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={() => void refetch()}
        errorTitle="No se pudo cargar el seguimiento"
        isEmpty={Boolean(data) && data!.filas.length === 0}
        empty={{
          title: "Sin materiales planificados",
          description: "Ningún docente ha planificado materiales en este bimestre.",
        }}
      >
        {data && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Docente</TableHead>
                <TableHead>Curso</TableHead>
                <TableHead className="text-right">Planificados</TableHead>
                <TableHead className="text-right">A tiempo</TableHead>
                <TableHead className="text-right">Fuera de plazo</TableHead>
                <TableHead className="text-right">No publicados</TableHead>
                <TableHead className="text-right">% a tiempo</TableHead>
                <TableHead className="text-right">Solicitudes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.filas.map((fila) => (
                <TableRow key={`${fila.docenteId}-${fila.cursoSeccionId}`}>
                  <TableCell className="font-medium">{fila.docenteNombre}</TableCell>
                  <TableCell>
                    {fila.cursoNombre} · {fila.seccionNombre}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{fila.planificados}</TableCell>
                  <TableCell className="text-right tabular-nums">{fila.aTiempo}</TableCell>
                  <TableCell className="text-right tabular-nums">{fila.fueraDePlazo}</TableCell>
                  <TableCell className="text-right tabular-nums">{fila.noPublicados}</TableCell>
                  <TableCell className="text-right">
                    <StatusBadge tone={fila.porcentajeATiempo >= 80 ? "success" : "warning"}>
                      {fila.porcentajeATiempo}%
                    </StatusBadge>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {fila.solicitudesPendientes}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={2} className="font-semibold">
                  Total
                </TableCell>
                <TableCell className="text-right font-semibold tabular-nums">
                  {data.totales.planificados}
                </TableCell>
                <TableCell className="text-right font-semibold tabular-nums">
                  {data.totales.aTiempo}
                </TableCell>
                <TableCell className="text-right font-semibold tabular-nums">
                  {data.totales.fueraDePlazo}
                </TableCell>
                <TableCell className="text-right font-semibold tabular-nums">
                  {data.totales.noPublicados}
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {data.totales.porcentajeATiempo}%
                </TableCell>
                <TableCell className="text-right font-semibold tabular-nums">
                  {data.totales.solicitudesPendientes}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        )}
      </PageState>
    </div>
  );
}
