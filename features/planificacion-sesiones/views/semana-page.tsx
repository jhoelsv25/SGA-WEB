"use client";

import * as React from "react";
import Link from "next/link";
import { Calendar03Icon } from "@hugeicons/core-free-icons";
import { PageHeader } from "@/components/common/page-header";
import { PageState } from "@/components/common/page-state";
import { StatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HistorialPlanificacionesView } from "./historial-page";
import { ESTADOS_PLANIFICACION, MENU_PLANIFICACION_SESIONES } from "../consts";
import { useCopiarPlanificacion, useSemana } from "../hooks";
import type { BloqueSemana } from "../types";
import { DIAS, desplazarSemana, hoyIso, recortarHora } from "../utils";

/** Semana del docente: cada bloque de su horario con el estado de su sesión. */
function SemanaView() {
  const [fecha, setFecha] = React.useState(hoyIso());
  const { data, isLoading, isError, error, refetch } = useSemana(fecha);
  const copiar = useCopiarPlanificacion();
  const [origen, setOrigen] = React.useState<BloqueSemana | null>(null);

  const porFecha = React.useMemo(() => {
    const mapa = new Map<string, BloqueSemana[]>();
    for (const b of data?.bloques ?? []) mapa.set(b.fecha, [...(mapa.get(b.fecha) ?? []), b]);
    return [...mapa.entries()];
  }, [data]);

  const href = (b: BloqueSemana) =>
    b.planificacionId
      ? `${MENU_PLANIFICACION_SESIONES}/editor?id=${b.planificacionId}`
      : `${MENU_PLANIFICACION_SESIONES}/editor?horarioId=${b.bloque.horarioId}&fecha=${b.fecha}`;

  return (
    <div className="animate-in fade-in-50 flex flex-col gap-2 duration-300">
      <PageHeader
        title="Planificación de sesiones"
        description="Planifique las sesiones de su semana. La firma de ingreso se hace en el kiosko."
        icon={Calendar03Icon}
        breadcrumbs={[{ label: "Inicio", href: "/admin/dashboard" }, { label: "Planificación" }]}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setFecha(desplazarSemana(fecha, -1))}>
              Semana anterior
            </Button>
            <Button variant="outline" onClick={() => setFecha(hoyIso())}>
              Esta semana
            </Button>
            <Button variant="outline" onClick={() => setFecha(desplazarSemana(fecha, 1))}>
              Semana siguiente
            </Button>
          </div>
        }
      />
      <PageState
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={() => void refetch()}
        isEmpty={Boolean(data) && data?.bloques.length === 0}
        empty={{
          title: "No tiene bloques en su horario",
          description: "Cuando se le asigne horario, podrá planificar aquí.",
        }}
      >
        {data && (
          <div className="space-y-6">
            <p className="text-muted-foreground text-sm">
              Del {data.desde} al {data.hasta}
            </p>
            {porFecha.map(([dia, bloques]) => (
              <section key={dia} className="space-y-2">
                <h2 className="text-base font-semibold">
                  {DIAS[bloques[0]?.bloque.diaSemana ?? 0]} · {dia}
                </h2>
                <ul className="space-y-2">
                  {bloques.map((b) => {
                    const e = ESTADOS_PLANIFICACION[b.estado];
                    return (
                      <li
                        key={`${b.bloque.horarioId}-${b.fecha}`}
                        className="border-border/80 bg-card flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="space-y-0.5 text-sm">
                          <p className="font-medium">
                            {recortarHora(b.bloque.horaInicio)}–{recortarHora(b.bloque.horaFin)} ·{" "}
                            {b.bloque.cursoNombre}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {b.bloque.gradoNombre} {b.bloque.seccionNombre}
                            {b.titulo ? ` · ${b.titulo}` : ""}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <StatusBadge tone={e.tono}>{e.etiqueta}</StatusBadge>
                          {b.planificacionId && b.estado !== "ejecutada" && (
                            <Button variant="outline" onClick={() => setOrigen(b)}>
                              Copiar a otra sección
                            </Button>
                          )}
                          <Button asChild variant="outline">
                            <Link href={href(b)}>{b.planificacionId ? "Abrir" : "Planificar"}</Link>
                          </Button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
            {origen && (
              <section className="border-border/80 space-y-2 rounded-2xl border p-4">
                <h2 className="text-sm font-semibold">
                  Copiar «{origen.titulo}» a bloques del mismo curso
                </h2>
                <ul className="space-y-1">
                  {data.bloques
                    .filter(
                      (x) =>
                        x.bloque.cursoNombre === origen.bloque.cursoNombre &&
                        x.bloque.gradoNumero === origen.bloque.gradoNumero &&
                        x.bloque.horarioId !== origen.bloque.horarioId &&
                        !x.planificacionId,
                    )
                    .map((x) => (
                      <li
                        key={`${x.bloque.horarioId}-${x.fecha}`}
                        className="flex items-center gap-3 text-sm"
                      >
                        <span>
                          {x.fecha} · {x.bloque.gradoNombre} {x.bloque.seccionNombre}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={copiar.isPending}
                          onClick={() =>
                            origen.planificacionId &&
                            copiar.mutate({
                              id: origen.planificacionId,
                              destinos: [{ horarioId: x.bloque.horarioId, fecha: x.fecha }],
                            })
                          }
                        >
                          Copiar aquí
                        </Button>
                      </li>
                    ))}
                </ul>
                <Button size="sm" variant="ghost" onClick={() => setOrigen(null)}>
                  Cerrar
                </Button>
              </section>
            )}
          </div>
        )}
      </PageState>
    </div>
  );
}

/** Pantalla del docente: su semana y todo su historial por bimestre. */
export function SemanaPlanificacionPage() {
  return (
    <Tabs defaultValue="semana" className="gap-4">
      <TabsList>
        <TabsTrigger value="semana">Semana</TabsTrigger>
        <TabsTrigger value="historial">Historial por bimestre</TabsTrigger>
      </TabsList>
      <TabsContent value="semana">
        <SemanaView />
      </TabsContent>
      <TabsContent value="historial">
        <HistorialPlanificacionesView />
      </TabsContent>
    </Tabs>
  );
}
