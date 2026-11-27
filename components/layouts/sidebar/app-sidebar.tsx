"use client";

import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { BarraDesplazamiento } from "./barra-desplazamiento";
import { NavInstitution } from "./nav-institution";
import { NavMain } from "./nav-main";
import { SidebarMenuFiltro } from "./sidebar-menu-filtro";
import { useMenuSecciones } from "./use-menu-secciones";
import { filtrarMenu } from "./filtrar-menu";
import { HeaderUserMenu } from "../header/header-user-menu";
import type { UserProfileData } from "./nav-user";

export type AppSidebarProps = React.ComponentProps<typeof Sidebar> & { user?: UserProfileData };

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  const sections = useMenuSecciones();
  const { state, isMobile } = useSidebar();
  const contraida = state === "collapsed" && !isMobile;
  const [lista, setLista] = React.useState<HTMLDivElement | null>(null);
  const [busqueda, setBusqueda] = React.useState("");
  // Contraída no hay campo de búsqueda, así que se muestra el menú completo.
  const filtro = contraida ? "" : busqueda.trim();
  const visibles = React.useMemo(() => filtrarMenu(sections, filtro), [sections, filtro]);

  return (
    <Sidebar
      collapsible="icon"
      className="group/lateral **:data-[slot=sidebar-inner]:overflow-hidden"
      {...props}
    >
      {/* Cabecera Institucional del Sidebar */}
      <SidebarHeader className="gap-0 p-0">
        {/* Misma altura que la cabecera; usa el color de la barra */}
        <div className="border-border/60 bg-sidebar flex h-14 shrink-0 items-center border-b px-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
          <NavInstitution />
        </div>
        {/* Buscador propio del menú */}
        <div className="px-3 pt-3 pb-1 group-data-[collapsible=icon]:hidden">
          <SidebarMenuFiltro valor={busqueda} onCambiar={setBusqueda} />
        </div>
      </SidebarHeader>

      {/* Contenido Dinámico de Rutas agrupadas por Rol */}
      <div className="flex min-h-0 flex-1">
        <SidebarContent
          ref={setLista}
          className="min-w-0 gap-0 overflow-y-auto py-2 group-data-[collapsible=icon]:overflow-y-auto"
        >
          {/* La clave reinicia el estado abierto/cerrado de los grupos al empezar o terminar */}
          <NavMain
            key={filtro ? "filtrado" : "completo"}
            sections={visibles}
            abrirTodo={!!filtro}
          />
          {visibles.length === 0 && filtro && (
            <p role="status" className="text-muted-foreground px-4 py-6 text-center text-xs">
              No hay opciones con «{filtro}».
            </p>
          )}
        </SidebarContent>
        {/* Contraída no se muestra, para no descuadrar los iconos */}
        <div className="contents group-data-[collapsible=icon]:hidden">
          <BarraDesplazamiento lista={lista} />
        </div>
      </div>

      {/* Pie: usuario de la sesión y sus opciones */}
      <SidebarFooter className="border-sidebar-border border-t p-2 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:px-2.5">
        <HeaderUserMenu user={user} />
      </SidebarFooter>

      {/* Riel colapsable interactivo */}
      <SidebarRail />
    </Sidebar>
  );
}
