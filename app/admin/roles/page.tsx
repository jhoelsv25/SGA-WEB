import type { Metadata } from "next";
import { RolesPage } from "@/features/roles";

export const metadata: Metadata = {
  title: "Roles y Permisos",
  description: "Matriz de privilegios RBAC y políticas de acceso del SGA",
};

export default function AdminRolesRoute() {
  return <RolesPage />;
}
