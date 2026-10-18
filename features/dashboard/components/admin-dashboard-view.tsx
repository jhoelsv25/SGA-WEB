"use client";

import * as React from "react";
import { Cell, Pie, PieChart } from "recharts";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  UserIcon,
  SecurityLockIcon,
  AlertCircleIcon,
  ComputerIcon,
  Time02Icon,
  CheckmarkCircle02Icon,
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
import type { AdminDashboardData } from "../types/dashboard.types";

interface AdminDashboardViewProps {
  data: AdminDashboardData;
}

const chartConfigRoles = {
  cantidad: {
    label: "Usuarios",
    color: "#3b82f6",
  },
} satisfies ChartConfig;

export function AdminDashboardView({ data }: AdminDashboardViewProps) {
  const { kpis, distribucionRoles, ultimasAuditorias } = data;

  return (
    <div className="space-y-6">
      {/* KPIs de Seguridad y Cuentas (RF-021) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <KpiCard
          title="Cuentas Activas"
          value={kpis.usuariosActivos}
          subtitle={`De un total de ${kpis.totalUsuarios} usuarios`}
          icon={UserIcon}
          variant="primary"
        />

        <KpiCard
          title="Cuentas Bloqueadas"
          value={kpis.usuariosBloqueados}
          subtitle="Por intentos fallidos o admin"
          icon={AlertCircleIcon}
          variant={kpis.usuariosBloqueados > 0 ? "warning" : undefined}
        />

        <KpiCard
          title="Intentos Fallidos"
          value={kpis.intentosFallidosHoy}
          subtitle="En los inicios de sesión"
          icon={SecurityLockIcon}
          variant={kpis.intentosFallidosHoy > 5 ? "warning" : undefined}
        />

        <KpiCard
          title="Sin Acceso >30d"
          value={kpis.sinAcceso30Dias}
          subtitle="Cuentas sin actividad reciente"
          icon={Time02Icon}
        />

        <KpiCard
          title="Equipos Autorizados"
          value={kpis.equiposActivos}
          subtitle={`De ${kpis.totalEquipos} dispositivos`}
          icon={ComputerIcon}
          variant="success"
        />
      </div>

      {/* Gráficos y Listas de Auditoría */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Distribución de Cuentas por Rol */}
        <Card className="border-border/60 bg-card rounded-2xl shadow-xs lg:col-span-5">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Cuentas por Rol</CardTitle>
            <CardDescription className="text-xs">
              Distribución de usuarios según su rol asignado
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            {distribucionRoles.length === 0 ? (
              <DashboardChartEmpty
                title="Sin roles registrados"
                description="No hay información de roles con cuentas activas."
                icon={UserIcon}
              />
            ) : (
              <div className="flex flex-col items-center">
                <ChartContainer
                  config={chartConfigRoles}
                  className="mx-auto aspect-square max-h-56 w-full"
                >
                  <PieChart>
                    <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                    <Pie
                      data={distribucionRoles}
                      dataKey="cantidad"
                      nameKey="rol"
                      innerRadius={50}
                      outerRadius={78}
                      strokeWidth={3}
                      stroke="hsl(var(--card))"
                    >
                      {distribucionRoles.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                  </PieChart>
                </ChartContainer>

                <div className="mt-2 flex flex-wrap justify-center gap-2">
                  {distribucionRoles.map((r) => (
                    <div
                      key={r.rol}
                      className="bg-muted/40 border-border/50 flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs"
                    >
                      <span className="size-2 rounded-full" style={{ backgroundColor: r.fill }} />
                      <span className="text-foreground font-medium">{r.rol}</span>
                      <span className="text-muted-foreground font-semibold">({r.cantidad})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Últimas Acciones en Bitácora de Auditoría */}
        <Card className="border-border/60 bg-card rounded-2xl shadow-xs lg:col-span-7">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">
                  Bitácora de Auditoría Reciente
                </CardTitle>
                <CardDescription className="text-xs">
                  Últimos eventos y cambios registrados en el sistema
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-muted-foreground gap-1 text-[11px]">
                <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-3 text-emerald-500" />
                Inmutable
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {ultimasAuditorias.length === 0 ? (
              <DashboardChartEmpty
                title="Sin eventos registrados"
                description="Aún no se han generado registros en la bitácora."
                icon={SecurityLockIcon}
              />
            ) : (
              <div className="divide-border/40 divide-y overflow-hidden rounded-xl border">
                {ultimasAuditorias.map((item) => (
                  <div
                    key={item.id}
                    className="hover:bg-muted/30 flex items-center justify-between gap-3 p-3 text-xs transition-colors"
                  >
                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className="bg-primary/10 text-primary font-mono text-[10px] font-semibold uppercase"
                        >
                          {item.accion}
                        </Badge>
                        <span className="text-foreground truncate font-medium">{item.tabla}</span>
                      </div>
                      <p className="text-muted-foreground truncate text-[11px]">
                        Por: <span className="text-foreground">{item.usuarioNombre}</span>
                        {item.ip ? ` · IP ${item.ip}` : ""}
                      </p>
                    </div>

                    <span className="text-muted-foreground shrink-0 text-[11px]">
                      {new Date(item.fecha).toLocaleTimeString("es-PE", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
