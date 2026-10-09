"use client";

import * as React from "react";
import type { UserProfileData } from "./sidebar/nav-user";

import type { AuthModule, CurrentUser } from "@/features/auth";
import { useSession } from "@/features/auth";

export interface DashboardRoleContextType {
  /** Nombre del rol activo elegido al iniciar sesión (RF-001 V3). */
  rolActivo: string;
  user: UserProfileData;
  currentUser?: CurrentUser;
  modules?: AuthModule[];
  isLoading: boolean;
  isAuthenticated: boolean;
}

const DashboardRoleContext = React.createContext<DashboardRoleContextType | null>(null);

export function DashboardRoleProvider({ children }: { children: React.ReactNode }) {
  const { data: session, isLoading } = useSession();
  const sessionUser = session?.user;
  const rolActivo = sessionUser?.activeRoleName ?? sessionUser?.roles?.[0] ?? "";

  const user: UserProfileData = {
    name:
      [sessionUser?.firstName, sessionUser?.lastName].filter(Boolean).join(" ").trim() ||
      sessionUser?.username ||
      "",
    email: sessionUser?.email ?? "",
    avatar: sessionUser?.avatarUrl,
    roleLabel: rolActivo,
  };

  return (
    <DashboardRoleContext.Provider
      value={{
        rolActivo,
        user,
        currentUser: sessionUser,
        modules: session?.modules,
        isLoading,
        isAuthenticated: Boolean(sessionUser),
      }}
    >
      {children}
    </DashboardRoleContext.Provider>
  );
}

export function useDashboardRole() {
  const context = React.useContext(DashboardRoleContext);
  if (!context) {
    throw new Error("useDashboardRole debe usarse dentro de DashboardRoleProvider.");
  }
  return context;
}

export function useOptionalDashboardRole() {
  return React.useContext(DashboardRoleContext);
}
