"use client";

import * as React from "react";
import type { UserRole } from "@/config";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./sidebar/app-sidebar";
import { AppHeader } from "./header/app-header";
import type { UserProfileData } from "./sidebar/nav-user";
import { useOptionalDashboardRole } from "./dashboard-role-context";

export interface Props {
  children: React.ReactNode;
  role?: UserRole;
  user?: UserProfileData;
  defaultOpen?: boolean;
}

export function DashboardLayout({
  children,
  role: roleProp,
  user: userProp,
  defaultOpen = true,
}: Props) {
  const roleContext = useOptionalDashboardRole();

  const activeRole = roleProp ?? roleContext?.role ?? "teacher";
  const activeUser = userProp ?? roleContext?.user;

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar role={activeRole} />
      <SidebarInset className="flex h-screen flex-col overflow-hidden">
        <AppHeader user={activeUser} />
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
