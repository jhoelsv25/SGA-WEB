"use client";

import { PageHeader } from "@/components/common/page-header";
import { ShieldCheckIcon } from "@hugeicons/core-free-icons";
import { RolesTable } from "./views/table/roles-table";

export function RolesPage() {
  return (
    <div className="animate-in fade-in-50 space-y-6 duration-300">
      <PageHeader
        title="Roles y Permisos"
        description="Administra los perfiles de acceso y la matriz de privilegios del sistema."
        icon={ShieldCheckIcon}
        breadcrumbs={[
          { label: "Inicio", href: "/admin/dashboard" },
          { label: "Administración" },
          { label: "Roles y Permisos" },
        ]}
      />

      <RolesTable />
    </div>
  );
}
