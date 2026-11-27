"use client";

import * as React from "react";
import Link from "next/link";
import { Cell, Pie, PieChart } from "recharts";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CheckmarkCircle02Icon,
  Clock01Icon,
  FileEditIcon,
  ArrowRight01Icon,
  AlertCircleIcon,
} from "@hugeicons/core-free-icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { KpiCard } from "./kpi-card";
import { DashboardChartEmpty } from "./dashboard-chart-empty";
import type { EstudianteDashboardData } from "../types/dashboard.types";

interface EstudianteDashboardViewProps {
  data: EstudianteDashboardData;
  /** El apoderado ve los datos de su hijo(a): los textos no le hablan como si fuera el estudiante. */
  esApoderado?: boolean;
}

const chartConfigTareas = {
  cantidad: {
    label: "Tareas",
  },
  entregadas: {
    label: "Entregadas",
    color: "#10b981",
  },
  pendientes: {
    label: "Pendientes",
    color: "#f59e0b",
  },
} satisfies ChartConfig;

export function EstudianteDashboardView({
  data,
  esApoderado = false,
}: EstudianteDashboardViewProps) {
  const { kpis, graficoTareas, proximasTareas, horarioHoy } = data;

  const totalTareas = kpis.tareasPendientes + kpis.tareasEntregadas;
  // Sin ninguna marca todavía no hay porcentaje que mostrar (la API devuelve 100 por defecto).
  const sinAsistencia = kpis.presentes + kpis.tardanzas + kpis.faltas + kpis.justificadas === 0;

  return (
    <div className="space-y-6">
      {/* Tarjetas de KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title={esApoderado ? "Asistencia" : "Mi Asistencia"}
          value={sinAsistencia ? "—" : `${kpis.porcentajeAsistencia}%`}
          subtitle={`${kpis.presentes} asistencias · ${kpis.tardanzas} tardanzas · ${kpis.faltas} faltas`}
          icon={CheckmarkCircle02Icon}
          variant={sinAsistencia || kpis.porcentajeAsistencia >= 90 ? "success" : "warning"}
          trend={
            sinAsistencia
              ? { value: "Sin registros", neutral: true }
              : {
                  value: kpis.porcentajeAsistencia >= 90 ? "Excelente" : "Regular",
                  positive: kpis.porcentajeAsistencia >= 90,
                }
          }
        />

        <KpiCard
          title="Tareas Pendientes"
          value={kpis.tareasPendientes}
          subtitle={
            kpis.tareasPendientes === 0
              ? esApoderado
                ? "Está al día"
                : "¡Estás al día!"
              : "Tareas por entregar"
          }
          icon={AlertCircleIcon}
          variant={kpis.tareasPendientes > 0 ? "warning" : "success"}
          trend={{
            value: kpis.tareasPendientes > 0 ? "Por entregar" : "Sin pendientes",
            positive: kpis.tareasPendientes === 0,
          }}
        />

        <KpiCard
          title="Tareas Entregadas"
          value={kpis.tareasEntregadas}
          subtitle="Envíos registrados este año"
          icon={FileEditIcon}
          variant="primary"
        />

        <KpiCard
          title="Clases de Hoy"
          value={horarioHoy.length}
          subtitle={horarioHoy.length > 0 ? "Sesiones programadas" : "Sin clases hoy"}
          icon={Clock01Icon}
          variant="info"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Próximas Tareas */}
        <Card className="border-border/60 rounded-2xl lg:col-span-7">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">
                  {esApoderado ? "Actividades y Tareas" : "Tus Actividades y Tareas"}
                </CardTitle>
                <CardDescription className="text-xs">
                  Seguimiento de entregas y evaluaciones próximas
                </CardDescription>
              </div>
              <Button asChild variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
                <Link href="/admin/aula-virtual">
                  Ver todo
                  <HugeiconsIcon icon={ArrowRight01Icon} className="size-3.5" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {proximasTareas.length === 0 ? (
              <div className="text-muted-foreground flex h-48 flex-col items-center justify-center gap-1.5 text-center text-sm">
                <p className="font-medium">
                  {esApoderado
                    ? "No tiene tareas asignadas por el momento"
                    : "No tienes tareas asignadas por el momento"}
                </p>
                <p className="text-xs">
                  {esApoderado
                    ? "Revise más tarde las publicaciones de los profesores."
                    : "Revisa más tarde las publicaciones de tus profesores."}
                </p>
              </div>
            ) : (
              <div className="divide-border/50 divide-y">
                {proximasTareas.map((tarea) => {
                  const fechaObj = new Date(tarea.fechaLimite);
                  const fechaFormateada = isNaN(fechaObj.getTime())
                    ? tarea.fechaLimite
                    : fechaObj.toLocaleDateString("es-PE", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      });

                  return (
                    <div
                      key={tarea.id}
                      className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-foreground text-sm font-semibold">
                            {tarea.titulo}
                          </span>
                          <Badge variant="outline" className="text-[11px]">
                            {tarea.curso}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-xs">Vence: {fechaFormateada}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        {tarea.estadoEntrega === "calificada" && tarea.nota !== null ? (
                          <Badge variant="default" className="bg-emerald-600 text-xs">
                            Nota: {tarea.nota}/{tarea.puntajeMaximo}
                          </Badge>
                        ) : tarea.estadoEntrega === "entregada" ? (
                          <Badge variant="secondary" className="text-xs">
                            Entregada
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="border-amber-500/40 text-xs text-amber-600 dark:text-amber-400"
                          >
                            Pendiente
                          </Badge>
                        )}

                        <Button asChild size="sm" variant="ghost" className="h-8 gap-1 text-xs">
                          <Link href={`/admin/aula-virtual?tareaId=${tarea.id}`}>
                            {tarea.estadoEntrega === "pendiente" ? "Entregar" : "Ver"}
                            <HugeiconsIcon icon={ArrowRight01Icon} className="size-3.5" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Gráfico y Horario de hoy */}
        <div className="space-y-6 lg:col-span-5">
          {/* Gráfico de Cumplimiento */}
          <Card className="border-border/60 rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Cumplimiento de Tareas</CardTitle>
              <CardDescription className="text-xs">
                Proporción de actividades enviadas vs pendientes
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              {totalTareas === 0 ? (
                <DashboardChartEmpty
                  icon={CheckmarkCircle02Icon}
                  title="Sin tareas registradas"
                  description={
                    esApoderado
                      ? "No tiene tareas pendientes ni evaluaciones programadas."
                      : "No tienes tareas pendientes ni evaluaciones programadas."
                  }
                  className="h-44"
                />
              ) : (
                <div className="flex flex-col items-center">
                  <ChartContainer config={chartConfigTareas} className="h-36 w-full">
                    <PieChart>
                      <ChartTooltip
                        content={
                          <ChartTooltipContent
                            formatter={(val, name, item) => (
                              <div>
                                <p className="font-semibold">{item.payload.estado}</p>
                                <p className="text-muted-foreground text-xs">{val} tareas</p>
                              </div>
                            )}
                          />
                        }
                      />
                      <Pie
                        data={graficoTareas}
                        dataKey="cantidad"
                        nameKey="estado"
                        innerRadius={45}
                        outerRadius={65}
                        paddingAngle={4}
                      >
                        {graficoTareas.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.estado === "Entregadas" ? "#10b981" : "#f59e0b"}
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </ChartContainer>

                  <div className="mt-2 flex items-center justify-center gap-4 text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="size-2.5 rounded-full bg-emerald-500" />
                      <span className="text-muted-foreground">
                        Entregadas ({kpis.tareasEntregadas})
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="size-2.5 rounded-full bg-amber-500" />
                      <span className="text-muted-foreground">
                        Pendientes ({kpis.tareasPendientes})
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Clases de Hoy */}
          <Card className="border-border/60 rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Horario de Hoy</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {horarioHoy.length === 0 ? (
                <p className="text-muted-foreground py-2 text-xs">
                  {esApoderado
                    ? "No tiene clases programadas para hoy."
                    : "No tienes clases programadas para hoy."}
                </p>
              ) : (
                <div className="divide-border/40 divide-y text-xs">
                  {horarioHoy.map((clase) => (
                    <div key={clase.id} className="flex items-center justify-between py-2">
                      <div>
                        <span className="text-foreground font-medium">{clase.curso}</span>
                        <p className="text-muted-foreground text-[11px]">
                          {clase.docente ? `Prof. ${clase.docente}` : ""}{" "}
                          {clase.aula ? `· Aula: ${clase.aula}` : ""}
                        </p>
                      </div>
                      <span className="text-muted-foreground font-mono">
                        {clase.horaInicio} - {clase.horaFin}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
