import type { Metadata } from "next";
import { UsersPage } from "@/features/users";

export const metadata: Metadata = {
  title: "Gestión de Usuarios",
  description: "Administración de usuarios, roles y accesos del SGA",
};

export default function AdminUsersRoute() {
  return <UsersPage />;
}
