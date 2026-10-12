"use client";

import { PageHeader } from "@/components/common/page-header";
import { IdVerifiedIcon } from "@hugeicons/core-free-icons";
import { CargosTable } from "./views/table/cargos-table";

export function CargosPage() {
  return (
    <div className="animate-in fade-in-50 space-y-6 duration-300">
      <PageHeader
        title="Cargos"
        description="Administra los cargos del personal y los roles que sugieren al registrar una cuenta."
        icon={IdVerifiedIcon}
        breadcrumbs={[
          { label: "Inicio", href: "/admin/dashboard" },
          { label: "Administración" },
          { label: "Cargos" },
        ]}
      />

      <CargosTable />
    </div>
  );
}
