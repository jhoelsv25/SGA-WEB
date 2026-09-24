"use client";

import * as React from "react";
import Link from "next/link";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { BreadcrumbNav } from "./breadcrumb-nav";
import { HugeiconsIcon } from "@hugeicons/react";
import { Notification01Icon, School01Icon } from "@hugeicons/core-free-icons";
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
      <div className="flex items-center gap-2">
        <SidebarTrigger className="text-muted-foreground hover:text-foreground -ml-1" />
        <Separator orientation="vertical" className="mr-1 data-[orientation=vertical]:h-4" />
        <BreadcrumbNav />
      </div>

      {/* Lado Derecho: Badge de Año Escolar + Notificaciones + ThemeToggle + HeaderUserMenu */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Badge Institucional del Periodo Escolar */}
        <div className="border-primary/20 bg-primary/5 text-primary hidden items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold lg:flex">
          <HugeiconsIcon icon={School01Icon} className="size-3.5" />
          <span>Año 2026 · I.E. Carmelitas</span>
        </div>

        {/* Acceso a Notificaciones */}
        <Button
          asChild
          variant="ghost"
          size="icon-sm"
          className="text-muted-foreground hover:text-foreground relative"
          aria-label="Ver notificaciones"
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
