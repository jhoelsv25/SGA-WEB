"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon, AlertCircleIcon, Download01Icon } from "@hugeicons/core-free-icons";
import { PageState } from "@/components/common/page-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { hoyEnColegio } from "../control/utils";
import { useDescargarAnexos, useJustificaciones, useReporteUgel } from "./hooks";
import { AnularJustificacionModal, NuevaJustificacionModal } from "./justificacion-modales";
import { TIPOS_JUSTIFICACION, type Justificacion, type ReporteUgel } from "./types";

const COLOR_CODIGO: Record<string, string> = {
  I: "bg-destructive/15 text-destructive font-bold",
  "3T": "bg-destructive/15 text-destructive font-bold",
  T: "bg-warning/20 text-foreground font-bold",
  L: "bg-muted text-foreground font-bold",
  P: "bg-muted text-foreground font-bold",
  H: "bg-muted text-foreground font-bold",
  J: "bg-primary/10 text-primary font-bold",
};

/** Mes anterior al actual: es el que se informa a la UGEL. */
function mesAnterior(hoy: string): string {
  const [anio, mes] = hoy.split("-").map(Number);
  return new Date(Date.UTC(anio, mes - 2, 1)).toISOString().slice(0, 7);
}

const horas = (t: { horas: number; minutos: number }) =>
  t.horas === 0 && t.minutos === 0 ? "—" : `${t.horas} h ${t.minutos} min`;

const fechaCorta = (f: string) => `${f.slice(8)}/${f.slice(5, 7)}`;

