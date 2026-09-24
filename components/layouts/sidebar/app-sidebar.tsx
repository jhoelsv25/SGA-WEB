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
import { NavUser, type UserProfileData } from "./nav-user";

export interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  role?: UserRole;
  user?: UserProfileData;
}

export function AppSidebar({ role = "teacher", user, ...props }: AppSidebarProps) {
  const sections = React.useMemo(() => getNavigationForRole(role), [role]);

  return (
    <Sidebar collapsible="icon" {...props}>
      {/* Cabecera Institucional del Sidebar */}
      <SidebarHeader className="border-sidebar-border border-b p-2">
        <NavInstitution />
      </SidebarHeader>

      {/* Contenido Dinámico de Rutas agrupadas por Rol */}
      <SidebarContent className="px-2 py-1">
        <NavMain sections={sections} />
      </SidebarContent>

      {/* Pie de página con Perfil y Dropdown de Usuario */}
      <SidebarFooter className="border-sidebar-border border-t p-2">
        <NavUser user={user} />
      </SidebarFooter>

      {/* Riel colapsable interactivo */}
      <SidebarRail />
    </Sidebar>
  );
}
