"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CheckmarkCircle02Icon,
  Clock01Icon,
  AlertCircleIcon,
  Calendar03Icon,
  Book02Icon,
  CheckListIcon,
} from "@hugeicons/core-free-icons";
import { PageState } from "@/components/common/page-state";
import { StatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import { RESULTADOS_MARCACION_CONFIG } from "@/features/marcaciones/consts";
import { ESTADOS_ASISTENCIA_CONFIG } from "../consts";
import { useAsistenciaEstudiante } from "../hooks";
import type { IncidenciaCurso, RangoFechas } from "../types";

interface DetalleAsistenciaEstudianteProps {
  estudianteId: string;
  rango: RangoFechas;
  /** Si se entrega, las faltas muestran el botón para justificarlas. */
  onJustificar?: (incidencia: IncidenciaCurso, cursoNombre: string) => void;
}

const fechaCorta = (iso: string): string => iso.slice(0, 10).split("-").reverse().join("/");

export function DetalleAsistenciaEstudiante({
  estudianteId,
  rango,
  onJustificar,
}: DetalleAsistenciaEstudianteProps) {
  const { data, isLoading, isError, error, refetch } = useAsistenciaEstudiante(estudianteId, rango);

  return (
    <PageState
      isLoading={isLoading}
      isError={isError}
      error={error}
      onRetry={() => void refetch()}
      errorTitle="No se pudo cargar la asistencia"
    >
      {data && (
        <div className="space-y-6">
          {/* Asistencia General al Colegio */}
          <section aria-labelledby="titulo-colegio" className="space-y-3">
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={CheckListIcon} className="text-primary size-4" />
              <h2 id="titulo-colegio" className="text-foreground text-sm font-bold tracking-tight">
                Control de Ingreso y Asistencia General
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="border-border/80 bg-card rounded-2xl border p-3.5 shadow-xs">
                <span className="text-muted-foreground flex items-center justify-between text-xs font-semibold uppercase">
                  <span>Puntuales</span>
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-4 text-emerald-500" />
                </span>
                <p className="mt-1.5 text-2xl font-black text-emerald-600 tabular-nums dark:text-emerald-400">
                  {data.colegio.puntuales}
                </p>
                <span className="text-muted-foreground text-[11px]">Ingresos a tiempo</span>
              </div>

              <div
                className={`rounded-2xl border p-3.5 shadow-xs ${
                  data.colegio.tardanzas > 0
                    ? "border-amber-500/30 bg-amber-500/5"
                    : "border-border/80 bg-card"
                }`}
              >
                <span className="text-muted-foreground flex items-center justify-between text-xs font-semibold uppercase">
                  <span>Tardanzas</span>
                  <HugeiconsIcon
                    icon={Clock01Icon}
                    className={`size-4 ${data.colegio.tardanzas > 0 ? "text-amber-500" : "text-muted-foreground"}`}
                  />
                </span>
                <p
                  className={`mt-1.5 text-2xl font-black tabular-nums ${
                    data.colegio.tardanzas > 0
                      ? "text-amber-700 dark:text-amber-400"
                      : "text-foreground"
                  }`}
                >
                  {data.colegio.tardanzas}
                </p>
                <span className="text-muted-foreground text-[11px]">Con retraso registrado</span>
              </div>

              <div
                className={`rounded-2xl border p-3.5 shadow-xs ${
                  data.colegio.faltasAlColegio.length > 0
                    ? "border-rose-500/30 bg-rose-500/5"
                    : "border-border/80 bg-card"
                }`}
              >
                <span className="text-muted-foreground flex items-center justify-between text-xs font-semibold uppercase">
                  <span>Inasistencias</span>
                  <HugeiconsIcon
                    icon={AlertCircleIcon}
                    className={`size-4 ${data.colegio.faltasAlColegio.length > 0 ? "text-rose-500" : "text-emerald-500"}`}
                  />
                </span>
                <p
                  className={`mt-1.5 text-2xl font-black tabular-nums ${
                    data.colegio.faltasAlColegio.length > 0
                      ? "text-rose-600 dark:text-rose-400"
                      : "text-foreground"
                  }`}
                >
                  {data.colegio.faltasAlColegio.length}
                </p>
                <span className="text-muted-foreground text-[11px]">Días sin asistencia</span>
              </div>

              <div className="border-border/80 bg-card rounded-2xl border p-3.5 shadow-xs">
                <span className="text-muted-foreground flex items-center justify-between text-xs font-semibold uppercase">
                  <span>Fuera turno</span>
                  <HugeiconsIcon icon={Calendar03Icon} className="text-primary size-4" />
                </span>
                <p className="text-foreground mt-1.5 text-2xl font-black tabular-nums">
                  {data.colegio.fueraDeTurno}
                </p>
                <span className="text-muted-foreground text-[11px]">Marcaciones externas</span>
              </div>
            </div>

            {data.colegio.faltasAlColegio.length > 0 && (
              <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-3">
                <p className="text-xs font-semibold text-rose-800 dark:text-rose-300">
                  Días con inasistencia general:
                </p>
                <ul
                  className="mt-1.5 flex flex-wrap gap-1.5"
                  aria-label="Días con falta al colegio"
                >
                  {data.colegio.faltasAlColegio.map((dia) => (
                    <li key={dia}>
                      <StatusBadge tone="danger" size="sm">
                        Falta · {fechaCorta(dia)}
                      </StatusBadge>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {data.colegio.entradas.length > 0 && (
              <div className="border-border/80 bg-card overflow-hidden rounded-2xl border shadow-xs">
                <div className="bg-muted/40 border-border/60 text-muted-foreground border-b px-4 py-2 text-xs font-bold">
                  Historial de Marcaciones Biométricas
                </div>
                <ul className="divide-border/50 divide-y text-xs">
                  {data.colegio.entradas.map((e) => {
                    const resultado = RESULTADOS_MARCACION_CONFIG[e.resultado];
                    return (
                      <li
                        key={`${e.fecha}-${e.hora}`}
                        className="hover:bg-muted/20 flex items-center justify-between px-4 py-2.5 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-foreground font-mono text-xs font-semibold">
                            {fechaCorta(e.fecha)}
                          </span>
                          <span className="text-muted-foreground font-mono text-xs">{e.hora}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <StatusBadge tone={resultado.tone} dot size="sm">
                            {resultado.label}
                            {e.minutosTardanza > 0 && ` (${e.minutosTardanza} min)`}
                          </StatusBadge>
                          {e.justificada && (
                            <StatusBadge tone="info" size="sm">
                              Justificada
                            </StatusBadge>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </section>

          {/* Asistencia por Asignaturas / Cursos */}
          <section aria-labelledby="titulo-cursos" className="space-y-3">
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={Book02Icon} className="text-primary size-4" />
              <h2 id="titulo-cursos" className="text-foreground text-sm font-bold tracking-tight">
                Asistencia por Materia / Curso
              </h2>
            </div>

            {data.cursos.length === 0 ? (
              <p className="border-border/70 text-muted-foreground rounded-2xl border border-dashed py-8 text-center text-xs">
                Aún no hay asistencia registrada en clase para este estudiante en el periodo
                elegido.
              </p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {data.cursos.map((curso) => {
                  const totalSesiones =
                    curso.totales.presentes +
                    curso.totales.tardanzas +
                    curso.totales.faltas +
                    curso.totales.faltasJustificadas;
                  const porcentajeAsistencia =
                    totalSesiones > 0
                      ? Math.round(
                          ((curso.totales.presentes + curso.totales.tardanzas) / totalSesiones) *
                            100,
                        )
                      : 100;

                  return (
                    <div
                      key={curso.cursoSeccionId}
                      className="border-border/80 bg-card rounded-2xl border p-4 shadow-xs"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-foreground text-xs font-bold">{curso.cursoNombre}</h3>
                          <p className="text-muted-foreground mt-0.5 text-[11px]">
                            {curso.totales.presentes} presentes · {curso.totales.tardanzas}{" "}
                            tardanzas · {curso.totales.faltas} faltas
                          </p>
                        </div>
                        <StatusBadge
                          tone={
                            porcentajeAsistencia >= 90
                              ? "success"
                              : porcentajeAsistencia >= 75
                                ? "warning"
                                : "danger"
                          }
                          size="sm"
                          className="font-bold"
                        >
                          {porcentajeAsistencia}% asist.
                        </StatusBadge>
                      </div>

                      {curso.incidencias.length > 0 && (
                        <div className="border-border/50 bg-muted/20 mt-3 space-y-1.5 rounded-xl border p-2.5">
                          <p className="text-muted-foreground text-[11px] font-semibold">
                            Incidencias:
                          </p>
                          <ul className="divide-border/40 divide-y text-xs">
                            {curso.incidencias.map((i) => {
                              const estado = ESTADOS_ASISTENCIA_CONFIG[i.estado];
                              return (
                                <li
                                  key={i.id}
                                  className="flex flex-wrap items-center justify-between gap-2 py-1.5"
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="text-foreground font-mono text-[11px]">
                                      {fechaCorta(i.fecha)}
                                    </span>
                                    <StatusBadge tone={estado.tone} dot size="sm">
                                      {estado.label}
                                    </StatusBadge>
                                    {i.justificacion && (
                                      <span className="text-muted-foreground text-[11px] italic">
                                        «{i.justificacion}»
                                      </span>
                                    )}
                                  </div>
                                  {onJustificar && i.estado === "falta" && (
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      className="h-6 rounded-md px-2 text-[11px]"
                                      onClick={() => onJustificar(i, curso.cursoNombre)}
                                    >
                                      Justificar
                                    </Button>
                                  )}
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      )}
    </PageState>
  );
}
