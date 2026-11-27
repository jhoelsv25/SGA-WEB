"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
  AlertCircleIcon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  File01Icon,
  Task01Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { useSession } from "@/features/auth";
import { cn } from "@/lib/utils";

export interface SectionRouteTab {
  href: string;
  label: string;
  icon?: IconSvgElement;
}

export type GrupoTabsSeccion = "sesiones-ausencias" | "consolidado-aula" | "control-asistencia";

const TABS_POR_GRUPO: Record<GrupoTabsSeccion, readonly SectionRouteTab[]> = {
  "sesiones-ausencias": [
    { href: "/admin/sesiones-hoy", label: "Sesiones de hoy", icon: Clock01Icon },
    {
      href: "/admin/justificaciones-sesion",
      label: "Justificaciones",
      icon: CheckmarkCircle02Icon,
    },
    { href: "/admin/ausencias-docentes", label: "Ausencias docentes", icon: AlertCircleIcon },
  ],
  "consolidado-aula": [
    { href: "/admin/consolidados-docentes", label: "Consolidados", icon: File01Icon },
    { href: "/admin/pendientes-seguimiento", label: "Pendientes", icon: Task01Icon },
    { href: "/admin/informe-horas-efectivas", label: "Horas efectivas", icon: Clock01Icon },
    { href: "/admin/observaciones-aula", label: "Observaciones de aula", icon: Task01Icon },
  ],
  "control-asistencia": [
    { href: "/admin/marcaciones-hoy", label: "Control diario", icon: Clock01Icon },
    { href: "/admin/marcacion-manual", label: "Marcación manual", icon: CheckmarkCircle02Icon },
    { href: "/admin/asistencia-seccion", label: "Asistencia por sección", icon: UserGroupIcon },
  ],
};

interface SectionRouteTabsProps {
  grupo: GrupoTabsSeccion;
  className?: string;
}

/**
 * Barra de pestañas por ruta para vistas agrupadas bajo un solo ítem del menú lateral.
 * Filtra automáticamente las pestañas según las rutas asignadas al rol activo en Roles-Menú.
 */
export function SectionRouteTabs({ grupo, className }: SectionRouteTabsProps) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const tabs = TABS_POR_GRUPO[grupo];
  const rolActivo = session?.user.activeRoleName ?? session?.user.roles?.[0] ?? "";
  const esAdmin = rolActivo === "Administrador";
  const asignadas = React.useMemo(
    () => new Set(session?.user.menuRoutes ?? []),
    [session?.user.menuRoutes],
  );

  const visibles = React.useMemo(() => {
    if (esAdmin || !session?.user.menuRoutes?.length) return tabs;
    return tabs.filter((tab) => asignadas.has(tab.href));
  }, [tabs, esAdmin, session?.user.menuRoutes, asignadas]);

  if (visibles.length <= 1) return null;

  return (
    <nav
      aria-label="Secciones del módulo"
      className={cn(
        "border-border/70 bg-card dark:bg-muted/30 flex flex-wrap items-center gap-1 rounded-2xl border p-1.5",
        className,
      )}
    >
      {visibles.map((tab) => {
        const activa = pathname === tab.href || pathname.startsWith(`${tab.href}/`);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-medium transition-colors",
              activa
                ? "bg-primary text-primary-foreground dark:bg-background dark:text-primary dark:border-border/60 font-semibold shadow-2xs dark:border"
                : "text-muted-foreground hover:bg-muted dark:hover:bg-background/60 hover:text-foreground",
            )}
          >
            {tab.icon ? <HugeiconsIcon icon={tab.icon} className="size-3.5 shrink-0" /> : null}
            <span>{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
