"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  StudentIcon,
  AlertCircleIcon,
  File02Icon,
  Megaphone01Icon,
  UserRemove01Icon,
  Exchange01Icon,
} from "@hugeicons/core-free-icons";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { KpiCard } from "./kpi-card";
import { DashboardChartEmpty } from "./dashboard-chart-empty";
import type { SecretariaDashboardData } from "../types/dashboard.types";

interface SecretariaDashboardViewProps {
  data: SecretariaDashboardData;
}

const chartConfigMatriculas = {
  matriculados: {
    label: "Matriculados",
    color: "#2563eb",
  },
} satisfies ChartConfig;

export function SecretariaDashboardView({ data }: SecretariaDashboardViewProps) {
  const { kpis, matriculasPorGrado, estudiantesConAlerta, comunicadosRecientes } = data;

  return (
    <div className="space-y-6">
      {/* KPIs de Secretaría (RF-021) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <KpiCard
          title="Matriculados"
          value={kpis.matriculasMes}
          subtitle="Matrícula activa del año"
          icon={StudentIcon}
          variant="primary"
        />

        <KpiCard
          title="Retiros y Traslados"
          value={kpis.retiradosMes + kpis.trasladadosMes}
          subtitle={`${kpis.retiradosMes} retiros · ${kpis.trasladadosMes} traslados`}
          icon={UserRemove01Icon}
        />

        <KpiCard
          title="Sin Apoderado"
          value={kpis.estudiantesSinApoderado}
          subtitle="Estudiantes registrados sin apoderado"
          icon={AlertCircleIcon}
          variant={kpis.estudiantesSinApoderado > 0 ? "warning" : undefined}
        />

        <KpiCard
          title="Sin Documento"
          value={kpis.estudiantesSinDocumento}
          subtitle="Sin DNI o documento registrado"
          icon={File02Icon}
          variant={kpis.estudiantesSinDocumento > 0 ? "warning" : undefined}
        />

        <KpiCard
          title="Asistencia Hoy"
          value={kpis.asistenciaHoyPorcentaje === null ? "—" : `${kpis.asistenciaHoyPorcentaje}%`}
          subtitle={
            kpis.asistenciaHoyPorcentaje === null
              ? "Hoy no se espera asistencia"
              : "Asistencia general del día"
          }
          icon={Exchange01Icon}
          variant="success"
        />
      </div>

      {/* Gráficos y Listas de Alertas */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Distribución de Matrículas por Grado */}
        <Card className="border-border/60 bg-card rounded-2xl shadow-xs lg:col-span-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Matrículas por Grado</CardTitle>
            <CardDescription className="text-xs">
              Alumnos registrados en el año lectivo
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            {matriculasPorGrado.length === 0 ? (
              <DashboardChartEmpty
                title="Sin datos de matrícula"
                description="No hay estudiantes registrados en este periodo."
                icon={StudentIcon}
              />
            ) : (
              <ChartContainer config={chartConfigMatriculas} className="max-h-64 w-full">
                <BarChart
                  data={matriculasPorGrado}
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
                    className="text-muted-foreground text-xs"
                    tickFormatter={(g) =>
                      g.replace("° de Secundaria", "°").replace("° de Primaria", "°")
                    }
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    className="text-muted-foreground text-xs"
                  />
                  <ChartTooltip
                    cursor={{ fill: "hsl(var(--muted)/0.3)" }}
                    content={<ChartTooltipContent />}
                  />
                  <Bar
                    dataKey="matriculados"
                    fill="#2563eb"
                    radius={[8, 8, 0, 0]}
                    maxBarSize={48}
                  />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        {/* Estudiantes con Alertas y Fichas Incompletas */}
        <Card className="border-border/60 bg-card rounded-2xl shadow-xs lg:col-span-6">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">
                  Fichas y Alertas Pendientes
                </CardTitle>
                <CardDescription className="text-xs">
                  Estudiantes que requieren regularización documentaria
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-muted-foreground text-[11px]">
                {estudiantesConAlerta.length} caso(s)
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {estudiantesConAlerta.length === 0 ? (
              <DashboardChartEmpty
                title="Todo al día"
                description="No hay estudiantes con fichas o documentos pendientes."
                icon={File02Icon}
              />
            ) : (
              <div className="divide-border/40 divide-y overflow-hidden rounded-xl border">
                {estudiantesConAlerta.map((e) => (
                  <div
                    key={e.id}
                    className="hover:bg-muted/30 flex items-center justify-between gap-3 p-3 text-xs transition-colors"
                  >
                    <div className="min-w-0 space-y-0.5">
                      <p className="text-foreground truncate font-semibold">{e.nombreCompleto}</p>
                      <p className="text-muted-foreground text-[11px]">
                        {e.grado} {e.seccion ? `· Sección ${e.seccion}` : ""}
                      </p>
                    </div>

                    <Badge
                      variant="secondary"
                      className={`shrink-0 text-[10px] font-semibold ${
                        e.tipoAlerta === "sin_apoderado"
                          ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                          : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                      }`}
                    >
                      {e.tipoAlerta === "sin_apoderado" ? "Sin apoderado" : "Sin documento"}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Comunicados Recientes */}
      {comunicadosRecientes && comunicadosRecientes.length > 0 && (
        <Card className="border-border/60 bg-card rounded-2xl shadow-xs">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HugeiconsIcon icon={Megaphone01Icon} className="text-primary size-4" />
                <CardTitle className="text-sm font-semibold">Comunicados Recientes</CardTitle>
              </div>
              <span className="text-muted-foreground text-xs">Módulo Comunicación</span>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 md:grid-cols-3">
              {comunicadosRecientes.map((c) => (
                <div
                  key={c.id}
                  className="bg-muted/30 border-border/40 hover:border-primary/40 rounded-xl border p-3 transition-colors"
                >
                  <p className="text-foreground line-clamp-1 text-xs font-semibold">{c.titulo}</p>
                  <p className="text-muted-foreground mt-1 text-[11px]">
                    {new Date(c.publicadoEn).toLocaleDateString("es-PE", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
