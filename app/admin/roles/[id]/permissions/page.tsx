import type { Metadata } from "next";
import { RolePermissionsPage } from "@/features/roles";

export const metadata: Metadata = {
  title: "Matriz de Permisos",
  description: "Asignación granular de privilegios y permisos por rol en el sistema.",
};

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <RolePermissionsPage roleId={id} />;
}
