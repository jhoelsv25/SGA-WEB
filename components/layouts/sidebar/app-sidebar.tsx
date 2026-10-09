"use client";

import * as React from "react";
import { menuDelUsuario } from "@/config";
import { useSession } from "@/features/auth";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavInstitution } from "./nav-institution";
import { NavMain } from "./nav-main";
import { SidebarSearch } from "./sidebar-search";
import { SidebarQuickFooter } from "./sidebar-quick-footer";

export type AppSidebarProps = React.ComponentProps<typeof Sidebar>;

export function AppSidebar(props: AppSidebarProps) {
  const { data: session } = useSession();
  const rolActivo = session?.user.activeRoleName ?? session?.user.roles?.[0] ?? "";
  const menuRoutes = session?.user.menuRoutes;
  const sections = React.useMemo(
    () => menuDelUsuario({ esAdministrador: rolActivo === "Administrador", menuRoutes }),
    [rolActivo, menuRoutes],
  );

  return (
    <Sidebar
      collapsible="icon"
      className="border-sidebar-border/80 bg-sidebar/95 border-r backdrop-blur-md transition-all duration-300"
      {...props}
    >
      {/* Cabecera Institucional del Sidebar */}
      <SidebarHeader className="border-sidebar-border/60 space-y-2.5 border-b p-3">
        <NavInstitution />
        {/* Buscador Integrado en el Sidebar */}
        <div>
          <SidebarSearch sections={sections} />
        </div>
      </SidebarHeader>

      {/* Contenido Dinámico de Rutas agrupadas por Rol */}
      <SidebarContent className="overflow-y-auto px-3 py-3">
        <NavMain sections={sections} />
      </SidebarContent>

      {/* Pie de página con Soporte, Estado del Sistema y Toggle */}
      <SidebarFooter className="border-sidebar-border/60 border-t p-2.5">
        <SidebarQuickFooter />
      </SidebarFooter>

      {/* Riel colapsable interactivo */}
      <SidebarRail />
    </Sidebar>
  );
}
