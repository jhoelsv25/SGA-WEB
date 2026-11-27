"use client";

import * as React from "react";
import Link from "next/link";
import { Cell, Pie, PieChart } from "recharts";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  BookOpen01Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  FileEditIcon,
  UserGroupIcon,
  ArrowRight01Icon,
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
import type { DocenteDashboardData } from "../types/dashboard.types";

interface DocenteDashboardViewProps {
  data: DocenteDashboardData;
}

const chartConfigEntregas = {
  cantidad: {
    label: "Entregas",
  },
  calificadas: {
    label: "Calificadas",
    color: "#10b981",
  },
  pendientes: {
    label: "Pendientes",
    color: "#f59e0b",
  },
} satisfies ChartConfig;

export function DocenteDashboardView({ data }: DocenteDashboardViewProps) {
  const { kpis, graficoEntregas, sesionesHoy, tareasPorCorregir } = data;

  const totalEntregasGrafico = graficoEntregas.reduce((acc, curr) => acc + curr.cantidad, 0);

  return (
    <div className="space-y-6">
      {/* Tarjetas de KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        <KpiCard
          title="Mis Cursos"
          value={kpis.misCursos}
          subtitle={`${kpis.misSecciones} ${kpis.misSecciones === 1 ? "sección asignada" : "secciones asignadas"}`}
          icon={BookOpen01Icon}
          variant="primary"
        />

        <KpiCard
          title="Mis Alumnos"
          value={kpis.misEstudiantes}
          subtitle="En todas tus secciones"
          icon={UserGroupIcon}
          variant="purple"
        />

        <KpiCard
          title="Sesiones de Hoy"
          value={`${kpis.sesionesHoyCompletadas}/${kpis.sesionesHoyTotal}`}
          subtitle={kpis.sesionesHoyTotal === 0 ? "Sin clases hoy" : "Clases del día"}
          icon={Clock01Icon}
          variant={
            kpis.sesionesHoyCompletadas === kpis.sesionesHoyTotal && kpis.sesionesHoyTotal > 0
              ? "success"
              : "info"
          }
        />

        <KpiCard
          title="Por Calificar"
          value={kpis.entregasPendientesCalificar}
          subtitle="Entregas de tareas pendientes"
          icon={FileEditIcon}
          variant={kpis.entregasPendientesCalificar > 0 ? "warning" : "success"}
          trend={{
            value: kpis.entregasPendientesCalificar > 0 ? "Atención" : "Al día",
            positive: kpis.entregasPendientesCalificar === 0,
          }}
        />

        <KpiCard
          title="Asistencia Media"
          value={`${kpis.porcentajeAsistenciaPromedio}%`}
          subtitle="Promedio en tus secciones"
          icon={CheckmarkCircle02Icon}
          variant="success"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Sesiones de Hoy */}
        <Card className="border-border/60 rounded-2xl lg:col-span-7">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">Tus Clases de Hoy</CardTitle>
                <CardDescription className="text-xs">
                  Horario y estado de tus sesiones asignadas
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-xs">
                {sesionesHoy.length} programadas
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {sesionesHoy.length === 0 ? (
              <div className="text-muted-foreground flex h-48 flex-col items-center justify-center gap-1.5 text-center text-sm">
                <p className="font-medium">No tienes sesiones programadas para hoy</p>
                <p className="text-xs">¡Disfruta tu jornada o aprovecha para calificar tareas!</p>
              </div>
            ) : (
              <div className="divide-border/50 divide-y">
                {sesionesHoy.map((sesion) => (
                  <div
                    key={sesion.id}
                    className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-foreground text-sm font-semibold">
                          {sesion.curso}
                        </span>
                        <Badge variant="secondary" className="text-[11px]">
                          {sesion.grado} {sesion.seccion}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-xs">
                        {sesion.horaInicio} - {sesion.horaFin}{" "}
                        {sesion.aula ? `· Aula: ${sesion.aula}` : ""}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          sesion.estado === "completada"
                            ? "default"
                            : sesion.estado === "en_curso"
                              ? "destructive"
                              : "outline"
                        }
                        className="text-xs capitalize"
                      >
                        {sesion.estado.replace("_", " ")}
                      </Badge>

                      <Button asChild size="sm" variant="ghost" className="h-8 gap-1 text-xs">
                        <Link href="/admin/mis-sesiones">
                          Ver
                          <HugeiconsIcon icon={ArrowRight01Icon} className="size-3.5" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Gráfico de Entregas */}
        <Card className="border-border/60 rounded-2xl lg:col-span-5">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Estado de Entregas de Tareas</CardTitle>
            <CardDescription className="text-xs">
              Proporción de tareas calificadas vs pendientes
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            {totalEntregasGrafico === 0 ? (
              <DashboardChartEmpty
                icon={FileEditIcon}
                title="Sin entregas de tareas"
                description="Tus estudiantes aún no han enviado tareas en este período."
                className="h-56"
              />
            ) : (
              <div className="flex flex-col items-center">
                <ChartContainer config={chartConfigEntregas} className="h-44 w-full">
                  <PieChart>
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          formatter={(val, name, item) => (
                            <div>
                              <p className="font-semibold">{item.payload.estado}</p>
                              <p className="text-muted-foreground text-xs">{val} entregas</p>
                            </div>
                          )}
                        />
                      }
                    />
                    <Pie
                      data={graficoEntregas}
                      dataKey="cantidad"
                      nameKey="estado"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={4}
                    >
                      {graficoEntregas.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.estado === "Calificadas" ? "#10b981" : "#f59e0b"}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ChartContainer>

                <div className="mt-2 flex items-center justify-center gap-4 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="size-2.5 rounded-full bg-emerald-500" />
                    <span className="text-muted-foreground">
                      Calificadas (
                      {graficoEntregas.find((g) => g.estado === "Calificadas")?.cantidad || 0})
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="size-2.5 rounded-full bg-amber-500" />
                    <span className="text-muted-foreground">
                      Pendientes (
                      {graficoEntregas.find((g) => g.estado === "Pendientes")?.cantidad || 0})
                    </span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tareas por corregir */}
      {tareasPorCorregir.length > 0 && (
        <Card className="border-border/60 rounded-2xl">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">
                  Tareas con Entregas Recientes
                </CardTitle>
                <CardDescription className="text-xs">
                  Revisa y califica los envíos de tus estudiantes
                </CardDescription>
              </div>
              <Button asChild variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
                <Link href="/admin/aula-virtual">
                  Ir al Aula Virtual
                  <HugeiconsIcon icon={ArrowRight01Icon} className="size-3.5" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {tareasPorCorregir.map((tarea) => (
                <div
                  key={tarea.id}
                  className="border-border/60 bg-muted/20 hover:border-primary/40 flex flex-col justify-between rounded-xl border p-4 transition-colors"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <Badge variant="outline" className="text-[11px]">
                        {tarea.seccion}
                      </Badge>
                      <span className="text-muted-foreground text-[11px]">{tarea.curso}</span>
                    </div>
                    <h3 className="text-foreground line-clamp-1 text-sm font-semibold">
                      {tarea.titulo}
                    </h3>
                  </div>

                  <div className="border-border/40 mt-4 flex items-center justify-between border-t pt-3 text-xs">
                    <div>
                      <span className="text-muted-foreground block text-[11px]">Entregas</span>
                      <span className="text-foreground font-semibold">
                        {tarea.entregadas} recibidas
                      </span>
                    </div>

                    <Button
                      asChild
                      size="sm"
                      variant="secondary"
                      className="h-7 text-xs font-medium"
                    >
                      <Link href={`/admin/aula-virtual?tareaId=${tarea.id}`}>Calificar</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
