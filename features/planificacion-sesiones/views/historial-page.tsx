"use client";

import * as React from "react";
import Link from "next/link";
import { Archive01Icon } from "@hugeicons/core-free-icons";
import { PageState } from "@/components/common/page-state";
import { SelectOption } from "@/components/common/select";
import { StatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import { useAnioLectivo } from "@/features/anio-escolar/anio-lectivo-context";
import { ESTADOS_PLANIFICACION, MENU_PLANIFICACION_SESIONES } from "../consts";
import { useHistorial } from "../hooks";
import type { EstadoPlanificacion, ItemHistorial } from "../types";
import { hoyIso, recortarHora, semanasDeBimestre } from "../utils";

const TODAS = "todas";

interface Props {
  /** true: el supervisor ve las de todos los docentes, en solo lectura. */
  supervision?: boolean;
}

/** Historial por año académico → bimestre → semana, para revisar lo pasado y lo próximo. */
export function HistorialPlanificacionesView({ supervision = false }: Props) {
  const { anio } = useAnioLectivo();
  const bimestres = React.useMemo(() => anio?.bimestres ?? [], [anio]);
  const [elegido, setElegido] = React.useState<string>();
  const [semana, setSemana] = React.useState(TODAS);
  const [estado, setEstado] = React.useState(TODAS);

  const bimestre = React.useMemo(() => {
    const hoy = hoyIso();
    return (
      bimestres.find((b) => b.id === elegido) ??
      bimestres.find((b) => b.fechaInicio.slice(0, 10) <= hoy && hoy <= b.fechaFin.slice(0, 10)) ??
      bimestres[0]
    );
  }, [bimestres, elegido]);

  const semanas = React.useMemo(
    () => (bimestre ? semanasDeBimestre(bimestre.fechaInicio, bimestre.fechaFin) : []),
    [bimestre],
  );
  const sel = semanas.find((s) => String(s.numero) === semana);
  const desde = sel?.desde ?? bimestre?.fechaInicio.slice(0, 10) ?? "";
  const hasta = sel?.hasta ?? bimestre?.fechaFin.slice(0, 10) ?? "";

  const { data, isLoading, isError, error, refetch } = useHistorial(
    { desde, hasta, estado: estado === TODAS ? undefined : (estado as EstadoPlanificacion) },
    supervision,
    Boolean(bimestre),
  );

  const porSemana = React.useMemo(() => {
    const mapa = new Map<number, ItemHistorial[]>();
    for (const item of data ?? []) {
      const n = semanas.find((x) => item.fecha >= x.desde && item.fecha <= x.hasta)?.numero ?? 0;
      mapa.set(n, [...(mapa.get(n) ?? []), item]);
    }
    return [...mapa.entries()].sort((a, b) => b[0] - a[0]);
  }, [data, semanas]);

  const href = (i: ItemHistorial) =>
    supervision
      ? `/admin/sesiones-hoy/planificacion/${i.id}`
      : `${MENU_PLANIFICACION_SESIONES}/editor?id=${i.id}`;

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground text-sm">
        Año académico {anio?.anio ?? "—"}. Elija el bimestre y, si quiere, una semana.
      </p>
      <div className="grid gap-3 sm:grid-cols-3">
        <SelectOption
          options={bimestres.map((b) => ({ value: b.id, label: `Bimestre ${b.nombre}` }))}
          value={bimestre?.id}
          placeholder="Bimestre"
          onSelect={(v) => {
            setElegido(v);
            setSemana(TODAS);
          }}
        />
        <SelectOption
          options={[
            { value: TODAS, label: "Todas las semanas" },
            ...semanas.map((s) => ({
              value: String(s.numero),
              label: `Semana ${s.numero} · ${s.desde} a ${s.hasta}`,
            })),
          ]}
          value={semana}
          onSelect={setSemana}
        />
        <SelectOption
          options={[
            { value: TODAS, label: "Todos los estados" },
            { value: "borrador", label: "Borrador" },
            { value: "lista", label: "Lista" },
            { value: "ejecutada", label: "Ejecutada" },
          ]}
          value={estado}
          onSelect={setEstado}
        />
      </div>
      {bimestre && (
        <PageState
          isLoading={isLoading}
          isError={isError}
          error={error}
          onRetry={() => void refetch()}
          isEmpty={data?.length === 0}
          empty={{
            title: "Sin planificaciones",
            description: "No hay sesiones planificadas en este periodo.",
            icon: Archive01Icon,
          }}
        >
          <div className="space-y-6">
            {porSemana.map(([n, items]) => (
              <section key={n} className="space-y-2">
                <h2 className="text-base font-semibold">
                  {n === 0 ? "Fuera del bimestre" : `Semana ${n}`}
                </h2>
                <ul className="space-y-2">
                  {items.map((i) => {
                    const e = ESTADOS_PLANIFICACION[i.estado];
                    return (
                      <li
                        key={i.id}
                        className="border-border/80 bg-card flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="space-y-0.5 text-sm">
                          <p className="font-medium">
                            {i.fecha} · {recortarHora(i.horaInicio)}–{recortarHora(i.horaFin)} ·{" "}
                            {i.titulo}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {supervision ? `${i.docenteNombre} · ` : ""}
                            {i.cursoNombre} · {i.gradoNombre} {i.seccionNombre}
                            {i.comentarios > 0 ? ` · ${i.comentarios} comentario(s)` : ""}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <StatusBadge tone={e.tono}>{e.etiqueta}</StatusBadge>
                          <Button asChild variant="outline">
                            <Link href={href(i)}>{supervision ? "Ver" : "Abrir"}</Link>
                          </Button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>
        </PageState>
      )}
    </div>
  );
}