function Detalle({ reporte }: { reporte: ReporteUgel }) {
  if (reporte.filas.length === 0) {
    return (
      <p className="text-muted-foreground rounded-xl border p-6 text-center text-sm">
        No hay docentes ni auxiliares con vínculo en este mes.
      </p>
    );
  }
  return (
    <div
      className="border-border/70 bg-card max-h-[60vh] overflow-auto rounded-xl border"
      tabIndex={0}
      role="region"
      aria-label="Vista previa del Anexo 03"
    >
      <table className="w-max min-w-full border-collapse text-xs">
        <thead className="bg-muted sticky top-0 z-20">
          <tr>
            <th scope="col" className="bg-muted sticky left-0 z-10 px-3 py-2 text-left">
              Apellidos y nombres
            </th>
            {reporte.calendario.map((d) => (
              <th key={d.numero} scope="col" className="w-7 px-0.5 py-1 text-center font-semibold">
                <span className="block">{d.numero}</span>
                <span className="text-muted-foreground block font-normal">{d.inicial}</span>
              </th>
            ))}
            <th scope="col" className="px-2 text-right">
              Inasist.
            </th>
            <th scope="col" className="px-2 text-right">
              Tardanza
            </th>
            <th scope="col" className="px-2 text-right">
              Permiso s/g
            </th>
          </tr>
        </thead>
        <tbody>
          {reporte.filas.map((f) => (
            <tr key={f.personaId} className="border-border/50 border-t">
              <th
                scope="row"
                className="bg-card sticky left-0 max-w-44 px-3 py-1.5 text-left font-medium sm:max-w-72"
              >
                <span className="block truncate">{f.nombreCompleto}</span>
                <span className="text-muted-foreground block truncate font-normal">
                  {f.dni} · {f.cargo || "sin cargo"} · {f.condicion || "sin condición"}
                </span>
              </th>
              {f.dias.map((codigo, i) => (
                <td key={i} className="p-0.5 text-center">
                  <span
                    className={cn(
                      "block rounded px-0.5 py-1 tabular-nums",
                      COLOR_CODIGO[codigo],
                      codigo === "A" && "text-muted-foreground",
                    )}
                  >
                    {codigo}
                  </span>
                </td>
              ))}
              <td className="px-2 text-right tabular-nums">{f.diasInasistencia}</td>
              <td className="px-2 text-right whitespace-nowrap tabular-nums">
                {horas(f.tardanza)}
              </td>
              <td className="px-2 text-right whitespace-nowrap tabular-nums">
                {horas(f.permisoSinGoce)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Justificaciones({ mes }: { mes: string }) {
  const consulta = useJustificaciones(mes);
  const [nueva, setNueva] = React.useState(false);
  const [aAnular, setAAnular] = React.useState<Justificacion | null>(null);
  const lista = consulta.data ?? [];

  return (
    <section aria-labelledby="titulo-justificaciones" className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 id="titulo-justificaciones" className="text-sm font-bold">
            Justificaciones del mes
          </h2>
          <p className="text-muted-foreground text-xs">
            Regístrelas antes de exportar: sin ellas, un día de licencia sale como inasistencia.
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="min-h-9 gap-1.5"
          onClick={() => setNueva(true)}
        >
          <HugeiconsIcon icon={Add01Icon} className="size-3.5" />
          Registrar justificación
        </Button>
      </div>
      <PageState
        isLoading={consulta.isLoading}
        isError={consulta.isError}
        error={consulta.error}
        onRetry={() => void consulta.refetch()}
        errorTitle="No se pudieron cargar las justificaciones"
      >
        {lista.length === 0 ? (
          <p className="text-muted-foreground border-border/70 rounded-xl border border-dashed p-4 text-center text-xs">
            No hay justificaciones en este mes.
          </p>
        ) : (
          <ul className="border-border/70 bg-card divide-border/60 divide-y rounded-xl border">
            {lista.map((j) => (
              <li
                key={j.id}
                className="flex flex-wrap items-center justify-between gap-2 px-3 py-2"
              >
                <div className={cn("min-w-0 text-xs", j.anulada && "opacity-60")}>
                  <p className="font-semibold">
                    {j.nombreCompleto} · {TIPOS_JUSTIFICACION[j.tipo]}
                    {j.marcaOmitida ? ` (${j.marcaOmitida})` : ""}
                  </p>
                  <p className="text-muted-foreground">
                    {j.fechaDesde === j.fechaHasta
                      ? fechaCorta(j.fechaDesde)
                      : `${fechaCorta(j.fechaDesde)} al ${fechaCorta(j.fechaHasta)}`}
                    {j.minutos ? ` · ${j.minutos} min` : ""} · {j.documento}
                    {j.anulada ? ` · Anulada: ${j.motivoAnulacion}` : ""}
                  </p>
                </div>
                {!j.anulada && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="min-h-9"
                    onClick={() => setAAnular(j)}
                  >
                    Anular
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </PageState>
      <NuevaJustificacionModal mes={mes} abierto={nueva} onOpenChange={setNueva} />
      <AnularJustificacionModal justificacion={aAnular} onCerrar={() => setAAnular(null)} />
    </section>
  );
}

/** RF-025: Anexos 03 y 04 para remitir a la UGEL. */
export function ReporteUgelPanel() {
  const hoy = hoyEnColegio();
  const [mes, setMes] = React.useState(() => mesAnterior(hoy));
  const consulta = useReporteUgel(mes);
  const descargar = useDescargarAnexos(mes);
  const reporte = consulta.data;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="mes-reporte" className="text-xs font-semibold">
            Mes a informar
          </Label>
          <Input
            id="mes-reporte"
            type="month"
            max={hoy.slice(0, 7)}
            value={mes}
            onChange={(e) => e.target.value && setMes(e.target.value)}
            className="w-48"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            className="min-h-10 gap-1.5"
            disabled={!reporte || descargar.isPending}
            onClick={() => descargar.mutate("xlsx")}
          >
            <HugeiconsIcon icon={Download01Icon} className="size-4" />
            Excel (editable)
          </Button>
          <Button
            className="min-h-10 gap-1.5"
            disabled={!reporte || descargar.isPending}
            onClick={() => descargar.mutate("pdf")}
          >
            <HugeiconsIcon icon={Download01Icon} className="size-4" />
            PDF para firma
          </Button>
        </div>
      </div>

      <p className="text-muted-foreground text-xs">
        Anexos 03 y 04 de la RSG 326-2017-MINEDU y su modificatoria RSG 121-2018. El director los
        firma y los remite a la UGEL dentro de los 3 primeros días hábiles del mes siguiente,
        incluso si no hubo incidencias.
      </p>

      <PageState
        isLoading={consulta.isLoading}
        isError={consulta.isError}
        error={consulta.error}
        onRetry={() => void consulta.refetch()}
        errorTitle="No se pudo armar el reporte"
      >
        {reporte && (
          <div className="space-y-4">
            {reporte.avisos.length > 0 && (
              <section
                aria-labelledby="titulo-avisos"
                className="border-warning/40 bg-warning/10 rounded-xl border p-3"
              >
                <h2 id="titulo-avisos" className="flex items-center gap-2 text-sm font-bold">
                  <HugeiconsIcon icon={AlertCircleIcon} className="size-4" />
                  Revise antes de enviar
                </h2>
                <ul className="mt-1.5 list-disc space-y-1 pl-5 text-xs">
                  {reporte.avisos.map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                </ul>
              </section>
            )}
            <ul className="text-muted-foreground flex flex-wrap gap-x-3 gap-y-1 text-xs">
              {reporte.leyenda.map(([codigo, texto]) => (
                <li key={codigo}>
                  <span className="text-foreground font-bold">{codigo}</span> {texto}
                </li>
              ))}
            </ul>
            <Detalle reporte={reporte} />
          </div>
        )}
      </PageState>

      <Justificaciones mes={mes} />
    </div>
  );
}
