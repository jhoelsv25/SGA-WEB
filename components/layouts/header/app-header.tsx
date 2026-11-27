"use client";

import { ThemeToggle } from "@/components/common/theme-toggle";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { HeaderNotificationBell } from "@/features/notificaciones";
import { HeaderSesionDocente } from "@/features/sesiones";
import { HeaderAcademicYearSelect } from "./header-academic-year";
import { HeaderLiveClock } from "./header-live-clock";
import { HeaderSearch } from "./header-search";
import { useMenuSecciones } from "../sidebar/use-menu-secciones";

export function AppHeader() {
  const sections = useMenuSecciones();

  return (
    <header
      data-barra-superior
      className="border-border/60 bg-card dark:bg-background sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between gap-2 border-b px-3 transition-[width,height] ease-linear md:px-4"
    >
      <div className="flex min-w-0 items-center gap-2">
        <SidebarTrigger className="text-muted-foreground hover:text-foreground -ml-1 size-11 shrink-0" />
        <HeaderSearch sections={sections} />
      </div>

      <div className="flex shrink-0 items-center gap-1 sm:gap-1.5">
        <HeaderLiveClock />
        <HeaderAcademicYearSelect />

        <Separator
          orientation="vertical"
          className="mx-1 hidden data-[orientation=vertical]:h-4 sm:block"
        />

        <HeaderSesionDocente />
        <HeaderNotificationBell />
        <ThemeToggle />
      </div>
    </header>
  );
}
