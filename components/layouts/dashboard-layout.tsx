"use client";

import * as React from "react";
import type { UserRole } from "@/config";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./sidebar/app-sidebar";
import { AppHeader } from "./header/app-header";
import type { UserProfileData } from "./sidebar/nav-user";

export interface DashboardLayoutProps {
  children: React.ReactNode;
  role?: UserRole;
  user?: UserProfileData;
  defaultOpen?: boolean;
}

export function DashboardLayout({
  children,
  role = "teacher",
  user,
  defaultOpen = true,
}: DashboardLayoutProps) {
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      {/* Sidebar estilo sidebar-07 (colapsable a iconos) */}
      <AppSidebar role={role} user={user} />

      {/* Contenedor del contenido principal con AppHeader integrado */}
      <SidebarInset className="flex min-h-screen flex-col">
        <AppHeader />
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
