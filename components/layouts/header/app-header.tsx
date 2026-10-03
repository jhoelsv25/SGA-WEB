"use client";

import * as React from "react";
import Link from "next/link";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { BreadcrumbNav } from "./breadcrumb-nav";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Notification01Icon,
  Activity01Icon,
  Clock01Icon,
  Calendar03Icon,
  CheckmarkCircle02Icon,
  ArrowRight01Icon,
  ServerStack01Icon,
} from "@hugeicons/core-free-icons";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HeaderUserMenu } from "./header-user-menu";
import type { UserProfileData } from "../sidebar/nav-user";
import { useOptionalDashboardRole } from "../dashboard-role-context";

export interface AppHeaderProps {
  user?: UserProfileData;
}

export function AppHeader({ user }: AppHeaderProps) {
  const roleContext = useOptionalDashboardRole();
  const activeUser = user ?? roleContext?.user;

  return (
    <header className="border-border/60 bg-background/95 sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between gap-2 border-b px-3 backdrop-blur-md transition-[width,height] ease-linear md:px-4">
      {/* Lado Izquierdo: Trigger del Sidebar + Separador + Breadcrumb */}
      <div className="flex min-w-0 items-center gap-2">
        <SidebarTrigger className="text-muted-foreground hover:text-foreground -ml-1 shrink-0" />
        <Separator
          orientation="vertical"
          className="mr-1 shrink-0 data-[orientation=vertical]:h-4"
        />
        <BreadcrumbNav />
      </div>

      {/* Lado Derecho: Reloj + Selector de Año Lectivo + Popover de Monitoreo + Notificaciones + ThemeToggle + HeaderUserMenu */}
      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
        {/* Reloj en Tiempo Real limpio sin badge pesado */}
        <HeaderLiveClock />

        {/* Selector de Año Académico Mejorado */}
        <HeaderAcademicYearSelect />

        <Separator
          orientation="vertical"
          className="mx-0.5 hidden data-[orientation=vertical]:h-4 sm:block"
        />

        {/* Popover de Monitoreo en Tiempo Real (sin badge) */}
        <HeaderMonitoringPopover />

        {/* Acceso a Notificaciones */}
        <Button
          asChild
          variant="ghost"
          size="icon-sm"
          className="text-muted-foreground hover:text-foreground relative"
          aria-label="Ver notificaciones"
          title="Notificaciones"
        >
          <Link href="/dashboard/notifications">
            <HugeiconsIcon icon={Notification01Icon} className="size-4.5" />
            <span className="bg-primary ring-background absolute top-1.5 right-1.5 size-2 rounded-full ring-2" />
          </Link>
        </Button>

        {/* Alternador de Tema Claro / Oscuro */}
        <ThemeToggle />

        <Separator
          orientation="vertical"
          className="mx-0.5 hidden data-[orientation=vertical]:h-4 sm:block"
        />

        {/* Menú de Usuario en el Header */}
        <HeaderUserMenu user={activeUser} />
      </div>
    </header>
  );
}

/**
 * Popover interactivo con estado y monitoreo del sistema
 */
