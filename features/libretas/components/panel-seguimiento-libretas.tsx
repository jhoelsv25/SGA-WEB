"use client";

import { useState } from "react";
import { SelectOption } from "@/components/common/select";
import { tituloBimestre } from "../constants";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useDetalleLibretasQuery, useSeguimientoLibretasQuery } from "../hooks";
import type { ContextoLibretas } from "../types";
import { DetalleLibretasTable } from "../views/table/detalle-libretas-table";

export function PanelSeguimientoLibretas({
  contexto,
  puedeHistorial,
}: {
  contexto: ContextoLibretas;
  puedeHistorial: boolean;
}) {
  const periodos = contexto.periodos.filter((periodo) => periodo.programada);
  const [periodoId, setPeriodoId] = useState(
    () => periodos.find((p) => p.vigente)?.id ?? periodos[0]?.id ?? "",
  );
  const [seccionId, setSeccionId] = useState<string | null>(null);
  const seguimiento = useSeguimientoLibretasQuery(periodoId || undefined);
  const detalle = useDetalleLibretasQuery(seccionId ?? undefined, periodoId || undefined);

  return (
    <div className="space-y-4">
      <div className="max-w-sm space-y-1.5">
        <Label className="text-sm font-medium">Bimestre</Label>
        <SelectOption
          options={contexto.periodos
            .filter((periodo) => periodo.programada)
            .map((periodo) => ({ value: periodo.id, label: tituloBimestre(periodo.nombre) }))}
          value={periodoId || undefined}
          onSelect={(valor) => {
            setPeriodoId(valor);
            setSeccionId(null);
          }}
          placeholder="Elige el bimestre"
          emptyMessage="No hay bimestres programados"
        />
      </div>

      {seguimiento.isLoading ? <Skeleton className="h-24 w-full" /> : null}

      {seguimiento.data && seguimiento.data.secciones.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          No hay secciones en tu alcance para este bimestre.
        </p>
      ) : null}

      <ul className="grid gap-3 md:grid-cols-2">
        {seguimiento.data?.secciones.map((seccion) => (
          <li key={seccion.seccionId}>
            <button
              type="button"
              className={`w-full rounded-xl border p-4 text-left ${seccionId === seccion.seccionId ? "border-primary" : ""}`}
              onClick={() => setSeccionId(seccion.seccionId)}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold">
                  {seccion.gradoNombre} {seccion.seccionNombre}
                </p>
                <Badge variant="info">{seccion.porcentajeATiempo}% a tiempo</Badge>
              </div>
              <p className="text-muted-foreground mt-2 text-xs">
                {seccion.aTiempo} a tiempo · {seccion.fueraDePlazo} fuera de plazo ·{" "}
                {seccion.pendientes} pendientes · {seccion.vistas} vistas
              </p>
            </button>
          </li>
        ))}
      </ul>

      {seccionId ? (
        <DetalleLibretasTable
          data={detalle.data ?? []}
          isLoading={detalle.isLoading}
          isError={detalle.isError}
          onRetry={() => detalle.refetch()}
          puedeHistorial={puedeHistorial}
        />
      ) : null}
    </div>
  );
}
