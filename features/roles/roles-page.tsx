"use client";

import { PageHeader } from "@/components/common/page-header";
import { ShieldCheckIcon } from "@hugeicons/core-free-icons";
import { RolesTable } from "./views/table/roles-table";

export function RolesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Roles y Permisos"
        description="Administra los perfiles de acceso y la matriz de privilegios del sistema."
        icon={ShieldCheckIcon}
        breadcrumbs={[
          { label: "Dashboard", href: "/admin/dashboard" },
          { label: "Administración", href: "#" },
          { label: "Roles y Permisos" },
        ]}
      />

      <RolesTable />
    </div>
  );
}
