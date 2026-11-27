"use client";

import * as React from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./sidebar/app-sidebar";
import { AppHeader } from "./header/app-header";
import type { UserProfileData } from "./sidebar/nav-user";
import { AnioLectivoProvider } from "@/features/anio-escolar/anio-lectivo-context";
import { useOptionalDashboardRole } from "./dashboard-role-context";
import { PushNotificationPromptToast } from "@/features/notificaciones/components";
import { ImpersonationBanner } from "@/features/auth";

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
      <SidebarProvider
        defaultOpen={defaultOpen}
        style={{ "--sidebar-width-icon": "3.75rem" } as React.CSSProperties}
        className="bg-(--fondo-app)"
      >
        <AppSidebar user={activeUser} />
        <SidebarInset className="flex h-dvh flex-col overflow-hidden bg-(--fondo-app)">
          <ImpersonationBanner />
          <AppHeader />
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-(--fondo-app) p-4 md:p-6 lg:p-8">
            <div className="animate-in fade-in duration-300">{children}</div>
          </div>
        </SidebarInset>
        <PushNotificationPromptToast />
      </SidebarProvider>
    </AnioLectivoProvider>
  );
}
