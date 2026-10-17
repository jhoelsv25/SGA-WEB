"use client";

import * as React from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  StudentIcon,
  TeacherIcon,
  CheckmarkCircle02Icon,
  BookOpen01Icon,
  Clock01Icon,
} from "@hugeicons/core-free-icons";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
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
  const { kpis, graficoAsistencia, distribucionGrados } = data;

  return (
    <div className="space-y-6">
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
          value={`${kpis.asistenciaHoy.porcentaje}%`}
          subtitle={`${kpis.asistenciaHoy.presentes} presentes · ${kpis.asistenciaHoy.faltas} faltas`}
          icon={CheckmarkCircle02Icon}
          variant={kpis.asistenciaHoy.porcentaje >= 90 ? "success" : "warning"}
          trend={{
            value: `${kpis.asistenciaHoy.presentes + kpis.asistenciaHoy.tardanzas}/${kpis.asistenciaHoy.totalEsperado}`,
            positive: kpis.asistenciaHoy.porcentaje >= 90,
          }}
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
          subtitle={`${kpis.sesionesHoy.porcentajeCumplimiento}% de avance`}
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
    </div>
  );
}
