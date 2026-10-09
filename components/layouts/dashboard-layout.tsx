"use client";

import * as React from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./sidebar/app-sidebar";
import { AppHeader } from "./header/app-header";
import type { UserProfileData } from "./sidebar/nav-user";
import { AnioLectivoProvider } from "@/features/anio-escolar/anio-lectivo-context";
import { useOptionalDashboardRole } from "./dashboard-role-context";

export interface Props {
  children: React.ReactNode;
  user?: UserProfileData;
  defaultOpen?: boolean;
}

export function DashboardLayout({ children, user: userProp, defaultOpen = true }: Props) {
  const roleContext = useOptionalDashboardRole();

  const activeUser = userProp ?? roleContext?.user;

  return (
    <AnioLectivoProvider>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar />
        <SidebarInset className="bg-background flex h-dvh flex-col overflow-hidden">
          <AppHeader user={activeUser} />
          <div className="bg-background min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 md:p-6 lg:p-8">
            <div className="animate-in fade-in duration-300">{children}</div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </AnioLectivoProvider>
  );
}
