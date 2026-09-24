"use client";

import * as React from "react";
import type { UserRole } from "@/config";
import type { UserProfileData } from "./sidebar/nav-user";

export const ROLE_PROFILES: Record<UserRole, UserProfileData> = {
  teacher: {
    name: "Prof. Juan Carlos Pérez",
    email: "jperez@carmelitas.edu.pe",
    roleLabel: "Docente de Matemática y C.T.",
  },
  student: {
    name: "Alexia Ramos Quispe",
    email: "aramos@carmelitas.edu.pe",
    roleLabel: "Estudiante · 4° de Secundaria",
  },
  principal: {
    name: "Mg. Carmen Rosa Huamán",
    email: "chuaman@carmelitas.edu.pe",
    roleLabel: "Directora General I.E.",
  },
  director: {
    name: "Mg. Carmen Rosa Huamán",
    email: "chuaman@carmelitas.edu.pe",
    roleLabel: "Directora General I.E.",
  },
  admin: {
    name: "Ing. Roberto Alarcón",
    email: "admin@carmelitas.edu.pe",
    roleLabel: "Administrador de Sistemas SGA",
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

interface DashboardRoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  user: UserProfileData;
}

const DashboardRoleContext = React.createContext<DashboardRoleContextType | null>(null);

export function DashboardRoleProvider({
  children,
  initialRole = "teacher",
}: {
  children: React.ReactNode;
  initialRole?: UserRole;
}) {
  const [role, setRole] = React.useState<UserRole>(initialRole);
  const user = React.useMemo(() => ROLE_PROFILES[role] || ROLE_PROFILES.teacher, [role]);

  return (
    <DashboardRoleContext.Provider value={{ role, setRole, user }}>
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
