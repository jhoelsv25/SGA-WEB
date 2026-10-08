"use client";

import * as React from "react";
import { PageHeader } from "@/components/common/page-header";
import { UserGroupIcon } from "@hugeicons/core-free-icons";
import { UsersTable } from "./views/table/users-table";
import { Spinner } from "@/components/common/spinner";

export function UsersPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Gestión de Usuarios"
        description="Administra las cuentas de usuario, asignación de roles y estados de acceso al sistema."
        icon={UserGroupIcon}
        breadcrumbs={[
          { label: "Dashboard", href: "/admin/dashboard" },
          { label: "Administración", href: "#" },
          { label: "Usuarios" },
        ]}
      />

      <React.Suspense
        fallback={
          <div className="flex h-48 items-center justify-center">
            <Spinner className="text-primary h-8 w-8" />
          </div>
        }
      >
        <UsersTable />
      </React.Suspense>
    </div>
  );
}
