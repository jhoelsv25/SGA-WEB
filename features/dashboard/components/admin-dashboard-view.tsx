"use client";

import * as React from "react";
import Link from "next/link";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  UserIcon,
  SecurityLockIcon,
  AlertCircleIcon,
  ComputerIcon,
  Time02Icon,
  CheckmarkCircle02Icon,
  Activity01Icon,
  ArrowRight01Icon,
  Database01Icon,
  ServerStack03Icon,
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

const chartConfigActividad = {
  totalEventos: {
    label: "Total Eventos",
    color: "#3b82f6",
  },
  iniciosSesion: {
    label: "Inicios de Sesión",
    color: "#10b981",
  },
  cambios: {
    label: "Cambios en Datos",
    color: "#8b5cf6",
  },
} satisfies ChartConfig;

export function AdminDashboardView({ data }: AdminDashboardViewProps) {
  const {
    kpis,
    distribucionRoles,
    ultimasAuditorias,
    actividadSemanal,
    equiposRecientes,
    servicios,
  } = data;

  const totalUsuarios = React.useMemo(
    () => distribucionRoles.reduce((acc, curr) => acc + curr.cantidad, 0),
    [distribucionRoles],
  );

  return (
    <div className="space-y-6">
      {/* Accesos Rápidos de Administración y Seguridad (RF-021 HU 1 y HU 5) */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <Link
          href="/admin/users"
          className="border-border/50 bg-card hover:border-primary/40 hover:bg-muted/40 group flex flex-col items-center justify-center gap-1.5 rounded-xl border p-3 text-center shadow-2xs transition-all"
        >
          <span className="bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground flex size-8 items-center justify-center rounded-lg transition-colors">
            <HugeiconsIcon icon={UserIcon} className="size-4" />
          </span>
          <span className="text-foreground text-xs font-semibold">Usuarios</span>
          <span className="text-muted-foreground text-[10px]">Gestión y accesos</span>
        </Link>

        <Link
          href="/admin/roles"
          className="border-border/50 bg-card hover:border-primary/40 hover:bg-muted/40 group flex flex-col items-center justify-center gap-1.5 rounded-xl border p-3 text-center shadow-2xs transition-all"
        >
          <span className="flex size-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 transition-colors group-hover:bg-purple-600 group-hover:text-white">
            <HugeiconsIcon icon={SecurityLockIcon} className="size-4" />
          </span>
          <span className="text-foreground text-xs font-semibold">Matriz Roles</span>
          <span className="text-muted-foreground text-[10px]">Permisos por menú</span>
        </Link>

        <Link
          href="/admin/audit"
          className="border-border/50 bg-card hover:border-primary/40 hover:bg-muted/40 group flex flex-col items-center justify-center gap-1.5 rounded-xl border p-3 text-center shadow-2xs transition-all"
        >
          <span className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
            <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-4" />
          </span>
          <span className="text-foreground text-xs font-semibold">Auditoría</span>
          <span className="text-muted-foreground text-[10px]">Eventos inmutables</span>
        </Link>

        <Link
          href="/admin/equipos"
          className="border-border/50 bg-card hover:border-primary/40 hover:bg-muted/40 group flex flex-col items-center justify-center gap-1.5 rounded-xl border p-3 text-center shadow-2xs transition-all"
        >
          <span className="flex size-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
            <HugeiconsIcon icon={ComputerIcon} className="size-4" />
          </span>
          <span className="text-foreground text-xs font-semibold">Equipos</span>
          <span className="text-muted-foreground text-[10px]">Control de red</span>
        </Link>

        <Link
          href="/admin/institucion"
          className="border-border/50 bg-card hover:border-primary/40 hover:bg-muted/40 group flex flex-col items-center justify-center gap-1.5 rounded-xl border p-3 text-center shadow-2xs transition-all"
        >
          <span className="flex size-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 transition-colors group-hover:bg-amber-600 group-hover:text-white">
            <HugeiconsIcon icon={Database01Icon} className="size-4" />
          </span>
          <span className="text-foreground text-xs font-semibold">Institución</span>
          <span className="text-muted-foreground text-[10px]">Variables y sede</span>
        </Link>

        <Link
          href="/admin/academic-years"
          className="border-border/50 bg-card hover:border-primary/40 hover:bg-muted/40 group flex flex-col items-center justify-center gap-1.5 rounded-xl border p-3 text-center shadow-2xs transition-all"
        >
          <span className="flex size-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-600 transition-colors group-hover:bg-cyan-600 group-hover:text-white">
            <HugeiconsIcon icon={ServerStack03Icon} className="size-4" />
          </span>
          <span className="text-foreground text-xs font-semibold">Año Escolar</span>
          <span className="text-muted-foreground text-[10px]">Ciclos y períodos</span>
        </Link>
      </div>

      {/* Alerta de Seguridad si hay cuentas bloqueadas */}
      {kpis.usuariosBloqueados > 0 && (
        <div className="flex items-center justify-between rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-800 dark:text-amber-300">
          <div className="flex items-center gap-2.5">
            <HugeiconsIcon
              icon={AlertCircleIcon}
              className="size-4 shrink-0 text-amber-600 dark:text-amber-400"
            />
            <span>
              <strong>Atención de Seguridad:</strong> Hay {kpis.usuariosBloqueados} cuenta(s)
              bloqueada(s) por intentos fallidos recurrentes.
            </span>
          </div>
          <Button asChild size="sm" variant="outline" className="h-7 border-amber-500/40 text-xs">
            <Link href="/admin/users">Desbloquear cuentas</Link>
          </Button>
        </div>
      )}

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

      {/* Gráficos Analíticos: Actividad Semanal + Distribución de Roles */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Actividad en la Bitácora de Auditoría (7 días) */}
        <Card className="border-border/60 bg-card rounded-2xl shadow-xs lg:col-span-7">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">
                  Actividad del Sistema (7 días)
                </CardTitle>
                <CardDescription className="text-xs">
                  Eventos y accesos registrados en la bitácora durante la última semana
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-muted-foreground gap-1 text-[11px]">
                <HugeiconsIcon icon={Activity01Icon} className="text-primary size-3" />
                Monitoreo activo
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            {!actividadSemanal || actividadSemanal.length === 0 ? (
              <DashboardChartEmpty
                title="Sin actividad registrada"
                description="No hay eventos en los últimos 7 días."
                icon={Activity01Icon}
              />
            ) : (
              <ChartContainer config={chartConfigActividad} className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={actividadSemanal}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="hsl(var(--border))"
                      opacity={0.4}
                    />
                    <XAxis
                      dataKey="dia"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      className="fill-muted-foreground text-[11px]"
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      className="fill-muted-foreground text-[11px]"
                      allowDecimals={false}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar
                      dataKey="iniciosSesion"
                      name="Inicios de Sesión"
                      fill="#10b981"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={28}
                    />
                    <Bar
                      dataKey="cambios"
                      name="Cambios en Datos"
                      fill="#3b82f6"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={28}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        {/* Distribución de Cuentas por Rol */}
        <Card className="border-border/60 bg-card rounded-2xl shadow-xs lg:col-span-5">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">Cuentas por Rol</CardTitle>
                <CardDescription className="text-xs">
                  Distribución de usuarios según su rol asignado
                </CardDescription>
              </div>
              <Badge variant="secondary" className="text-xs font-semibold">
                Total: {totalUsuarios}
              </Badge>
            </div>
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
                <div className="relative w-full">
                  <ChartContainer
                    config={chartConfigRoles}
                    className="mx-auto aspect-square max-h-52 w-full"
                  >
                    <PieChart>
                      <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                      <Pie
                        data={distribucionRoles}
                        dataKey="cantidad"
                        nameKey="rol"
                        innerRadius={54}
                        outerRadius={80}
                        strokeWidth={3}
                        stroke="hsl(var(--card))"
                      >
                        {distribucionRoles.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ChartContainer>
                  {/* Centro del donut con métrica total */}
                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-foreground text-2xl font-bold tracking-tight">
                      {totalUsuarios}
                    </span>
                    <span className="text-muted-foreground text-[10px] font-medium tracking-wider uppercase">
                      Usuarios
                    </span>
                  </div>
                </div>

                <div className="mt-2 flex flex-wrap justify-center gap-1.5">
                  {distribucionRoles.map((r) => (
                    <div
                      key={r.rol}
                      className="bg-muted/40 border-border/50 flex items-center gap-1.5 rounded-lg border px-2 py-0.5 text-xs"
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
      </div>

      {/* Fila 3: Bitácora de Auditoría + Salud de Servicios + Equipos */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
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
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-muted-foreground gap-1 text-[11px]">
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-3 text-emerald-500" />
                  Inmutable
                </Badge>
                <Button asChild variant="ghost" size="sm" className="text-primary h-7 text-xs">
                  <Link href="/admin/audit">
                    Ver todo
                    <HugeiconsIcon icon={ArrowRight01Icon} className="ml-1 size-3" />
                  </Link>
                </Button>
              </div>
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
                    className="hover:bg-muted/30 flex items-center justify-between gap-3 p-2.5 text-xs transition-colors"
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

        {/* Panel Lateral: Estado de Salud del Sistema + Equipos Recientes */}
        <div className="space-y-6 lg:col-span-5">
          {/* Estado Operativo del Sistema */}
          <Card className="border-border/60 bg-card rounded-2xl shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Estado Operativo</CardTitle>
              <CardDescription className="text-xs">
                Disponibilidad y estado de los servicios institucionales
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2.5 pt-0">
              {(servicios || []).map((s) => (
                <div
                  key={s.nombre}
                  className="bg-muted/30 border-border/40 flex items-center justify-between rounded-xl border p-2.5 text-xs"
                >
                  <div className="min-w-0 pr-2">
                    <p className="text-foreground truncate font-medium">{s.nombre}</p>
                    <p className="text-muted-foreground truncate text-[11px]">{s.detalle}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    {s.estado === "operacional" ? (
                      <>
                        <span className="relative flex size-2">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                        </span>
                        <span className="text-[11px] font-medium text-emerald-600 capitalize dark:text-emerald-400">
                          Operacional
                        </span>
                      </>
                    ) : s.estado === "degradado" ? (
                      <>
                        <span className="relative flex size-2">
                          <span className="relative inline-flex size-2 rounded-full bg-amber-500" />
                        </span>
                        <span className="text-[11px] font-medium text-amber-600 capitalize dark:text-amber-400">
                          Atención
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="relative flex size-2">
                          <span className="relative inline-flex size-2 rounded-full bg-rose-500" />
                        </span>
                        <span className="text-[11px] font-medium text-rose-600 capitalize dark:text-rose-400">
                          Inactivo
                        </span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Dispositivos y Equipos Recientes */}
          <Card className="border-border/60 bg-card rounded-2xl shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold">Equipos en Red</CardTitle>
                  <CardDescription className="text-xs">
                    Dispositivos registrados recientemente
                  </CardDescription>
                </div>
                <Button asChild variant="ghost" size="sm" className="text-primary h-7 text-xs">
                  <Link href="/admin/equipos">
                    Gestionar
                    <HugeiconsIcon icon={ArrowRight01Icon} className="ml-1 size-3" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
              {!equiposRecientes || equiposRecientes.length === 0 ? (
                <p className="text-muted-foreground py-3 text-center text-xs">
                  No hay dispositivos registrados aún.
                </p>
              ) : (
                equiposRecientes.map((eq) => (
                  <div
                    key={eq.id}
                    className="hover:bg-muted/40 border-border/30 flex items-center justify-between rounded-xl border p-2 text-xs transition-colors"
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="bg-primary/10 text-primary flex size-7 shrink-0 items-center justify-center rounded-lg">
                        <HugeiconsIcon icon={ComputerIcon} className="size-3.5" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-foreground truncate font-medium">{eq.nombre}</p>
                        <p className="text-muted-foreground truncate text-[10px]">
                          {eq.tipo}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={eq.autorizado ? "outline" : "secondary"}
                      className={
                        eq.autorizado
                          ? "border-emerald-500/40 text-[10px] text-emerald-600"
                          : "text-[10px]"
                      }
                    >
                      {eq.autorizado ? "Autorizado" : "Pendiente"}
                    </Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
