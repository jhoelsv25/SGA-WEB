"use client";

import * as React from "react";
import { PageHeader } from "@/components/common/page-header";
import { UserGroupIcon } from "@hugeicons/core-free-icons";
import { UsersTable } from "./views/table/users-table";
import { TableSkeleton } from "@/components/common/skeletons";

export function UsersPage() {
  return (
    <div className="animate-in fade-in-50 space-y-6 duration-300">
      <PageHeader
        title="Gestión de usuarios"
        description="Administra las cuentas de usuario, asignación de roles y estados de acceso al sistema."
        icon={UserGroupIcon}
        breadcrumbs={[
          { label: "Inicio", href: "/admin/dashboard" },
          { label: "Administración" },
          { label: "Usuarios" },
        ]}
      />

      <React.Suspense fallback={<TableSkeleton rows={5} columns={5} />}>
        <UsersTable />
      </React.Suspense>
    </div>
  );
}
