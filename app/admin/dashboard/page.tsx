"use client";

import * as React from "react";
import Link from "next/link";
import { siteConfig, type UserRole } from "@/config";
import { useDashboardRole } from "@/components/layouts";
import { useAnioLectivo } from "@/features/anio-escolar/anio-lectivo-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  UserGroupIcon,
  Book02Icon,
  CheckmarkCircle02Icon,
  Award01Icon,
  Clock01Icon,
  Calendar03Icon,
  TeacherIcon,
  School01Icon,
  Notification01Icon,
  ArrowRight01Icon,
  SparklesIcon,
  ShieldCheckIcon,
  File01Icon,
} from "@hugeicons/core-free-icons";

interface RoleOption {
  role: UserRole;
  label: string;
}

const ROLE_OPTIONS: RoleOption[] = [
  { role: "teacher", label: "Docente" },
  { role: "student", label: "Estudiante" },
  { role: "principal", label: "Directora" },
  { role: "admin", label: "Administrador" },
  { role: "parent", label: "Apoderada" },
];

export default function DashboardPage() {
  const { role, setRole, user } = useDashboardRole();
  const { anio: anioVigente } = useAnioLectivo();
  const bimestreEnCurso = anioVigente?.bimestres.find((bimestre) => bimestre.estado === "en_curso");
  const etiquetaAnio = anioVigente
    ? `Año Lectivo ${anioVigente.anio}${bimestreEnCurso ? ` · Bimestre ${bimestreEnCurso.nombre}` : ""}`
    : null;

  return (
    <div className="space-y-6">
      {/* 1. Cabecera de Bienvenida con Switcher de Roles Interactivos */}
      <div className="border-border/60 bg-card/60 relative overflow-hidden rounded-2xl border p-5 shadow-xs backdrop-blur-xs sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-primary/10 text-primary border-primary/20 inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-bold tracking-widest uppercase">
                {siteConfig.institution.badge}
              </span>
              {etiquetaAnio ? (
                <Badge variant="outline" className="text-[10px] font-semibold">
                  {etiquetaAnio}
                </Badge>
              ) : null}
            </div>
            <h1 className="text-foreground text-2xl font-black tracking-tight sm:text-3xl">
              ¡Bienvenido, {user.name}!
            </h1>
            <p className="text-muted-foreground text-xs sm:text-sm">
              Plataforma activa para el control pedagógico, registro escolar y seguimiento
              institucional.
            </p>
          </div>

          {/* Switcher de Roles para Demostración */}
          <div className="flex flex-col gap-1.5 self-start lg:items-end">
            <span className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
              Vista previa por rol:
            </span>
            <div className="bg-muted/60 border-border inline-flex flex-wrap items-center gap-1 rounded-xl border p-1 shadow-inner">
              {ROLE_OPTIONS.map((opt) => {
                const isSelected = role === opt.role;
                return (
                  <button
                    key={opt.role}
                    type="button"
                    onClick={() => setRole(opt.role)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                      isSelected
                        ? "bg-background text-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Tarjetas de Métricas Dinámicas según el Rol */}
      <RoleMetricsGrid role={role} />

      {/* 3. Rejilla Principal: Horario / Tareas y Panel Lateral */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Columna Izquierda: Clases y Acciones */}
        <div className="space-y-6 lg:col-span-8">
          <RoleScheduleCard role={role} />
          <RoleQuickActionsCard role={role} />
        </div>

        {/* Columna Derecha: Comunicados y Asistencia */}
        <div className="space-y-6 lg:col-span-4">
          <AttendanceOverviewCard />
          <InstitutionalNoticesCard />
          <UpcomingEventsCard />
        </div>
      </div>
    </div>
  );
}

/**
 * Tarjetas de métricas numéricas adaptadas al rol
 */
function RoleMetricsGrid({ role }: { role: UserRole }) {
  if (role === "student") {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Asignaturas Inscritas"
          value="11"
          subtitle="Plan curricular 2026"
          icon={Book02Icon}
        />
        <MetricCard
          title="Promedio Bimestral"
          value="17.4"
          subtitle="Nivel Destacado (AD)"
          icon={Award01Icon}
          trend="+0.6 vs periodo anterior"
        />
        <MetricCard
          title="Asistencia Efectiva"
          value="98.2%"
          subtitle="44 de 45 días asistidos"
          icon={Clock01Icon}
        />
        <MetricCard
          title="Tareas Pendientes"
          value="2"
          subtitle="Próxima entrega: Viernes"
          icon={File01Icon}
          badgeText="Alerta"
        />
      </div>
    );
  }

  if (role === "principal" || role === "director") {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Población Escolar"
          value="680"
          subtitle="Secundaria y Primaria"
          icon={School01Icon}
        />
        <MetricCard
          title="Planta Docente"
          value="34"
          subtitle="100% asignados a secciones"
          icon={TeacherIcon}
        />
        <MetricCard
          title="Asistencia General"
          value="95.6%"
          subtitle="Promedio institucional hoy"
          icon={CheckmarkCircle02Icon}
        />
        <MetricCard
          title="Actas Procesadas"
          value="92%"
          subtitle="Cierre SIAGIE I Bimestre"
          icon={Award01Icon}
          badgeText="En curso"
        />
      </div>
    );
  }

  if (role === "admin") {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Usuarios del Sistema"
          value="728"
          subtitle="Docentes, alumnos, padres"
          icon={UserGroupIcon}
        />
        <MetricCard
          title="Roles y Privilegios"
          value="5"
          subtitle="Matriz RBAC activa"
          icon={ShieldCheckIcon}
        />
        <MetricCard
          title="Operaciones Hoy"
          value="1,420"
          subtitle="Logs de auditoría"
          icon={Clock01Icon}
        />
        <MetricCard
          title="Disponibilidad"
          value="99.98%"
          subtitle="Servicios en línea"
          icon={SparklesIcon}
          badgeText="Óptimo"
        />
      </div>
    );
  }

  if (role === "secretary" || role === "secretaria") {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Matrículas Registradas"
          value="642"
          subtitle="Año lectivo 2026 vigente"
          icon={School01Icon}
        />
        <MetricCard
          title="Padrón de Estudiantes"
          value="680"
          subtitle="Secundaria regular"
          icon={UserGroupIcon}
        />
        <MetricCard
          title="Nóminas SIAGIE"
          value="18 / 20"
          subtitle="Generadas y oficiales"
          icon={CheckmarkCircle02Icon}
          badgeText="90%"
        />
        <MetricCard
          title="Traslados en Proceso"
          value="3"
          subtitle="Pendientes de validación"
          icon={File01Icon}
          badgeText="Atención"
        />
      </div>
    );
  }

  if (role === "parent" || role === "apoderado") {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Hijos Matriculados"
          value="2"
          subtitle="3° y 5° de Secundaria"
          icon={UserGroupIcon}
        />
        <MetricCard
          title="Rendimiento Global"
          value="16.9"
          subtitle="Buen desempeño general"
          icon={Award01Icon}
        />
        <MetricCard
          title="Puntualidad"
          value="97.4%"
          subtitle="0 tardanzas injustificadas"
          icon={Clock01Icon}
        />
        <MetricCard
          title="Citaciones Activas"
          value="1"
          subtitle="Entrega de libretas"
          icon={Notification01Icon}
          badgeText="Atención"
        />
      </div>
    );
  }

  // Por defecto: Rol Docente (teacher)
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Secciones a Cargo"
        value="5"
        subtitle="3° A, B - 4° A, B, C"
        icon={Book02Icon}
      />
      <MetricCard
        title="Alumnos Totales"
        value="142"
        subtitle="En nómina escolar activa"
        icon={UserGroupIcon}
      />
      <MetricCard
        title="Asistencia de Hoy"
        value="96.4%"
        subtitle="137 alumnos presentes"
        icon={CheckmarkCircle02Icon}
      />
      <MetricCard
        title="Notas por Ingresar"
        value="8"
        subtitle="Evaluación formativa pendiente"
        icon={Award01Icon}
        badgeText="Pendiente"
      />
    </div>
  );
}

