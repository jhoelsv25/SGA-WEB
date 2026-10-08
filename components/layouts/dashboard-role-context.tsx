"use client";

import * as React from "react";
import type { UserRole } from "@/config";
import type { UserProfileData } from "./sidebar/nav-user";

import type { AuthModule, CurrentUser } from "@/features/auth";
import { useSession } from "@/features/auth";

export const ROLE_PROFILES: Record<UserRole, UserProfileData> = {
  teacher: {
    name: "Prof. Juan Carlos Pérez",
    email: "jperez@carmelinas.edu.pe",
    roleLabel: "Docente de Matemática y C.T.",
  },
  student: {
    name: "Alexia Ramos Quispe",
    email: "aramos@carmelinas.edu.pe",
    roleLabel: "Estudiante · 4° de Secundaria",
  },
  principal: {
    name: "Mg. Carmen Rosa Huamán",
    email: "chuaman@carmelinas.edu.pe",
    roleLabel: "Directora General I.E.",
  },
  director: {
    name: "Mg. Carmen Rosa Huamán",
    email: "chuaman@carmelinas.edu.pe",
    roleLabel: "Directora General I.E.",
  },
  admin: {
    name: "Ing. Roberto Alarcón",
    email: "admin@carmelinas.edu.pe",
    roleLabel: "Administrador de Sistemas SGA",
  },
  secretary: {
    name: "Sra. Maritza Ramos Valeriano",
    email: "secretaria@carmelinas.edu.pe",
    roleLabel: "Secretaría General I.E.",
  },
  secretaria: {
    name: "Sra. Maritza Ramos Valeriano",
    email: "secretaria@carmelinas.edu.pe",
    roleLabel: "Secretaría General I.E.",
  },
  docente: {
    name: "Prof. Juan Carlos Pérez",
    email: "jperez@carmelinas.edu.pe",
    roleLabel: "Docente de Matemática y C.T.",
  },
  estudiante: {
    name: "Alexia Ramos Quispe",
    email: "aramos@carmelinas.edu.pe",
    roleLabel: "Estudiante · 4° de Secundaria",
  },
  parent: {
    name: "Sra. María Elena Quispe",
    email: "mquispe@gmail.com",
    roleLabel: "Apoderada · Nivel Secundario",
  },
  apoderado: {
    name: "Sra. María Elena Quispe",
    email: "mquispe@gmail.com",
    roleLabel: "Apoderada · Nivel Secundario",
  },
};

export function mapRoleNameToUserRole(roleName?: string): UserRole {
  if (!roleName) return "admin";
  const lower = roleName.toLowerCase();
  if (lower.includes("admin")) return "admin";
  if (lower.includes("direct")) return "principal";
  if (lower.includes("secretar")) return "secretary";
  if (lower.includes("docent") || lower.includes("profesor")) return "teacher";
  if (lower.includes("estudiant") || lower.includes("alumn")) return "student";
  if (lower.includes("apoderad") || lower.includes("padre")) return "parent";
  return "admin";
}

export interface DashboardRoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  user: UserProfileData;
  currentUser?: CurrentUser;
  modules?: AuthModule[];
  isLoading: boolean;
  isAuthenticated: boolean;
}

const DashboardRoleContext = React.createContext<DashboardRoleContextType | null>(null);

export function DashboardRoleProvider({
  children,
  initialRole = "admin",
}: {
  children: React.ReactNode;
  initialRole?: UserRole;
}) {
  const { data: session, isLoading } = useSession();
  const [selectedRoleOverride, setSelectedRoleOverride] = React.useState<UserRole | null>(null);

  // RF-001 V2: el perfil activo de la sesión (puede tener varios perfiles)
  const activeProfileName = session?.user?.activeProfileName ?? session?.user?.roles?.[0];
  const activeRole: UserRole =
    selectedRoleOverride ??
    (activeProfileName ? mapRoleNameToUserRole(activeProfileName) : initialRole);

  const setRole = React.useCallback((newRole: UserRole) => {
    setSelectedRoleOverride(newRole);
  }, []);

  const sessionUser = session?.user;
  const user: UserProfileData = sessionUser
    ? {
        name:
          [sessionUser.firstName, sessionUser.lastName].filter(Boolean).join(" ").trim() ||
          sessionUser.username,
        email: sessionUser.email || `${sessionUser.username}@carmelinas.edu.pe`,
        avatar: sessionUser.avatarUrl,
        roleLabel: activeProfileName || "Administrador",
      }
    : ROLE_PROFILES[activeRole] || ROLE_PROFILES.admin;

  return (
    <DashboardRoleContext.Provider
      value={{
        role: activeRole,
        setRole,
        user,
        currentUser: session?.user,
        modules: session?.modules,
        isLoading,
        isAuthenticated: Boolean(session?.user),
      }}
    >
      {children}
    </DashboardRoleContext.Provider>
  );
}

export function useDashboardRole() {
  const context = React.useContext(DashboardRoleContext);
  if (!context) {
    throw new Error("useDashboardRole must be used within a DashboardRoleProvider.");
  }
  return context;
}

export function useOptionalDashboardRole() {
  return React.useContext(DashboardRoleContext);
}
