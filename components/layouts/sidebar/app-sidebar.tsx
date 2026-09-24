"use client";

import * as React from "react";
import { getNavigationForRole, type UserRole } from "@/config";
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

export interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  role?: UserRole;
}

export function AppSidebar({ role = "teacher", ...props }: AppSidebarProps) {
  const sections = React.useMemo(() => getNavigationForRole(role), [role]);

  return (
    <Sidebar collapsible="icon" className="border-sidebar-border/70 border-r" {...props}>
      {/* Cabecera Institucional del Sidebar */}
      <SidebarHeader className="border-sidebar-border/60 border-b p-3">
        <NavInstitution />
        {/* Buscador Integrado en el Sidebar */}
        <div className="pt-2">
          <SidebarSearch sections={sections} />
        </div>
      </SidebarHeader>

      {/* Contenido Dinámico de Rutas agrupadas por Rol */}
      <SidebarContent className="px-2.5 py-2">
        <NavMain sections={sections} />
      </SidebarContent>

      {/* Pie de página con Soporte y Mesa de Ayuda */}
      <SidebarFooter className="border-sidebar-border/60 border-t p-2.5">
        <SidebarQuickFooter />
      </SidebarFooter>

      {/* Riel colapsable interactivo */}
      <SidebarRail />
    </Sidebar>
  );
}