function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  badgeText,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: typeof Book02Icon;
  trend?: string;
  badgeText?: string;
}) {
  return (
    <Card className="bg-card shadow-sm transition-shadow hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-muted-foreground text-xs font-semibold">{title}</CardTitle>
        <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg">
          <HugeiconsIcon icon={Icon} className="size-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline justify-between">
          <div className="text-foreground text-2xl font-black">{value}</div>
          {badgeText && (
            <Badge
              variant="outline"
              className="border-primary/20 bg-primary/5 text-primary text-[10px]"
            >
              {badgeText}
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground mt-1 text-xs">{subtitle}</p>
        {trend && <p className="text-primary mt-1 text-[11px] font-semibold">{trend}</p>}
      </CardContent>
    </Card>
  );
}

/**
 * Horario de clases o actividades según el rol
 */
function RoleScheduleCard({ role }: { role: UserRole }) {
  const isStudent = role === "student";
  const title = isStudent ? "Mis Clases de Hoy" : "Horario Pedagógico de Hoy";
  const desc = isStudent
    ? "Asignaturas y docentes correspondientes al horario escolar de hoy"
    : "Sesiones programadas y horas pedagógicas del docente";

  const scheduleItems = [
    {
      time: "08:00 - 09:30",
      subject: "Matemática",
      section: "3° Secundaria 'A'",
      room: "Aula 204",
      status: "Finalizada",
    },
    {
      time: "09:30 - 11:00",
      subject: "Ciencia y Tecnología",
      section: "4° Secundaria 'B'",
      room: "Laboratorio C",
      status: "En curso",
    },
    {
      time: "11:30 - 13:00",
      subject: "Comunicación",
      section: "3° Secundaria 'B'",
      room: "Aula 205",
      status: "Próxima",
    },
    {
      time: "14:00 - 15:30",
      subject: "Tutoría y Convivencia Escolar",
      section: "4° Secundaria 'A'",
      room: "Aula 301",
      status: "Próxima",
    },
  ];

  return (
    <Card className="bg-card shadow-sm transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold sm:text-lg">{title}</CardTitle>
            <CardDescription className="text-xs">{desc}</CardDescription>
          </div>
          <Badge variant="outline" className="text-xs font-semibold">
            Hoy
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="divide-border/40 divide-y">
          {scheduleItems.map((item, i) => (
            <div key={i} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
              <div className="flex items-start gap-3">
                <div className="bg-muted text-muted-foreground mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg font-mono text-xs">
                  <HugeiconsIcon icon={Clock01Icon} className="size-4" />
                </div>
                <div>
                  <h4 className="text-foreground text-sm font-bold">{item.subject}</h4>
                  <p className="text-muted-foreground text-xs">
                    {item.section} · <span className="text-foreground/80">{item.room}</span>
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-muted-foreground block font-mono text-xs">{item.time}</span>
                <span
                  className={`mt-0.5 inline-block text-[10px] font-bold ${
                    item.status === "En curso"
                      ? "text-primary animate-pulse"
                      : item.status === "Finalizada"
                        ? "text-muted-foreground"
                        : "text-amber-600 dark:text-amber-400"
                  }`}
                >
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Accesos directos rápidos
 */
function RoleQuickActionsCard({ role }: { role: UserRole }) {
  return (
    <Card className="bg-card shadow-sm transition-shadow hover:shadow-md">
      <CardHeader>
        <CardTitle className="text-base font-bold sm:text-lg">Acciones Rápidas</CardTitle>
        <CardDescription className="text-xs">
          Módulos y herramientas más utilizados en el SGA
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <QuickActionButton
            icon={CheckmarkCircle02Icon}
            title="Asistencia"
            desc="Pase diario"
            href={`/dashboard/${role}/attendance`}
          />
          <QuickActionButton
            icon={Award01Icon}
            title="Calificaciones"
            desc="Registro de notas"
            href={`/dashboard/${role}/grades`}
          />
          <QuickActionButton
            icon={File01Icon}
            title="Tareas"
            desc="Actividades"
            href={`/dashboard/${role}/tasks`}
          />
          <QuickActionButton
            icon={Calendar03Icon}
            title="Horario"
            desc="Cronograma"
            href={`/dashboard/${role}/schedule`}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function QuickActionButton({
  icon: Icon,
  title,
  desc,
  href,
}: {
  icon: typeof Book02Icon;
  title: string;
  desc: string;
  href: string;
}) {
  return (
    <Button
      asChild
      variant="outline"
      className="hover:border-primary/40 hover:bg-primary/5 flex h-auto flex-col items-start gap-1 p-3 text-left transition-all"
    >
      <Link href={href}>
        <div className="bg-primary/10 text-primary mb-1 flex size-8 items-center justify-center rounded-lg">
          <HugeiconsIcon icon={Icon} className="size-4" />
        </div>
        <span className="text-foreground text-xs leading-tight font-bold">{title}</span>
        <span className="text-muted-foreground text-[10px]">{desc}</span>
      </Link>
    </Button>
  );
}

/**
 * Widget de asistencia resumida
 */
function AttendanceOverviewCard() {
  return (
    <Card className="bg-card shadow-sm transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-bold">Asistencia General de Hoy</CardTitle>
        <CardDescription className="text-xs">Estado en tiempo real de la jornada</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-foreground text-3xl font-black">96.4%</span>
          <Badge className="border border-emerald-500/20 bg-emerald-500/10 text-xs font-bold text-emerald-600 dark:text-emerald-400">
            Meta Superada
          </Badge>
        </div>

        {/* Barra de progreso visual */}
        <div className="bg-muted overflow-hidden rounded-full p-0.5">
          <div className="bg-primary h-2 rounded-full transition-all" style={{ width: "96.4%" }} />
        </div>

        <div className="text-muted-foreground grid grid-cols-3 gap-2 text-center text-xs">
          <div className="border-border/40 rounded-lg border p-2">
            <span className="text-foreground block font-bold">137</span>
            <span className="text-[10px]">Presentes</span>
          </div>
          <div className="border-border/40 rounded-lg border p-2">
            <span className="block font-bold text-amber-600 dark:text-amber-400">3</span>
            <span className="text-[10px]">Tardanzas</span>
          </div>
          <div className="border-border/40 rounded-lg border p-2">
            <span className="text-destructive block font-bold">2</span>
            <span className="text-[10px]">Faltas</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Widget de comunicados institucionales
 */
function InstitutionalNoticesCard() {
  const notices = [
    {
      title: "Jornada Pedagógica N° 02",
      date: "26 Sep",
      tag: "Dirección",
      urgent: true,
    },
    {
      title: "Simulacro Nacional Multipeligro",
      date: "30 Sep",
      tag: "Comisión GRD",
      urgent: false,
    },
  ];

  return (
    <Card className="bg-card shadow-sm transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-bold">Avisos de Dirección</CardTitle>
          <HugeiconsIcon icon={Notification01Icon} className="text-muted-foreground size-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {notices.map((n, i) => (
            <div
              key={i}
              className="border-border/40 hover:bg-muted/30 rounded-xl border p-2.5 transition-colors"
            >
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-primary font-bold">{n.tag}</span>
                <span className="text-muted-foreground font-mono">{n.date}</span>
              </div>
              <h5 className="text-foreground mt-1 text-xs font-semibold">{n.title}</h5>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Widget de próximos eventos
 */
function UpcomingEventsCard() {
  return (
    <Card className="bg-card shadow-sm transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-bold">Fechas Clave del Periodo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2.5 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-foreground font-medium">Cierre de Calificaciones I Bim.</span>
          <span className="text-primary font-mono font-bold">12 Oct</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Semana de Gestión Escolar</span>
          <span className="text-muted-foreground font-mono">14 - 18 Oct</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Entrega de Libretas a Familias</span>
          <span className="text-muted-foreground font-mono">21 Oct</span>
        </div>

        <div className="pt-2">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-primary w-full justify-between p-0 text-xs font-semibold hover:bg-transparent"
          >
            <Link href="/admin/calendario">
              <span>Ver calendario completo</span>
              <HugeiconsIcon icon={ArrowRight01Icon} className="size-3.5" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
