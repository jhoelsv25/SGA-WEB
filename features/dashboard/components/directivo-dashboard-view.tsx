"use client";

import * as React from "react";
import Link from "next/link";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  StudentIcon,
  TeacherIcon,
  CheckmarkCircle02Icon,
  BookOpen01Icon,
  Clock01Icon,
  AlertCircleIcon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { KpiCard } from "./kpi-card";
import { DashboardChartEmpty } from "./dashboard-chart-empty";
import type { DirectivoDashboardData } from "../types/dashboard.types";

interface DirectivoDashboardViewProps {
  data: DirectivoDashboardData;
}

const chartConfigAsistencia = {
  porcentaje: {
    label: "Tasa de Asistencia (%)",
    color: "#2563eb",
  },
} satisfies ChartConfig;

const chartConfigGrados = {
  matriculados: {
    label: "Estudiantes Matriculados",
    color: "#6366f1",
  },
} satisfies ChartConfig;

export function DirectivoDashboardView({ data }: DirectivoDashboardViewProps) {
  const { kpis, graficoAsistencia, distribucionGrados, alertasDelDia, docentesSemaforo } = data;
  // La API devuelve 100 % cuando nadie debía marcar todavía; sin datos se muestra «—».
  const sinAsistenciaHoy =
    kpis.asistenciaHoy.totalEsperado === 0 ||
    kpis.asistenciaHoy.presentes +
      kpis.asistenciaHoy.tardanzas +
      kpis.asistenciaHoy.faltas +
      kpis.asistenciaHoy.justificados ===
      0;

  return (
    <div className="space-y-6">
      {/* Alertas del Día (RF-021 HU-021-02: aparecen primero) */}
      {alertasDelDia && alertasDelDia.length > 0 && (
        <div className="space-y-2">
          {alertasDelDia.map((alerta, i) => (
            <div
              key={i}
              className={`flex items-center justify-between rounded-xl border p-3.5 text-xs ${
                alerta.nivel === "warning"
                  ? "border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-300"
                  : alerta.nivel === "danger"
                    ? "border-rose-500/30 bg-rose-500/10 text-rose-800 dark:text-rose-300"
                    : "border-blue-500/30 bg-blue-500/10 text-blue-800 dark:text-blue-300"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <HugeiconsIcon
                  icon={AlertCircleIcon}
                  className={`size-4 shrink-0 ${
                    alerta.nivel === "warning"
                      ? "text-amber-600 dark:text-amber-400"
                      : alerta.nivel === "danger"
                        ? "text-rose-600 dark:text-rose-400"
                        : "text-blue-600 dark:text-blue-400"
                  }`}
                />
                <div>
                  <span className="font-semibold">{alerta.titulo}: </span>
                  <span>{alerta.detalle}</span>
                </div>
              </div>
              <Button asChild size="sm" variant="outline" className="bg-background h-7 text-xs">
                <Link href={alerta.enlace}>
                  Ver detalle
                  <HugeiconsIcon icon={ArrowRight01Icon} className="ml-1 size-3" />
                </Link>
              </Button>
            </div>
          ))}
        </div>
      )}
      {/* Indicadores de la Tesis (RF-020 / RF-021) */}
      {data.indicadoresTesis && data.indicadoresTesis.length > 0 && (
        <section aria-labelledby="titulo-indicadores-tesis" className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h2
              id="titulo-indicadores-tesis"
              className="text-foreground text-sm font-semibold tracking-tight"
            >
              Indicadores Principales de Gestión (Tesis)
            </h2>
            <span className="text-muted-foreground text-[11px]">
              Seguimiento antes (Pretest) vs con sistema (Postest)
            </span>
          </div>
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
            {data.indicadoresTesis.map((ind) => (
              <Card
                key={ind.codigo}
                className="border-border/50 bg-card hover:bg-card rounded-2xl p-4 shadow-2xs transition-all"
              >
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <span className="text-primary bg-primary/10 rounded-md px-2 py-0.5 text-xs font-bold tracking-wide">
                    {ind.codigo}
                  </span>
                  <span className="text-muted-foreground bg-muted/50 rounded-full px-2 py-0.5 text-[10px] font-medium">
                    {ind.estado === "cerrado" ? "Medición congelada" : "En curso"}
                  </span>
                </div>
                <p className="text-foreground mb-2 line-clamp-1 text-xs font-semibold">
                  {ind.nombre}
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-foreground text-2xl font-bold tracking-tight">
                    {ind.porcentaje}%
                  </span>
                  {ind.variacionPuntos != null && (
                    <span
                      className={`text-xs font-semibold ${
                        ind.variacionPuntos >= 0
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-rose-600 dark:text-rose-400"
                      }`}
                    >
                      {ind.variacionPuntos >= 0 ? `+${ind.variacionPuntos}` : ind.variacionPuntos}{" "}
                      pts
                    </span>
                  )}
                </div>
                {ind.pretestPorcentaje != null && (
                  <p className="text-muted-foreground mt-1 text-[11px]">
                    Pretest histórico:{" "}
                    <span className="text-foreground font-medium">{ind.pretestPorcentaje}%</span>
                  </p>
                )}
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Tarjetas de KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <KpiCard
          title="Estudiantes"
          value={kpis.totalMatriculados}
          subtitle="Matrícula activa vigente"
          icon={StudentIcon}
          variant="primary"
        />

        <KpiCard
          title="Plana Docente"
          value={kpis.totalDocentes}
          subtitle={`${kpis.totalSecciones} secciones activas`}
          icon={TeacherIcon}
          variant="purple"
        />

        <KpiCard
          title="Asistencia Hoy"
          value={sinAsistenciaHoy ? "—" : `${kpis.asistenciaHoy.porcentaje}%`}
          subtitle={
            sinAsistenciaHoy
              ? "Aún no hay marcaciones hoy"
              : `${kpis.asistenciaHoy.presentes} presentes · ${kpis.asistenciaHoy.faltas} faltas`
          }
          icon={CheckmarkCircle02Icon}
          variant={sinAsistenciaHoy || kpis.asistenciaHoy.porcentaje >= 90 ? "success" : "warning"}
          trend={
            sinAsistenciaHoy
              ? undefined
              : {
                  value: `${kpis.asistenciaHoy.presentes + kpis.asistenciaHoy.tardanzas}/${kpis.asistenciaHoy.totalEsperado}`,
                  positive: kpis.asistenciaHoy.porcentaje >= 90,
                }
          }
        />

        <KpiCard
          title="Aula Virtual"
          value={kpis.aulaVirtual.totalTareas}
          subtitle={`${kpis.aulaVirtual.totalEntregas} entregas recibidas`}
          icon={BookOpen01Icon}
          variant="info"
        />

        <KpiCard
          title="Sesiones de Hoy"
          value={`${kpis.sesionesHoy.completadas}/${kpis.sesionesHoy.programadas}`}
          subtitle={
            kpis.sesionesHoy.programadas === 0
              ? "Sin clases programadas hoy"
              : `${kpis.sesionesHoy.porcentajeCumplimiento}% de avance`
          }
          icon={Clock01Icon}
          variant={kpis.sesionesHoy.porcentajeCumplimiento >= 80 ? "success" : "primary"}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Card className="border-border/60 rounded-2xl lg:col-span-7">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">
              Evolución Mensual de Asistencia Escolar
            </CardTitle>
            <CardDescription className="text-xs">
              Porcentaje promedio de asistencia de los estudiantes por mes
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            {graficoAsistencia.length === 0 ? (
              <DashboardChartEmpty
                icon={CheckmarkCircle02Icon}
                title="Sin registros de asistencia"
                description="No hay asistencias computadas para el período o fechas seleccionadas."
              />
            ) : (
              <ChartContainer config={chartConfigAsistencia} className="h-64 w-full">
                <AreaChart
                  data={graficoAsistencia}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorAsistencia" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-porcentaje)" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="var(--color-porcentaje)" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    className="stroke-muted/40"
                  />
                  <XAxis
                    dataKey="etiqueta"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    className="text-muted-foreground text-xs"
                  />
                  <YAxis
                    domain={[60, 100]}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `${v}%`}
                    className="text-muted-foreground text-xs"
                  />
                  <ChartTooltip
                    cursor={{ stroke: "hsl(var(--muted-foreground))", strokeWidth: 1 }}
                    content={
                      <ChartTooltipContent
                        formatter={(val, name, item) => (
                          <div className="space-y-0.5">
                            <p className="font-semibold">
                              {item.payload.etiqueta}: {val}%
                            </p>
                            <p className="text-muted-foreground text-[11px]">
                              Presentes: {item.payload.presentes} · Tardanzas:{" "}
                              {item.payload.tardanzas} · Faltas: {item.payload.faltas}
                            </p>
                          </div>
                        )}
                      />
                    }
                  />
                  <Area
                    type="monotone"
                    dataKey="porcentaje"
                    stroke="var(--color-porcentaje)"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorAsistencia)"
                  />
                </AreaChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        {/* Gráfico 2: Distribución por Grados */}
        <Card className="border-border/60 rounded-2xl lg:col-span-5">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">
              Distribución de Estudiantes por Grado
            </CardTitle>
            <CardDescription className="text-xs">
              Alumnos matriculados en cada nivel formativo
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            {distribucionGrados.length === 0 ? (
              <DashboardChartEmpty
                icon={StudentIcon}
                title="Sin estudiantes matriculados"
                description="No hay estudiantes activos en las secciones correspondientes a este ciclo."
              />
            ) : (
              <ChartContainer config={chartConfigGrados} className="h-64 w-full">
                <BarChart
                  data={distribucionGrados}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    className="stroke-muted/40"
                  />
                  <XAxis
                    dataKey="grado"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(g) =>
                      g.replace("° de Secundaria", "°").replace("° de Primaria", "°")
                    }
                    className="text-muted-foreground text-xs"
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    className="text-muted-foreground text-xs"
                  />
                  <ChartTooltip
                    cursor={{ fill: "hsl(var(--muted)/0.3)" }}
                    content={
                      <ChartTooltipContent
                        formatter={(val, name, item) => (
                          <div>
                            <p className="font-semibold">{item.payload.grado}</p>
                            <p className="text-muted-foreground text-xs">
                              {val} estudiantes ({item.payload.porcentaje}%)
                            </p>
                          </div>
                        )}
                      />
                    }
                  />
                  <Bar
                    dataKey="matriculados"
                    fill="#6366f1"
                    radius={[8, 8, 0, 0]}
                    maxBarSize={48}
                  />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Semáforo de Cumplimiento por Docente (RF-021 HU-021-02 / RF-013) */}
      {docentesSemaforo && docentesSemaforo.length > 0 && (
        <Card className="border-border/60 bg-card rounded-2xl shadow-xs">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">
                  Semáforo de Cumplimiento por Docente
                </CardTitle>
                <CardDescription className="text-xs">
                  Seguimiento del registro de sesiones planificadas
                </CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm" className="text-primary h-7 text-xs">
                <Link href="/admin/consolidados-docentes">
                  Ficha completa
                  <HugeiconsIcon icon={ArrowRight01Icon} className="ml-1 size-3" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {docentesSemaforo.map((doc) => (
                <div
                  key={doc.docenteId}
                  className="bg-muted/30 border-border/40 hover:border-primary/40 flex flex-col justify-between rounded-xl border p-3 text-xs transition-all"
                >
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="text-foreground truncate font-semibold">
                      {doc.docenteNombre}
                    </span>
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-bold uppercase ${
                        doc.estado === "verde"
                          ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600"
                          : doc.estado === "amarillo"
                            ? "border-amber-500/40 bg-amber-500/10 text-amber-600"
                            : "border-rose-500/40 bg-rose-500/10 text-rose-600"
                      }`}
                    >
                      {doc.porcentajeCumplimiento}%
                    </Badge>
                  </div>

                  <div className="space-y-1.5">
                    {/* Barra de progreso visual */}
                    <div className="bg-muted h-1.5 w-full overflow-hidden rounded-full">
                      <div
                        className={`h-full rounded-full ${
                          doc.estado === "verde"
                            ? "bg-emerald-500"
                            : doc.estado === "amarillo"
                              ? "bg-amber-500"
                              : "bg-rose-500"
                        }`}
                        style={{ width: `${Math.min(100, doc.porcentajeCumplimiento)}%` }}
                      />
                    </div>
                    <div className="text-muted-foreground flex items-center justify-between text-[11px]">
                      <span>
                        {doc.sesionesRegistradas} de {doc.totalSesiones} sesiones
                      </span>
                      <Link
                        href={`/admin/consolidados-docentes?docenteId=${doc.docenteId}`}
                        className="text-primary inline-flex items-center gap-0.5 font-medium hover:underline"
                      >
                        Seguimiento
                        <HugeiconsIcon icon={ArrowRight01Icon} className="size-2.5" />
                      </Link>
                    </div>
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
