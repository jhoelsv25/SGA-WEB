import type { Metadata } from "next";
import { RolePermissionsPage } from "@/features/roles";

export const metadata: Metadata = {
  title: "Roles-Menú",
  description: "Asignación de las opciones de menú a las que tiene acceso cada rol.",
};

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <RolePermissionsPage roleId={id} />;
}