function HeaderMonitoringPopover() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-muted-foreground hover:text-foreground data-[state=open]:bg-accent data-[state=open]:text-foreground transition-colors"
          aria-label="Centro de Monitoreo"
          title="Centro de Monitoreo del Sistema"
        >
          <HugeiconsIcon icon={Activity01Icon} className="size-4.5" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-80 overflow-hidden rounded-2xl border-none p-0 shadow-2xl"
      >
        {/* Cabecera del Popover */}
        <div className="bg-muted/40 border-border/50 border-b p-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="size-2 animate-pulse rounded-full bg-emerald-500" />
              <h4 className="text-foreground text-xs font-bold">Centro de Monitoreo</h4>
            </div>
            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
              Operativo
            </span>
          </div>
          <p className="text-muted-foreground mt-1 text-[11px]">
            Estado de los servicios y actividad pedagógica
          </p>
        </div>

        {/* Métricas clave */}
        <div className="space-y-3 p-3.5">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-muted/30 rounded-xl p-2.5">
              <span className="text-muted-foreground block text-[10.5px] font-medium">
                Asistencia Hoy
              </span>
              <span className="text-foreground mt-0.5 block text-base font-bold">96.4%</span>
              <span className="text-[9.5px] font-medium text-emerald-600 dark:text-emerald-400">
                137 presentes
              </span>
            </div>

            <div className="bg-muted/30 rounded-xl p-2.5">
              <span className="text-muted-foreground block text-[10.5px] font-medium">
                Clases Activas
              </span>
              <span className="text-foreground mt-0.5 block text-base font-bold">18 / 24</span>
              <span className="text-muted-foreground text-[9.5px] font-medium">Turno Mañana</span>
            </div>
          </div>

          <div className="text-muted-foreground flex items-center justify-between px-1 py-0.5 text-xs">
            <div className="flex items-center gap-1.5">
              <HugeiconsIcon
                icon={ServerStack01Icon}
                className="text-muted-foreground/80 size-3.5"
              />
              <span className="text-[11px]">Servidor institucional</span>
            </div>
            <span className="font-mono text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              24ms · Óptimo
            </span>
          </div>

          <div className="text-muted-foreground flex items-center justify-between px-1 py-0.5 text-xs">
            <div className="flex items-center gap-1.5">
              <HugeiconsIcon
                icon={CheckmarkCircle02Icon}
                className="text-muted-foreground/80 size-3.5"
              />
              <span className="text-[11px]">Base de datos SGA</span>
            </div>
            <span className="text-foreground/80 text-[11px] font-medium">Sincronizado</span>
          </div>
        </div>

        {/* Footer del Popover con enlace */}
        <div className="bg-muted/20 border-border/50 flex items-center justify-between border-t px-3.5 py-2.5">
          <span className="text-muted-foreground text-[10.5px]">I.E. Carmelinas · 2026</span>
          <Link
            href="/dashboard/principal/analytics"
            className="text-primary inline-flex items-center gap-1 text-[11px] font-semibold hover:underline"
          >
            <span>Ver analítica completa</span>
            <HugeiconsIcon icon={ArrowRight01Icon} className="size-3" />
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}

/**
 * Componente de reloj en vivo limpio y minimalista
 */
function HeaderLiveClock() {
  const [time, setTime] = React.useState<string>("");

  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("es-PE", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!time) {
    return (
      <div className="text-muted-foreground/60 hidden items-center gap-1.5 px-2 text-xs md:flex">
        <HugeiconsIcon icon={Clock01Icon} className="size-3.5 opacity-60" />
        <span className="font-mono text-[11.5px]">--:--</span>
      </div>
    );
  }

  return (
    <div
      className="text-muted-foreground/80 hover:text-foreground hidden items-center gap-1.5 px-2 text-xs transition-colors select-none md:flex"
      title="Hora local del sistema"
    >
      <HugeiconsIcon icon={Clock01Icon} className="text-muted-foreground/70 size-3.5 shrink-0" />
      <span className="text-foreground/80 font-mono text-[11.5px] font-medium tracking-tight">
        {time}
      </span>
    </div>
  );
}

/**
 * Selector desplegable del Año Académico estilizado
 */
function HeaderAcademicYearSelect() {
  const [selectedYear, setSelectedYear] = React.useState("2026");

  return (
    <Select value={selectedYear} onValueChange={setSelectedYear}>
      <SelectTrigger
        className="border-border/60 bg-muted/40 hover:bg-muted/70 text-foreground/90 hover:text-foreground h-8 gap-1.5 rounded-lg px-2.5 text-xs font-semibold shadow-none transition-all"
        aria-label="Seleccionar año lectivo"
      >
        <HugeiconsIcon icon={Calendar03Icon} className="text-primary size-3.5 shrink-0" />
        <SelectValue placeholder="Año" />
      </SelectTrigger>
      <SelectContent align="end" className="w-56 rounded-xl border-none p-1 shadow-2xl">
        <SelectItem value="2026" className="rounded-lg py-2">
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-1.5 text-xs font-bold">
              <span>Año Lectivo 2026</span>
              <span className="py-0.2 rounded-md bg-emerald-500/10 px-1.5 text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
                Vigente
              </span>
            </div>
            <span className="text-muted-foreground/80 text-[10.5px] font-normal">
              Periodo escolar en curso
            </span>
          </div>
        </SelectItem>

        <SelectItem value="2025" className="rounded-lg py-2">
          <div className="flex flex-col text-left">
            <span className="text-xs font-semibold">Año Lectivo 2025</span>
            <span className="text-muted-foreground/80 text-[10.5px] font-normal">
              Histórico · Concluido
            </span>
          </div>
        </SelectItem>

        <SelectItem value="2024" className="rounded-lg py-2">
          <div className="flex flex-col text-left">
            <span className="text-xs font-semibold">Año Lectivo 2024</span>
            <span className="text-muted-foreground/80 text-[10.5px] font-normal">
              Archivo digital
            </span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
