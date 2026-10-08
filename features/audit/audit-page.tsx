"use client";

import * as React from "react";
import { PageHeader } from "@/components/common/page-header";
import { Audit01Icon } from "@hugeicons/core-free-icons";
import { AuditTable } from "./views/table/audit-table";
import { Spinner } from "@/components/common/spinner";

export function AuditPage() {
  return (
    <div className="animate-in fade-in-50 space-y-6 duration-300">
      <PageHeader
        title="Bitácora de Auditoría"
        description="Trazabilidad inmutable de eventos críticos, accesos y modificaciones en el sistema institucional."
        icon={Audit01Icon}
        breadcrumbs={[
          { label: "Dashboard", href: "/admin/dashboard" },
          { label: "Seguridad y Accesos", href: "#" },
          { label: "Bitácora de Auditoría" },
        ]}
      />

      <React.Suspense
        fallback={
          <div className="flex h-48 items-center justify-center">
            <Spinner className="text-primary h-8 w-8" />
          </div>
        }
      >
        <AuditTable />
      </React.Suspense>
    </div>
  );
}
